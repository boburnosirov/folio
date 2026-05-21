"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings2,
  X,
  BookOpen,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { BookFull } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

// ── Constants ─────────────────────────────────────────────────────────────────
const WORDS_PER_PAGE = 1200;
const STORAGE_KEY = (slug: string) => `folio_read_${slug}`;

const FONT_FAMILIES = [
  { label: "Serif", value: "'Georgia', 'Times New Roman', serif" },
  { label: "Sans", value: "system-ui, -apple-system, sans-serif" },
  { label: "Mono", value: "'Courier New', Courier, monospace" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function splitIntoPages(text: string, wordsPerPage: number): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter((p) => p.length > 2);

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

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ReaderSkeleton() {
  return (
    <div className="animate-pulse space-y-4 px-6 py-8">
      {[100, 92, 88, 96, 84, 90, 78, 94].map((w, i) => (
        <div
          key={i}
          className="h-4 rounded bg-foreground/8"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

// ── Settings panel ────────────────────────────────────────────────────────────
function SettingsPanel({
  fontSize,
  setFontSize,
  fontIndex,
  setFontIndex,
  onClose,
}: {
  fontSize: number;
  setFontSize: (v: number) => void;
  fontIndex: number;
  setFontIndex: (v: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-foreground/10 bg-background/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Настройки чтения</p>
        <button onClick={onClose} className="text-foreground/40 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs text-foreground/45">Размер шрифта</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/12 text-sm hover:bg-foreground/8"
          >
            A−
          </button>
          <span className="flex-1 text-center text-sm font-mono">{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(26, fontSize + 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/12 text-sm hover:bg-foreground/8"
          >
            A+
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs text-foreground/45">Шрифт</p>
        <div className="flex gap-2">
          {FONT_FAMILIES.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setFontIndex(i)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                i === fontIndex
                  ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]"
                  : "border-foreground/10 hover:bg-foreground/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ReaderClient({ book }: { book: BookFull }) {
  const title = book.title_ru ?? book.title;
  const authorName = book.authors
    ? (book.authors.name_ru ?? book.authors.name)
    : null;

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const [fontSize, setFontSize] = useState(18);
  const [fontIndex, setFontIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [showBanner, setShowBanner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Check auth + restore saved page ──
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setIsLoggedIn(!!user);

      if (user) {
        // Try to load progress from Supabase first
        const { data } = await supabase
          .from("reading_progress")
          .select("position")
          .eq("user_id", user.id)
          .eq("book_id", book.id)
          .limit(1);
        if (data && data.length > 0) {
          const page = parseInt(data[0].position, 10);
          if (!isNaN(page)) {
            setCurrentPage(page);
            setProgressLoaded(true);
            return;
          }
        }
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY(book.slug));
        if (saved) {
          const { page } = JSON.parse(saved) as { page: number };
          if (typeof page === "number") setCurrentPage(page);
        }
      } catch {}
      setProgressLoaded(true);
    });

    const t = setTimeout(() => setShowBanner(true), 5000);
    return () => clearTimeout(t);
  }, [book.slug, book.id]);

  // ── Save page on change (debounced) ──
  useEffect(() => {
    if (!progressLoaded) return;

    // Always save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY(book.slug), JSON.stringify({ page: currentPage }));
    } catch {}

    // Debounce Supabase save
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("reading_progress").upsert({
        user_id: user.id,
        book_id: book.id,
        position: String(currentPage),
        updated_at: new Date().toISOString(),
      });
    }, 1500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [book.slug, book.id, currentPage, progressLoaded]);

  // ── Scroll to top on page change ──
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ── Fetch text ──
  useEffect(() => {
    // Priority: txt_url → gutenberg_id → error
    if (book.txt_url) {
      setStatus("loading");
      fetch(book.txt_url)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          return r.text();
        })
        .then((text) => {
          const chunks = splitIntoPages(text, WORDS_PER_PAGE);
          setPages(chunks);
          setStatus("ok");
        })
        .catch(() => setStatus("error"));
      return;
    }

    if (book.gutenberg_id) {
      setStatus("loading");
      fetch(`/api/gutenberg/${book.gutenberg_id}`)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          return r.json() as Promise<{ text: string }>;
        })
        .then(({ text }) => {
          const chunks = splitIntoPages(text, WORDS_PER_PAGE);
          setPages(chunks);
          setStatus("ok");
        })
        .catch(() => setStatus("error"));
      return;
    }

    setStatus("error");
  }, [book.txt_url, book.gutenberg_id]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrentPage((p) => Math.max(0, Math.min(pages.length - 1, p + dir)));
    },
    [pages.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const progress = pages.length > 1
    ? Math.round(((currentPage + 1) / pages.length) * 100)
    : 0;

  const fontStyle = useMemo(
    () => ({
      fontSize,
      fontFamily: FONT_FAMILIES[fontIndex].value,
      lineHeight: 1.85,
    }),
    [fontSize, fontIndex]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Progress bar ── */}
      {status === "ok" && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-foreground/8">
          <div
            className="h-full bg-[#0071e3] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 flex h-13 items-center justify-between border-b border-foreground/8 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
        <Link
          href={`/books/${book.slug}`}
          className="flex items-center gap-2 text-sm text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">К книге</span>
        </Link>

        <div className="min-w-0 flex-1 px-4 text-center">
          <p className="truncate text-sm font-medium text-foreground/70">{title}</p>
          {status === "ok" && (
            <p className="text-xs text-foreground/35">
              Страница {currentPage + 1} из {pages.length}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/8 hover:text-foreground"
          >
            <Settings2 className="h-4 w-4" />
          </button>
          {showSettings && (
            <SettingsPanel
              fontSize={fontSize}
              setFontSize={setFontSize}
              fontIndex={fontIndex}
              setFontIndex={setFontIndex}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </header>

      {/* ── Content ── */}
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-10 sm:px-6"
      >
        <div className="mx-auto max-w-[680px]">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-20 text-foreground/40">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Загружаем текст…</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <AlertCircle className="h-10 w-10 text-foreground/30" />
              <div>
                <p className="font-semibold text-foreground/60">Текст пока недоступен</p>
                <p className="mt-1 text-sm text-foreground/40">
                  Текст этой книги ещё не добавлен в библиотеку
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {book.epub_url && (
                  <a
                    href={book.epub_url}
                    download
                    className="flex items-center gap-2 rounded-full border border-foreground/12 px-4 py-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Скачать EPUB
                  </a>
                )}
                {book.pdf_url && (
                  <a
                    href={book.pdf_url}
                    download
                    className="flex items-center gap-2 rounded-full border border-foreground/12 px-4 py-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Скачать PDF
                  </a>
                )}
                {book.gutenberg_id && (
                  <a
                    href={`https://www.gutenberg.org/ebooks/${book.gutenberg_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-foreground/12 px-4 py-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Читать на Project Gutenberg
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
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -20 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentPage === 0 && (
                  <div className="mb-10 border-b border-foreground/8 pb-8 text-center">
                    <h1
                      className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                      style={{ fontFamily: FONT_FAMILIES[fontIndex].value }}
                    >
                      {title}
                    </h1>
                    {authorName && (
                      <p className="mt-3 text-base text-foreground/50">{authorName}</p>
                    )}
                  </div>
                )}

                <div style={fontStyle} className="text-foreground/85">
                  {pages[currentPage]?.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-5 text-justify leading-[1.85]">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* ── Bottom navigation ── */}
      {status === "ok" && (
        <footer className="sticky bottom-0 z-40 border-t border-foreground/8 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[680px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <button
              onClick={() => go(-1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1.5 rounded-full border border-foreground/12 px-4 py-2 text-sm text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </button>

            <div className="flex items-center gap-2 text-xs text-foreground/35">
              <span className="tabular-nums">{currentPage + 1}</span>
              <span>/</span>
              <span className="tabular-nums">{pages.length}</span>
            </div>

            <button
              onClick={() => go(1)}
              disabled={currentPage === pages.length - 1}
              className="flex items-center gap-1.5 rounded-full border border-foreground/12 px-4 py-2 text-sm text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              Вперёд
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      )}

      {/* ── Anonymous progress banner ── */}
      {showBanner && status === "ok" && !isLoggedIn && (
        <div className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-foreground/10 bg-background/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-3 top-3 text-foreground/30 hover:text-foreground/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="text-sm font-medium">Войдите, чтобы не потерять прогресс</p>
          <p className="mt-1 text-xs text-foreground/45">
            Сейчас прогресс сохраняется только в этом браузере.
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/login"
              className="flex-1 rounded-full bg-[#0071e3] px-3 py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-[#0077ed]"
            >
              Войти
            </Link>
            <button
              onClick={() => setShowBanner(false)}
              className="flex-1 rounded-full border border-foreground/12 px-3 py-1.5 text-xs text-foreground/50 hover:text-foreground"
            >
              Не сейчас
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
