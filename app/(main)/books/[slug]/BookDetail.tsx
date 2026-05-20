"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Download, Calendar, Globe } from "lucide-react";
import type { BookFull } from "@/lib/types/database";

const LANG_NAMES: Record<string, string> = {
  ru: "Русский", en: "English", uz: "Ўзбекча",
  fr: "Français", de: "Deutsch", other: "Другой",
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as any },
});

export function BookDetail({ book }: { book: BookFull }) {
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
        <motion.div {...fade(0)}>
          <Link
            href="/catalog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Каталог
          </Link>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-[260px_1fr]">
          {/* Cover */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-black/6 bg-foreground/[0.04] shadow-2xl shadow-black/20 dark:border-white/8">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-8 text-center">
                  <span className="font-heading text-xl font-semibold text-foreground/70">{title}</span>
                </div>
              )}
            </div>

            <motion.div {...fade(0.2)}>
              <Link
                href={`/read/${book.slug}`}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0071e3] text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(0,113,227,.24)] transition-transform hover:scale-[1.02] active:scale-[.98] dark:bg-white dark:text-black"
              >
                <BookOpen className="h-4 w-4" />
                Читать онлайн
              </Link>
            </motion.div>

            {downloads.length > 0 && (
              <motion.div className="flex flex-col gap-2" {...fade(0.25)}>
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
              </motion.div>
            )}

            {book.gutenberg_id && (
              <motion.a
                {...fade(0.3)}
                href={`https://www.gutenberg.org/ebooks/${book.gutenberg_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs text-foreground/35 transition-colors hover:text-foreground/55"
              >
                Project Gutenberg #{book.gutenberg_id}
              </motion.a>
            )}
          </motion.div>

          {/* Info */}
          <div>
            <motion.div {...fade(0.1)}>
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
            </motion.div>

            <motion.div className="mt-5 flex flex-wrap gap-2" {...fade(0.18)}>
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
            </motion.div>

            {book.description && (
              <motion.p
                className="mt-7 max-w-prose text-base leading-8 text-foreground/65"
                {...fade(0.25)}
              >
                {book.description}
              </motion.p>
            )}

            {book.authors?.bio && (
              <motion.div
                className="mt-8 rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-5"
                {...fade(0.32)}
              >
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
              </motion.div>
            )}

            <motion.p className="mt-8 text-xs text-foreground/30" {...fade(0.38)}>
              Текст находится в общественном достоянии (public domain) и предоставляется бесплатно.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
