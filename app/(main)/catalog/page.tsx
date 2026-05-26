import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { getBooks, getBooksCount } from "@/lib/books";
import { createClient } from "@/lib/supabase/server";
import { AnimatedGrid } from "@/components/catalog/AnimatedGrid";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import type { BookWithAuthor, Category } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Каталог книг — Folio",
  description: "Все книги библиотеки Folio: русская и зарубежная классика, философия, наука, узбекская литература.",
};

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; language?: string; search?: string }>;
}

function deduplicateBooks(books: BookWithAuthor[], language?: string): BookWithAuthor[] {
  if (language) return books;
  // When showing all languages, prefer RU over EN for companion pairs
  const ruSlugs = new Set(books.filter((b) => b.language === "ru").map((b) => b.slug));
  return books.filter((b) => {
    if (b.language === "en" && b.companion_slug && ruSlugs.has(b.companion_slug)) return false;
    return true;
  });
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const { category, language, search } = params;

  const [books, totalCount, categoriesResult] = await Promise.all([
    getBooks({ category, language, search, limit: 200 }),
    getBooksCount({ category, language, search }),
    createClient().then((sb) =>
      sb.from("categories").select("*").order("display_order")
    ),
  ]);

  const categories: Category[] = categoriesResult.data ?? [];
  const displayBooks = deduplicateBooks(books, language);
  // After hiding copyrighted books, EN↔RU pairs are mostly gone — count actual unique books
  const displayCount = displayBooks.length === books.length ? totalCount : displayBooks.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">Библиотека</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
            {search ? `Поиск: «${search}»` : category
              ? (categories.find((c) => c.slug === category)?.name ?? "Каталог")
              : "Все книги"}
          </h1>
          <p className="mt-2 text-foreground/55">
            {displayBooks.length > 0
              ? `${displayCount} ${plural(displayCount, "книга", "книги", "книг")}`
              : "Ничего не найдено"}
          </p>
        </div>

        {/* Search bar */}
        <form method="GET" className="mb-8">
          <div className="flex max-w-xl items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 py-2.5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="h-4 w-4 shrink-0 text-foreground/45" />
            <input
              name="search"
              defaultValue={search ?? ""}
              placeholder="Название, автор…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/38"
            />
            {category && <input type="hidden" name="category" value={category} />}
          </div>
        </form>

        {/* Filters */}
        <Suspense fallback={<div className="h-16" />}>
          <CatalogFilters categories={categories} activeCategory={category} activeLanguage={language} />
        </Suspense>

        {/* Grid */}
        {displayBooks.length > 0 ? (
          <AnimatedGrid books={displayBooks} />
        ) : (
          <div className="mt-20 flex flex-col items-center gap-4 text-center text-foreground/45">
            <p className="text-5xl">📚</p>
            <p className="text-lg font-medium text-foreground/55">Книги не найдены</p>
            <Link href="/catalog" className="text-sm text-primary hover:underline">
              Показать все книги
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
