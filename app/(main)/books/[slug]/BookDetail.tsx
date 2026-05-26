"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Download, Calendar, Globe, Eye } from "lucide-react";
import type { BookFull, BookWithAuthor, BookRating } from "@/lib/types/database";
import { BookmarkButton } from "@/components/books/BookmarkButton";
import { FavoriteButton } from "@/components/books/FavoriteButton";
import { ReadLaterButton } from "@/components/books/ReadLaterButton";
import { RelatedBooks } from "@/components/books/RelatedBooks";
import { RatingsSection } from "@/components/books/RatingsSection";
import { LanguageSwitcher } from "@/components/books/LanguageSwitcher";

const LANG_NAMES: Record<string, string> = {
  ru: "Русский", en: "English", uz: "Ўзбекча",
  fr: "Français", de: "Deutsch", other: "Другой",
};

interface Props {
  book: BookFull;
  relatedBooks: BookWithAuthor[];
  isBookmarked: boolean;
  isLoggedIn: boolean;
  companionBook: BookWithAuthor | null;
  ratings: BookRating[];
  userRating: BookRating | null;
  isFavorite: boolean;
  isReadLater: boolean;
}

export function BookDetail({ book, relatedBooks, isBookmarked, isLoggedIn, companionBook, ratings, userRating, isFavorite, isReadLater }: Props) {
  const title = book.title_ru ?? book.title;
  const authorName = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;

  const downloads = [
    book.epub_url && { label: "EPUB", url: book.epub_url, hint: "для e-reader" },
    book.pdf_url && { label: "PDF", url: book.pdf_url, hint: "для печати" },
    book.txt_url && { label: "TXT", url: book.txt_url, hint: "чистый текст" },
  ].filter(Boolean) as Array<{ label: string; url: string; hint: string }>;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between fade-up">
          <Link
            href="/catalog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Каталог
          </Link>
          <LanguageSwitcher
            currentSlug={book.slug}
            currentLanguage={book.language}
            companion={companionBook}
          />
        </div>

        <div className="grid gap-10 md:grid-cols-[260px_1fr]">
          {/* Cover */}
          <div className="flex flex-col gap-3 fade-up">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-black/6 bg-foreground/[0.04] shadow-2xl shadow-black/20 dark:border-white/8">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 260px"
                  priority
                  className="object-cover"
                  unoptimized={!book.cover_url.includes("supabase")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-8 text-center">
                  <span className="font-heading text-xl font-semibold text-foreground/70">{title}</span>
                </div>
              )}
            </div>

            <Link
              href={`/read/${book.slug}`}
              className="fade-up flex h-12 items-center justify-center gap-2 rounded-full bg-[#0071e3] text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(0,113,227,.24)] transition-transform hover:scale-[1.02] active:scale-[.98] dark:bg-white dark:text-black"
              style={{ animationDelay: "0.2s" }}
            >
              <BookOpen className="h-4 w-4" />
              Читать онлайн
            </Link>

            <div className="fade-up" style={{ animationDelay: "0.22s" }}>
              <FavoriteButton bookId={book.id} initialIsFavorite={isFavorite} isLoggedIn={isLoggedIn} />
            </div>

            <div className="fade-up" style={{ animationDelay: "0.24s" }}>
              <ReadLaterButton bookId={book.id} initialIsReadLater={isReadLater} isLoggedIn={isLoggedIn} />
            </div>

            <div className="fade-up" style={{ animationDelay: "0.26s" }}>
              <BookmarkButton
                bookId={book.id}
                bookSlug={book.slug}
                initialBookmarked={isBookmarked}
                isLoggedIn={isLoggedIn}
              />
            </div>

            {downloads.length > 0 && (
              <div className="fade-up flex flex-col gap-2" style={{ animationDelay: "0.28s" }}>
                {downloads.map((d) => (
                  <a
                    key={d.label}
                    href={d.url}
                    download
                    className="flex h-10 items-center justify-between rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/8 hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-3.5 w-3.5" />
                      Скачать {d.label}
                    </span>
                    <span className="text-xs text-foreground/38">{d.hint}</span>
                  </a>
                ))}
              </div>
            )}

            {book.gutenberg_id && (
              <a
                href={`https://www.gutenberg.org/ebooks/${book.gutenberg_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fade-up text-center text-xs text-foreground/35 transition-colors hover:text-foreground/55"
                style={{ animationDelay: "0.3s" }}
              >
                Project Gutenberg #{book.gutenberg_id}
              </a>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              {book.categories && (
                <Link
                  href={`/catalog?category=${book.category_slug}`}
                  className="text-sm font-semibold text-[#0071e3] transition-opacity hover:opacity-75 dark:text-primary"
                >
                  {book.categories.name}
                </Link>
              )}
              <h1 className="mt-2 font-heading text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
                {title}
              </h1>
              {authorName && (
                <p className="mt-3 text-xl text-foreground/60">{authorName}</p>
              )}
            </div>

            <div className="fade-up mt-5 flex flex-wrap gap-2" style={{ animationDelay: "0.18s" }}>
              {book.year_published && (
                <span className="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/55">
                  <Calendar className="h-3 w-3" />
                  {book.year_published}
                </span>
              )}
              <span className="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/55">
                <Globe className="h-3 w-3" />
                {LANG_NAMES[book.language]}
              </span>
              {book.is_featured && (
                <span className="rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-semibold text-[#0071e3] dark:text-primary">
                  Рекомендуем
                </span>
              )}
              {book.read_count > 0 && (
                <span className="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/55">
                  <Eye className="h-3 w-3" />
                  {book.read_count.toLocaleString("ru")} читателей
                </span>
              )}
              {(book.avg_rating ?? 0) > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  ★ {(book.avg_rating ?? 0).toFixed(1)} / 10
                </span>
              )}
            </div>

            {book.description && (
              <p className="fade-up mt-7 max-w-prose text-base leading-8 text-foreground/65" style={{ animationDelay: "0.25s" }}>
                {book.description}
              </p>
            )}

            {book.authors?.bio && (
              <div className="fade-up mt-8 rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-5" style={{ animationDelay: "0.32s" }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/38">
                  Об авторе
                </p>
                <p className="text-sm leading-7 text-foreground/60">{book.authors.bio}</p>
                {book.authors.born_year && (
                  <p className="mt-2 text-xs text-foreground/35">
                    {book.authors.born_year}
                    {book.authors.died_year ? ` — ${book.authors.died_year}` : ""}
                    {book.authors.nationality ? ` · ${book.authors.nationality}` : ""}
                  </p>
                )}
              </div>
            )}

            <p className="fade-up mt-8 text-xs text-foreground/30" style={{ animationDelay: "0.38s" }}>
              Текст находится в общественном достоянии (public domain) и предоставляется бесплатно.
            </p>
          </div>
        </div>

        {/* Ratings & Comments */}
        <div className="fade-up" style={{ animationDelay: "0.42s" }}>
          <RatingsSection
            bookId={book.id}
            bookTitle={title}
            ratings={ratings}
            userRating={userRating}
            avgRating={book.avg_rating ?? 0}
            ratingCount={book.rating_count ?? 0}
            isLoggedIn={isLoggedIn}
          />
        </div>

        {/* Related books */}
        <div className="fade-up" style={{ animationDelay: "0.48s" }}>
          <RelatedBooks books={relatedBooks} />
        </div>
      </div>
    </div>
  );
}
