import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import { BookDetail } from "./BookDetail";

const BASE_URL = "https://folio-ten-ashy.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Книга не найдена" };

  const title = book.title_ru ?? book.title;
  const authorName = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;
  const fullTitle = authorName ? `${title} — ${authorName}` : title;
  const description =
    book.description ??
    `Читайте «${title}»${authorName ? ` — ${authorName}` : ""} бесплатно на Folio. Книга из общественного достояния.`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      type: "book",
      title: fullTitle,
      description,
      url: `${BASE_URL}/books/${slug}`,
      siteName: "Folio",
      locale: "ru_RU",
      ...(book.cover_url ? { images: [{ url: book.cover_url, width: 400, height: 600, alt: title }] } : {}),
    },
    twitter: {
      card: book.cover_url ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(book.cover_url ? { images: [book.cover_url] } : {}),
    },
    alternates: {
      canonical: `${BASE_URL}/books/${slug}`,
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  const title = book.title_ru ?? book.title;
  const authorName = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    ...(book.title_ru && book.title !== book.title_ru ? { alternateName: book.title } : {}),
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    ...(book.description ? { description: book.description } : {}),
    ...(book.year_published ? { datePublished: String(book.year_published) } : {}),
    ...(book.cover_url ? { image: book.cover_url } : {}),
    inLanguage: book.language,
    url: `${BASE_URL}/books/${slug}`,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookDetail book={book} />
    </>
  );
}
