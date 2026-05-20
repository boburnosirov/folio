import Link from "next/link";
import type { BookWithAuthor } from "@/lib/types/database";

const LANG_LABEL: Record<string, string> = {
  ru: "РУС", en: "ENG", uz: "УЗБ", fr: "ФР", de: "НЕМ", other: "—",
};

const LANG_COLORS: Record<string, string> = {
  ru: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  en: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  uz: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  fr: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  de: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  other: "bg-foreground/5 text-foreground/45",
};

interface BookCardProps {
  book: BookWithAuthor;
}

export function BookCard({ book }: BookCardProps) {
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
        <span className={`absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${LANG_COLORS[book.language]}`}>
          {LANG_LABEL[book.language]}
        </span>
      </div>

      {/* Meta */}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {book.title_ru ?? book.title}
        </p>
        {book.authors && (
          <p className="mt-0.5 truncate text-[11px] text-foreground/50">
            {book.authors.name_ru ?? book.authors.name}
          </p>
        )}
        {book.year_published && (
          <p className="mt-0.5 text-[10px] text-foreground/35">{book.year_published}</p>
        )}
      </div>
    </Link>
  );
}
