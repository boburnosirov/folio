import { BookCard } from "./BookCard";
import type { BookWithAuthor } from "@/lib/types/database";

interface Props {
  books: BookWithAuthor[];
}

export function AnimatedGrid({ books }: Props) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {books.map((book, i) => (
        <div
          key={book.id}
          className="fade-up"
          // Only stagger first 18; rest appear immediately to avoid jank
          style={{ animationDelay: i < 18 ? `${i * 0.025}s` : "0s" }}
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
