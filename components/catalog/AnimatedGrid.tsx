"use client";

import { motion } from "framer-motion";
import { BookCard } from "./BookCard";
import type { BookWithAuthor } from "@/lib/types/database";

interface Props {
  books: BookWithAuthor[];
}

export function AnimatedGrid({ books }: Props) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {books.map((book, i) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.38,
            delay: Math.min(i * 0.045, 0.55),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <BookCard book={book} />
        </motion.div>
      ))}
    </div>
  );
}
