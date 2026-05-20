import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import { BookDetail } from "./BookDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Книга не найдена — Folio" };
  return {
    title: `${book.title_ru ?? book.title} — Folio`,
    description: book.description ?? undefined,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();
  return <BookDetail book={book} />;
}
