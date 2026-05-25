"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
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
  priority?: boolean;
}

export function BookCard({ book, priority = false }: BookCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [later, setLater] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleFavorite(book.id);
      if (result.notLoggedIn) { router.push("/login?next=/catalog"); return; }
      setSaved(result.isFavorite);
    });
  }

  function handleReadLater(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleReadLater(book.id);
      if (result.notLoggedIn) { router.push("/login?next=/catalog"); return; }
      setLater(result.isReadLater);
    });
  }

  const title = book.title_ru ?? book.title;
  const meta: string[] = [];
  if (book.year_published) meta.push(String(book.year_published));
  if (book.read_count > 0) meta.push(`${book.read_count.toLocaleString("ru")} чит.`);

  return (
    <Link
      href={`/books/${book.slug}`}
      prefetch={false}
      className="group book-card flex flex-col gap-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] border border-black/6 bg-foreground/[0.04] shadow-md transition-shadow duration-300 group-hover:shadow-xl dark:border-white/8">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized={book.cover_url.startsWith("http") && !book.cover_url.includes("supabase")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-center">
            <span className="font-heading text-sm font-semibold leading-tight text-foreground/70">
              {title}
            </span>
          </div>
        )}

        {book.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-[#0071e3] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">
            Топ
          </span>
        )}

        <span className={`absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${LANG_COLORS[book.language] ?? LANG_COLORS.other}`}>
          {LANG_LABEL[book.language] ?? book.language}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            aria-label="В избранное"
            onClick={handleFavorite}
            disabled={pending}
            className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90 ${
              saved ? "bg-rose-500 text-white" : "bg-white/20 text-white hover:bg-rose-500"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
          </button>
          <button
            aria-label="Читать потом"
            onClick={handleReadLater}
            disabled={pending}
            className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90 ${
              later ? "bg-[#0071e3] text-white" : "bg-white/20 text-white hover:bg-[#0071e3]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${later ? "fill-white" : ""}`} />
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
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
