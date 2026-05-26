"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Settings, Sun, Moon, Monitor, Check, Palette, Zap, X, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCENTS = [
  { key: "blue",   label: "Синий",   value: "#0071e3" },
  { key: "purple", label: "Фиолет",  value: "#8b5cf6" },
  { key: "green",  label: "Зелёный", value: "#10b981" },
  { key: "rose",   label: "Розовый", value: "#f43f5e" },
  { key: "amber",  label: "Янтарь",  value: "#f59e0b" },
] as const;

const FONT_SCALES = [
  { key: "compact", label: "Мельче",   scale: 0.92 },
  { key: "normal",  label: "Обычный",  scale: 1.00 },
  { key: "large",   label: "Крупнее",  scale: 1.12 },
] as const;

function applyAccent(hex: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--accent-color", hex);
}

function applyFontScale(scale: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--font-scale", String(scale));
}

function applyReducedMotion(enabled: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("force-reduced-motion", enabled);
}

interface Props {
  /** Compact mode = smaller button used in admin sidebar */
  compact?: boolean;
}

export function SettingsMenu({ compact = false }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const [accent, setAccentState]    = useState<string>("blue");
  const [fontScale, setFontScaleState] = useState<string>("normal");
  const [reducedMotion, setReducedMotionState] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ── Hydrate from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const ac = localStorage.getItem("folio_accent");
      const fs = localStorage.getItem("folio_fontScale");
      const rm = localStorage.getItem("folio_reducedMotion");
      if (ac) {
        const found = ACCENTS.find(a => a.key === ac);
        if (found) { setAccentState(ac); applyAccent(found.value); }
      }
      if (fs) {
        const found = FONT_SCALES.find(f => f.key === fs);
        if (found) { setFontScaleState(fs); applyFontScale(found.scale); }
      }
      if (rm === "1") { setReducedMotionState(true); applyReducedMotion(true); }
    } catch {}
  }, []);

  // ── Close on outside click + Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function setAccent(key: string) {
    const found = ACCENTS.find(a => a.key === key);
    if (!found) return;
    setAccentState(key);
    applyAccent(found.value);
    try { localStorage.setItem("folio_accent", key); } catch {}
  }

  function setFontScale(key: string) {
    const found = FONT_SCALES.find(f => f.key === key);
    if (!found) return;
    setFontScaleState(key);
    applyFontScale(found.scale);
    try { localStorage.setItem("folio_fontScale", key); } catch {}
  }

  function setReducedMotion(v: boolean) {
    setReducedMotionState(v);
    applyReducedMotion(v);
    try { localStorage.setItem("folio_reducedMotion", v ? "1" : "0"); } catch {}
  }

  function resetAll() {
    setTheme("system");
    setAccent("blue");
    setFontScale("normal");
    setReducedMotion(false);
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full opacity-0" aria-hidden />
    );
  }

  const themes = [
    { key: "light",  label: "Светлая", icon: Sun },
    { key: "dark",   label: "Тёмная",  icon: Moon },
    { key: "system", label: "Авто",    icon: Monitor },
  ];

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(v => !v)}
        aria-label="Настройки оформления"
        aria-expanded={open}
        className={
          compact
            ? "h-8 w-8 rounded-full text-foreground/55 hover:bg-foreground/[0.06] hover:text-foreground"
            : "h-9 w-9 rounded-full text-foreground/62 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        }
      >
        <Settings className="h-4 w-4" />
      </Button>

      {open && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="fixed inset-x-4 bottom-4 z-50 max-h-[80vh] overflow-y-auto rounded-2xl border border-foreground/10 bg-background/98 p-4 shadow-2xl backdrop-blur-xl md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:inset-x-auto md:max-h-none md:w-80"
            role="menu"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Настройки оформления</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="flex h-6 w-6 items-center justify-center rounded text-foreground/40 hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Theme */}
            <div className="mb-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/45">
                <Palette className="h-3 w-3" /> Тема
              </p>
              <div className="grid grid-cols-3 gap-2">
                {themes.map(({ key, label, icon: Icon }) => {
                  const active = (theme ?? "system") === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium transition-colors ${
                        active
                          ? "border-[var(--accent-color,#0071e3)] bg-[var(--accent-color,#0071e3)]/8 text-[var(--accent-color,#0071e3)]"
                          : "border-foreground/10 text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[10px] text-foreground/35">
                Сейчас: {resolvedTheme === "dark" ? "тёмная" : "светлая"}
              </p>
            </div>

            {/* Accent */}
            <div className="mb-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/45">
                <Palette className="h-3 w-3" /> Акцент
              </p>
              <div className="flex gap-2">
                {ACCENTS.map(a => (
                  <button
                    key={a.key}
                    onClick={() => setAccent(a.key)}
                    title={a.label}
                    aria-label={a.label}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                      accent === a.key ? "border-foreground/80 scale-110" : "border-transparent"
                    }`}
                    style={{ background: a.value }}
                  >
                    {accent === a.key && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font scale */}
            <div className="mb-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/45">
                <Type className="h-3 w-3" /> Размер интерфейса
              </p>
              <div className="grid grid-cols-3 gap-2">
                {FONT_SCALES.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFontScale(f.key)}
                    className={`rounded-xl border py-2 text-xs font-medium transition-colors ${
                      fontScale === f.key
                        ? "border-[var(--accent-color,#0071e3)] bg-[var(--accent-color,#0071e3)]/8 text-[var(--accent-color,#0071e3)]"
                        : "border-foreground/10 text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced motion */}
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-foreground/10 px-3 py-2.5 text-sm transition-colors hover:bg-foreground/[0.04]"
            >
              <span className="flex items-center gap-2 text-foreground/75">
                <Zap className="h-3.5 w-3.5" />
                Меньше анимаций
              </span>
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  reducedMotion ? "bg-[var(--accent-color,#0071e3)]" : "bg-foreground/15"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                    reducedMotion ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </span>
            </button>

            {/* Reset */}
            <button
              onClick={resetAll}
              className="w-full rounded-xl border border-foreground/10 px-3 py-2 text-xs text-foreground/55 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              Сбросить к стандарту
            </button>

            <p className="mt-3 text-center text-[10px] text-foreground/30">
              Настройки сохраняются в этом браузере
            </p>
          </div>
        </>
      )}
    </div>
  );
}
