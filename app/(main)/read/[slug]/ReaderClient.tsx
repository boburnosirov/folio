"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Settings2, X,
  BookOpen, AlertCircle, Loader2, Sun, Moon, Coffee,
} from "lucide-react";
import type { BookFull } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

// ─── Constants ────────────────────────────────────────────────────────────────
const WORDS_PER_PAGE = 350;
const STORAGE_KEY   = (slug: string) => `folio_read_${slug}`;
const HIGHLIGHT_KEY = (slug: string) => `folio_hl_${slug}`;

const FONT_FAMILIES = [
  { label: "Serif",  value: "'Georgia', 'Times New Roman', serif" },
  { label: "Sans",   value: "system-ui, -apple-system, sans-serif" },
  { label: "Mono",   value: "'Courier New', Courier, monospace" },
];

const THEMES = {
  light: { key: "light", label: "Светлая", icon: Sun,    bg: "#ffffff", fg: "#1a1a1a", surface: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.08)" },
  sepia: { key: "sepia", label: "Сепия",   icon: Coffee, bg: "#f5efe0", fg: "#3d2b1f", surface: "rgba(0,0,0,0.05)", border: "rgba(0,0,0,0.10)" },
  dark:  { key: "dark",  label: "Ночная",  icon: Moon,   bg: "#111318", fg: "#d4d4d8", surface: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.08)" },
} as const;
type ThemeKey = keyof typeof THEMES;

const HL_COLORS: Record<string, { bg: string; label: string }> = {
  yellow: { bg: "#fde047", label: "Жёлтый" },
  green:  { bg: "#86efac", label: "Зелёный" },
  blue:   { bg: "#93c5fd", label: "Голубой" },
  pink:   { bg: "#f9a8d4", label: "Розовый" },
};

interface Highlight {
  id: string;
  page: number;
  text: string;
  color: string;
}

// ─── Text splitting ───────────────────────────────────────────────────────────
function splitIntoPages(raw: string, wordsPerPage: number): string[] {
  if (!raw.trim()) return [];

  // Try paragraph-based (double newline) split
  let paragraphs = raw.split(/\n{2,}/).map(p => p.replace(/\n/g, " ").trim()).filter(p => p.length > 2);

  // Fallback: if fewer than 5 paragraphs (PDF-style continuous text), split by sentences
  if (paragraphs.length < 5) {
    const sentences = raw.replace(/\n+/g, " ").match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) ?? [];
    const grouped: string[] = [];
    let current = "";
    for (const s of sentences) {
      if ((current + s).split(/\s+/).length > wordsPerPage && current) {
        grouped.push(current.trim());
        current = s;
      } else {
        current += " " + s;
      }
    }
    if (current.trim()) grouped.push(current.trim());
    if (grouped.length > 1) return grouped;
  }

  // Standard paragraph grouping
  const pages: string[] = [];
  let current: string[] = [];
  let wordCount = 0;
  for (const para of paragraphs) {
    const words = para.split(/\s+/).length;
    if (wordCount + words > wordsPerPage && current.length > 0) {
      pages.push(current.join("\n\n"));
      current = [];
      wordCount = 0;
    }
    current.push(para);
    wordCount += words;
  }
  if (current.length > 0) pages.push(current.join("\n\n"));
  return pages;
}

// ─── Apply highlights to paragraph text ──────────────────────────────────────
function escHtml(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function applyHighlights(text: string, highlights: Highlight[], page: number): string {
  let html = escHtml(text);
  const pageHl = highlights.filter(h => h.page === page);
  for (const h of pageHl) {
    const bg = HL_COLORS[h.color]?.bg ?? "#fde047";
    const escaped = escHtml(h.text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(escaped, "g"),
      `<mark data-hl="${h.id}" style="background:${bg};border-radius:3px;padding:0 2px;cursor:pointer">${escHtml(h.text)}</mark>`
    );
  }
  return html;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ReaderSkeleton() {
  return (
    <div className="animate-pulse space-y-4 px-6 py-8">
      {[100, 92, 88, 96, 84, 90, 78, 94, 85, 91].map((w, i) => (
        <div key={i} className="h-4 rounded" style={{ width: `${w}%`, background: "currentColor", opacity: 0.08 }} />
      ))}
    </div>
  );
}

// ─── Highlight toolbar ────────────────────────────────────────────────────────
function HighlightToolbar({
  x, y, onColor, onRemove, hasHighlight, theme,
}: {
  x: number; y: number; onColor: (c: string) => void; onRemove: () => void;
  hasHighlight: boolean; theme: typeof THEMES[ThemeKey];
}) {
  return (
    <div
      className="fixed z-[100] flex items-center gap-1 rounded-xl border px-2 py-1.5 shadow-2xl"
      style={{ left: x, top: y - 52, transform: "translateX(-50%)",
        background: theme.bg, borderColor: theme.border,
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)" }}
    >
      {Object.entries(HL_COLORS).map(([key, val]) => (
        <button
          key={key}
          title={val.label}
          onClick={() => onColor(key)}
          className="h-5 w-5 rounded-full border-2 border-white/40 transition-transform hover:scale-110 active:scale-95"
          style={{ background: val.bg }}
        />
      ))}
      {hasHighlight && (
        <>
          <div className="mx-1 h-4 w-px" style={{ background: theme.border }} />
          <button
            onClick={onRemove}
            className="rounded px-1.5 py-0.5 text-[10px] font-medium hover:opacity-70"
            style={{ color: theme.fg, opacity: 0.5 }}
          >
            ✕ убрать
          </button>
        </>
      )}
    </div>
  );
}

// ─── Settings panel ───────────────────────────────────────────────────────────
function SettingsPanel({
  fontSize, setFontSize, fontIndex, setFontIndex,
  themeKey, setThemeKey, onClose, theme,
}: {
  fontSize: number; setFontSize: (v: number) => void;
  fontIndex: number; setFontIndex: (v: number) => void;
  themeKey: ThemeKey; setThemeKey: (k: ThemeKey) => void;
  onClose: () => void; theme: typeof THEMES[ThemeKey];
}) {
  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border p-4 shadow-2xl"
      style={{ background: theme.bg, borderColor: theme.border,
        boxShadow: "0 16px 48px rgba(0,0,0,0.20)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: theme.fg }}>Настройки чтения</p>
        <button onClick={onClose} style={{ color: theme.fg, opacity: 0.4 }} className="hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Font size */}
      <div className="mb-4">
        <p className="mb-2 text-xs" style={{ color: theme.fg, opacity: 0.45 }}>Размер шрифта</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full border text-sm"
            style={{ borderColor: theme.border, color: theme.fg }}
          >A−</button>
          <span className="flex-1 text-center text-sm font-mono" style={{ color: theme.fg }}>{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(28, fontSize + 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full border text-sm"
            style={{ borderColor: theme.border, color: theme.fg }}
          >A+</button>
        </div>
      </div>

      {/* Font family */}
      <div className="mb-4">
        <p className="mb-2 text-xs" style={{ color: theme.fg, opacity: 0.45 }}>Шрифт</p>
        <div className="flex gap-2">
          {FONT_FAMILIES.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setFontIndex(i)}
              className="flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: i === fontIndex ? "#0071e3" : theme.border,
                background: i === fontIndex ? "#0071e310" : "transparent",
                color: i === fontIndex ? "#0071e3" : theme.fg,
              }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <p className="mb-2 text-xs" style={{ color: theme.fg, opacity: 0.45 }}>Тема</p>
        <div className="flex gap-2">
          {(Object.values(THEMES) as typeof THEMES[ThemeKey][]).map((t) => {
            const Icon = t.icon;
            const active = t.key === themeKey;
            return (
              <button
                key={t.key}
                onClick={() => setThemeKey(t.key as ThemeKey)}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 text-xs font-medium transition-all"
                style={{
                  borderColor: active ? "#0071e3" : theme.border,
                  background: active ? "#0071e310" : t.bg,
                  color: active ? "#0071e3" : t.fg,
                }}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Continue prompt ──────────────────────────────────────────────────────────
function ContinuePrompt({
  page, total, onContinue, onRestart, theme,
}: {
  page: number; total: number; onContinue: () => void; onRestart: () => void;
  theme: typeof THEMES[ThemeKey];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4"
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-4 shadow-2xl"
        style={{ background: theme.bg, borderColor: theme.border,
          boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}
      >
        <p className="text-sm font-semibold" style={{ color: theme.fg }}>
          Продолжить чтение?
        </p>
        <p className="mt-1 text-xs" style={{ color: theme.fg, opacity: 0.5 }}>
          Вы остановились на странице {page + 1} из {total}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onContinue}
            className="flex-1 rounded-full py-2 text-sm font-semibold text-white"
            style={{ background: "#0071e3" }}
          >
            Продолжить
          </button>
          <button
            onClick={onRestart}
            className="flex-1 rounded-full border py-2 text-sm"
            style={{ borderColor: theme.border, color: theme.fg, opacity: 0.6 }}
          >
            С начала
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ReaderClient({ book }: { book: BookFull }) {
  const title      = book.title_ru ?? book.title;
  const authorName = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;

  // ── Content state
  const [status,  setStatus]  = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [pages,   setPages]   = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction,   setDirection]   = useState<1 | -1>(1);

  // ── Settings
  const [fontSize,  setFontSizeRaw]  = useState(18);
  const [fontIndex, setFontIndexRaw] = useState(0);
  const [themeKey,  setThemeKeyRaw]  = useState<ThemeKey>("light");
  const [showSettings, setShowSettings] = useState(false);
  const theme = THEMES[themeKey];

  // ── Highlights
  const [highlights,    setHighlights]    = useState<Highlight[]>([]);
  const [hlToolbar,     setHlToolbar]     = useState<{ x: number; y: number; text: string } | null>(null);
  const [selectedHlId,  setSelectedHlId]  = useState<string | null>(null);

  // ── Progress & prompts
  const [savedPage,       setSavedPage]       = useState<number | null>(null);
  const [showContinue,    setShowContinue]    = useState(false);
  const [progressLoaded,  setProgressLoaded]  = useState(false);
  const [isLoggedIn,      setIsLoggedIn]      = useState(false);
  const [showBanner,      setShowBanner]      = useState(false);

  const containerRef  = useRef<HTMLDivElement>(null);
  const saveTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Persist helpers
  function persistFontSize(v: number)  { setFontSizeRaw(v);  try { localStorage.setItem("folio_fontSize",  String(v)); } catch {} }
  function persistFontIndex(v: number) { setFontIndexRaw(v); try { localStorage.setItem("folio_fontIndex", String(v)); } catch {} }
  function persistTheme(k: ThemeKey)   { setThemeKeyRaw(k);  try { localStorage.setItem("folio_theme",     k);         } catch {} }

  // ── Load settings from localStorage
  useEffect(() => {
    try {
      const fs = localStorage.getItem("folio_fontSize");
      const fi = localStorage.getItem("folio_fontIndex");
      const th = localStorage.getItem("folio_theme") as ThemeKey | null;
      if (fs) setFontSizeRaw(parseInt(fs));
      if (fi) setFontIndexRaw(parseInt(fi));
      if (th && THEMES[th]) setThemeKeyRaw(th);
    } catch {}
  }, []);

  // ── Load highlights
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HIGHLIGHT_KEY(book.slug));
      if (raw) setHighlights(JSON.parse(raw));
    } catch {}
  }, [book.slug]);

  function saveHighlights(hl: Highlight[]) {
    setHighlights(hl);
    try { localStorage.setItem(HIGHLIGHT_KEY(book.slug), JSON.stringify(hl)); } catch {}
  }

  // ── Auth + restore saved page
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setIsLoggedIn(!!user);
      let savedP: number | null = null;

      if (user) {
        const { data } = await supabase
          .from("reading_progress")
          .select("position")
          .eq("user_id", user.id)
          .eq("book_id", book.id)
          .limit(1);
        if (data?.[0]) {
          const p = parseInt(data[0].position, 10);
          if (!isNaN(p) && p > 0) savedP = p;
        }
      }

      if (savedP === null) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY(book.slug));
          if (raw) {
            const { page } = JSON.parse(raw) as { page: number };
            if (typeof page === "number" && page > 0) savedP = page;
          }
        } catch {}
      }

      setSavedPage(savedP);
      setProgressLoaded(true);
    });

    const t = setTimeout(() => setShowBanner(true), 8000);
    return () => clearTimeout(t);
  }, [book.slug, book.id]);

  // Show continue prompt once pages loaded + progress known
  useEffect(() => {
    if (progressLoaded && pages.length > 0 && savedPage !== null && savedPage > 0) {
      setShowContinue(true);
    }
  }, [progressLoaded, pages.length, savedPage]);

  // ── Save progress on page change
  useEffect(() => {
    if (!progressLoaded) return;
    try { localStorage.setItem(STORAGE_KEY(book.slug), JSON.stringify({ page: currentPage })); } catch {}

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("reading_progress").upsert({
        user_id: user.id, book_id: book.id,
        position: String(currentPage), updated_at: new Date().toISOString(),
      });
    }, 1500);

    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [book.slug, book.id, currentPage, progressLoaded]);

  // ── Scroll to top on page change
  useEffect(() => { containerRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [currentPage]);

  // ── Fetch text
  useEffect(() => {
    if (book.txt_url) {
      setStatus("loading");
      fetch(book.txt_url)
        .then(r => { if (!r.ok) throw new Error(r.statusText); return r.text(); })
        .then(text => { setPages(splitIntoPages(text, WORDS_PER_PAGE)); setStatus("ok"); })
        .catch(() => setStatus("error"));
      return;
    }
    if (book.gutenberg_id) {
      setStatus("loading");
      fetch(`/api/gutenberg/${book.gutenberg_id}`)
        .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() as Promise<{ text: string }>; })
        .then(({ text }) => { setPages(splitIntoPages(text, WORDS_PER_PAGE)); setStatus("ok"); })
        .catch(() => setStatus("error"));
      return;
    }
    setStatus("error");
  }, [book.txt_url, book.gutenberg_id]);

  // ── Navigation
  const go = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCurrentPage(p => Math.max(0, Math.min(pages.length - 1, p + dir)));
    setShowContinue(false);
  }, [pages.length]);

  // ── Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,textarea")) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // ── Text selection → highlight toolbar
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";
    if (text.length < 3) { setHlToolbar(null); return; }

    // Check if clicking an existing highlight
    const target = e.target as HTMLElement;
    const markEl = target.closest("mark[data-hl]");
    if (markEl) {
      const id = markEl.getAttribute("data-hl");
      setSelectedHlId(id);
      setHlToolbar({ x: e.clientX, y: e.clientY, text: markEl.textContent ?? "" });
      return;
    }

    setSelectedHlId(null);
    setHlToolbar({ x: e.clientX, y: e.clientY, text });
  }, []);

  function addHighlight(color: string) {
    if (!hlToolbar) return;
    const id = Math.random().toString(36).slice(2);
    saveHighlights([...highlights, { id, page: currentPage, text: hlToolbar.text, color }]);
    setHlToolbar(null);
    window.getSelection()?.removeAllRanges();
  }

  function removeHighlight() {
    if (selectedHlId) {
      saveHighlights(highlights.filter(h => h.id !== selectedHlId));
    } else if (hlToolbar) {
      saveHighlights(highlights.filter(h => h.text !== hlToolbar.text || h.page !== currentPage));
    }
    setHlToolbar(null);
    setSelectedHlId(null);
  }

  // ── Close toolbar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-hl-toolbar]") && !target.closest("mark")) setHlToolbar(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const progress = pages.length > 1 ? Math.round(((currentPage + 1) / pages.length) * 100) : 0;

  const fontStyle = useMemo(() => ({
    fontSize, fontFamily: FONT_FAMILIES[fontIndex].value, lineHeight: 1.9,
  }), [fontSize, fontIndex]);

  // ── Current page text with highlights applied
  const pageHtml = useMemo(() => {
    const text = pages[currentPage] ?? "";
    return text.split("\n\n").map(para => applyHighlights(para, highlights, currentPage));
  }, [pages, currentPage, highlights]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: theme.bg, color: theme.fg, transition: "background 0.3s, color 0.3s" }}>

      {/* Progress bar */}
      {status === "ok" && (
        <div className="fixed left-0 right-0 top-0 z-50 h-0.5" style={{ background: theme.surface }}>
          <div className="h-full bg-[#0071e3] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex h-13 items-center justify-between px-4 backdrop-blur-xl sm:px-6"
        style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg + "e8" }}
      >
        <Link href={`/books/${book.slug}`}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: theme.fg, opacity: 0.5 }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">К книге</span>
        </Link>

        <div className="min-w-0 flex-1 px-4 text-center">
          <p className="truncate text-sm font-medium" style={{ color: theme.fg, opacity: 0.7 }}>{title}</p>
          {status === "ok" && (
            <p className="text-xs" style={{ color: theme.fg, opacity: 0.35 }}>
              {currentPage + 1} / {pages.length} · {progress}%
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSettings(s => !s)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            style={{ color: theme.fg, opacity: 0.5 }}
          >
            <Settings2 className="h-4 w-4" />
          </button>
          {showSettings && (
            <SettingsPanel
              fontSize={fontSize} setFontSize={persistFontSize}
              fontIndex={fontIndex} setFontIndex={persistFontIndex}
              themeKey={themeKey} setThemeKey={persistTheme}
              onClose={() => setShowSettings(false)} theme={theme}
            />
          )}
        </div>
      </header>

      {/* Content */}
      <main ref={containerRef} className="flex-1 overflow-y-auto px-4 py-10 sm:px-6" onMouseUp={handleMouseUp}>
        <div className="mx-auto max-w-[680px]">

          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-20" style={{ color: theme.fg, opacity: 0.4 }}>
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Загружаем текст…</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <AlertCircle className="h-10 w-10" style={{ color: theme.fg, opacity: 0.3 }} />
              <div>
                <p className="font-semibold" style={{ color: theme.fg, opacity: 0.6 }}>Текст пока недоступен</p>
                <p className="mt-1 text-sm" style={{ color: theme.fg, opacity: 0.4 }}>
                  Текст этой книги ещё не добавлен в библиотеку
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {book.epub_url && (
                  <a href={book.epub_url} download
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-70"
                    style={{ borderColor: theme.border, color: theme.fg }}
                  >
                    <BookOpen className="h-3.5 w-3.5" />Скачать EPUB
                  </a>
                )}
                {book.pdf_url && (
                  <a href={book.pdf_url} download
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-70"
                    style={{ borderColor: theme.border, color: theme.fg }}
                  >
                    <BookOpen className="h-3.5 w-3.5" />Скачать PDF
                  </a>
                )}
              </div>
            </div>
          )}

          {status === "ok" && (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.article
                key={currentPage}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentPage === 0 && (
                  <div className="mb-10 pb-8 text-center" style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
                      style={{ fontFamily: FONT_FAMILIES[fontIndex].value, color: theme.fg }}>
                      {title}
                    </h1>
                    {authorName && <p className="mt-3 text-base" style={{ color: theme.fg, opacity: 0.5 }}>{authorName}</p>}
                  </div>
                )}

                <div style={{ ...fontStyle, color: theme.fg }}>
                  {pageHtml.map((html, i) => (
                    <p
                      key={i}
                      className="mb-5 text-justify"
                      style={{ lineHeight: 1.9, opacity: 0.88 }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Highlight toolbar */}
      <AnimatePresence>
        {hlToolbar && (
          <motion.div
            data-hl-toolbar
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
          >
            <HighlightToolbar
              x={hlToolbar.x} y={hlToolbar.y}
              onColor={addHighlight} onRemove={removeHighlight}
              hasHighlight={!!selectedHlId} theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue reading prompt */}
      <AnimatePresence>
        {showContinue && savedPage !== null && pages.length > 0 && (
          <ContinuePrompt
            page={savedPage} total={pages.length}
            onContinue={() => { setCurrentPage(savedPage!); setShowContinue(false); }}
            onRestart={() => { setCurrentPage(0); setShowContinue(false); }}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      {status === "ok" && (
        <footer
          className="sticky bottom-0 z-40 backdrop-blur-xl"
          style={{ borderTop: `1px solid ${theme.border}`, background: theme.bg + "e8" }}
        >
          <div className="mx-auto flex max-w-[680px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <button
              onClick={() => go(-1)} disabled={currentPage === 0}
              className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-70 disabled:pointer-events-none disabled:opacity-25"
              style={{ borderColor: theme.border, color: theme.fg }}
            >
              <ChevronLeft className="h-4 w-4" />Назад
            </button>

            {/* Page jump input */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: theme.fg, opacity: 0.4 }}>
              <input
                type="number"
                min={1}
                max={pages.length}
                value={currentPage + 1}
                onChange={e => {
                  const v = parseInt(e.target.value) - 1;
                  if (!isNaN(v) && v >= 0 && v < pages.length) {
                    setDirection(v > currentPage ? 1 : -1);
                    setCurrentPage(v);
                  }
                }}
                className="w-12 rounded-lg border bg-transparent text-center text-xs outline-none focus:border-[#0071e3]"
                style={{ borderColor: theme.border, color: theme.fg, padding: "2px 4px" }}
              />
              <span>/</span>
              <span>{pages.length}</span>
            </div>

            <button
              onClick={() => go(1)} disabled={currentPage === pages.length - 1}
              className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-70 disabled:pointer-events-none disabled:opacity-25"
              style={{ borderColor: theme.border, color: theme.fg }}
            >
              Вперёд<ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bar strip */}
          <div className="h-0.5 w-full" style={{ background: theme.surface }}>
            <div className="h-full bg-[#0071e3] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </footer>
      )}

      {/* Anonymous progress banner */}
      {showBanner && status === "ok" && !isLoggedIn && !showContinue && (
        <div
          className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border p-4 shadow-2xl"
          style={{ background: theme.bg, borderColor: theme.border,
            boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}
        >
          <button onClick={() => setShowBanner(false)}
            className="absolute right-3 top-3" style={{ color: theme.fg, opacity: 0.3 }}>
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="text-sm font-medium" style={{ color: theme.fg }}>Войдите, чтобы не потерять прогресс</p>
          <p className="mt-1 text-xs" style={{ color: theme.fg, opacity: 0.45 }}>
            Сейчас прогресс сохраняется только в этом браузере.
          </p>
          <div className="mt-3 flex gap-2">
            <Link href="/login"
              className="flex-1 rounded-full py-1.5 text-center text-xs font-semibold text-white"
              style={{ background: "#0071e3" }}
            >Войти</Link>
            <button onClick={() => setShowBanner(false)}
              className="flex-1 rounded-full border py-1.5 text-xs"
              style={{ borderColor: theme.border, color: theme.fg, opacity: 0.55 }}
            >Не сейчас</button>
          </div>
        </div>
      )}
    </div>
  );
}
