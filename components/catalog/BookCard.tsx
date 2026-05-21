"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleFavorite, toggleReadLater } from "@/app/actions/favorites";
import type { BookWithAuthor } from "@/lib/types/database";

const LANG_LABEL: Record<string, string> = {
  ru: "РУС", en: "ENG", uz: "УЗБ", fr: "ФР", de: "НЕМ", other: "—",
};

const LANG_COLORS: Record<string, string> = {
  ru: "bg-blue-500/15 text-blue-500",
  en: "bg-amber-500/15 text-amber-500",
  uz: "bg-emerald-500/15 text-emerald-500",
  fr: "bg-purple-500/15 text-purple-500",
  de: "bg-rose-500/15 text-rose-500",
  other: "bg-foreground/5 text-foreground/45",
};

interface BookCardProps {
  book: BookWithAuthor;
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [later, setLater] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoadingFav(true);
    const result = await toggleFavorite(book.id);
    setLoadingFav(false);
    if (result.notLoggedIn) {
      router.push(`/login?next=/catalog`);
      return;
    }
    setSaved(result.isFavorite);
  }

  async function handleReadLater(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoadingLater(true);
    const result = await toggleReadLater(book.id);
    setLoadingLater(false);
    if (result.notLoggedIn) {
      router.push(`/login?next=/catalog`);
      return;
    }
    setLater(result.isReadLater);
  }

  const meta: string[] = [];
  if (book.year_published) meta.push(String(book.year_published));
  if (book.read_count > 0) meta.push(`${book.read_count.toLocaleString("ru")} чит.`);

  return (
    <Link href={`/books/${book.slug}`} className="group flex flex-col gap-2">
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] border border-black/6 bg-foreground/[0.04] shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl dark:border-white/8">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title_ru ?? book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-center">
            <span className="font-heading text-sm font-semibold leading-tight text-foreground/70">
              {book.title_ru ?? book.title}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {book.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-[#0071e3] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">
            Топ
          </span>
        )}

        {/* Language badge */}
        <span className={`absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${LANG_COLORS[book.language] ?? LANG_COLORS.other}`}>
          {LANG_LABEL[book.language] ?? book.language}
        </span>

        {/* Quick action buttons — appear on hover */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 opacity-0 transition-all duration-250 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            aria-label="В избранное"
            onClick={handleFavorite}
            disabled={loadingFav}
            className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90 ${
              saved
                ? "bg-rose-500 text-white"
                : "bg-white/20 text-white hover:bg-rose-500"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
          </button>
          <button
            aria-label="Читать потом"
            onClick={handleReadLater}
            disabled={loadingLater}
            className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90 ${
              later
                ? "bg-[#0071e3] text-white"
                : "bg-white/20 text-white hover:bg-[#0071e3]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${later ? "fill-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="min-w-0">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {book.title_ru ?? book.title}
        </p>
        {book.authors && (
          <p className="mt-0.5 truncate text-[11px] text-foreground/50">
            {book.authors.name_ru ?? book.authors.name}
          </p>
        )}
        <div className="mt-1 flex items-center gap-1.5">
          {meta.length > 0 && (
            <span className="text-[10px] text-foreground/35">{meta.join(" · ")}</span>
          )}
          {book.avg_rating > 0 && (
            <span className="ml-auto flex items-center gap-0.5 text-[10px] font-semibold text-amber-500">
              ★ {book.avg_rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
