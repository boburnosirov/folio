import Link from "next/link";
import Image from "next/image";
import type { BookWithAuthor } from "@/lib/types/database";

interface Props {
  books: BookWithAuthor[];
}

export function RelatedBooks({ books }: Props) {
  if (books.length === 0) return null;

  return (
    <section className="mt-16 border-t border-foreground/8 pt-12">
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
        Похожие книги
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {books.map((book) => {
          const title = book.title_ru ?? book.title;
          const author = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;
          return (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              prefetch={false}
              className="group flex flex-col gap-2"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-foreground/8 bg-foreground/[0.04] shadow-md transition-transform group-hover:scale-[1.02]">
                {book.cover_url ? (
                  <Image
                    src={book.cover_url}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover"
                    unoptimized={!book.cover_url.includes("supabase")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-center">
                    <span className="text-xs font-medium text-foreground/60 leading-tight">{title}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground line-clamp-2 leading-snug">
                  {title}
                </p>
                {author && (
                  <p className="mt-0.5 text-xs text-foreground/45 truncate">{author}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
