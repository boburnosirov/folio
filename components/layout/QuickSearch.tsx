"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, BookOpen } from "lucide-react";

interface SearchResult {
  slug: string;
  title: string;
  title_ru?: string | null;
  cover_url?: string | null;
  author?: string | null;
  language: string;
}

export function QuickSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Open on Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // ── Debounced fetch
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch {}
      setLoading(false);
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Быстрый поиск"
        className="hidden h-9 items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 text-xs text-foreground/55 transition-colors hover:bg-foreground/[0.06] hover:text-foreground lg:flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Поиск</span>
        <kbd className="ml-2 hidden rounded border border-foreground/15 bg-background/60 px-1.5 py-0.5 text-[10px] font-mono text-foreground/45 xl:inline-block">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div className="fixed left-1/2 top-[15vh] z-[70] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
            <Search className="h-4 w-4 text-foreground/45" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск книги или автора…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/35"
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) {
                  router.push(`/books/${results[0].slug}`);
                  setOpen(false);
                }
              }}
            />
            {loading && <div className="h-3 w-3 animate-spin rounded-full border border-foreground/15 border-t-foreground/50" />}
            <button
              onClick={() => setOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded text-foreground/45 hover:bg-foreground/[0.06] hover:text-foreground"
              aria-label="Закрыть"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 && query && !loading && (
              <p className="px-4 py-8 text-center text-sm text-foreground/40">Ничего не найдено</p>
            )}
            {results.length === 0 && !query && (
              <div className="px-4 py-6 text-sm text-foreground/45">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/35">Быстрые ссылки</p>
                <div className="flex flex-col gap-1">
                  <Link href="/catalog" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-foreground/[0.05]">
                    <BookOpen className="h-3.5 w-3.5" />
                    Весь каталог
                  </Link>
                  <Link href="/categories/russian-classics" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-foreground/[0.05]">
                    <BookOpen className="h-3.5 w-3.5" />
                    Русская классика
                  </Link>
                  <Link href="/categories/uzbek-classics" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-foreground/[0.05]">
                    <BookOpen className="h-3.5 w-3.5" />
                    Узбекская классика
                  </Link>
                  <Link href="/favorites" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-foreground/[0.05]">
                    <BookOpen className="h-3.5 w-3.5" />
                    Избранное
                  </Link>
                </div>
              </div>
            )}
            {results.map((book) => (
              <Link
                key={book.slug}
                href={`/books/${book.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-foreground/[0.05]"
              >
                {book.cover_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={book.cover_url} alt="" className="h-12 w-8 flex-shrink-0 rounded object-cover" />
                ) : (
                  <div className="h-12 w-8 flex-shrink-0 rounded bg-foreground/10" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {book.title_ru ?? book.title}
                  </p>
                  {book.author && (
                    <p className="truncate text-xs text-foreground/45">{book.author}</p>
                  )}
                </div>
                <span className="text-[10px] font-medium uppercase text-foreground/30">
                  {book.language}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-2 text-[10px] text-foreground/35">
            <span>↵ открыть · Esc закрыть</span>
            <span>⌘K вызов</span>
          </div>
        </div>
      </div>
    </>
  );
}
