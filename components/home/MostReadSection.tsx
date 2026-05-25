import Link from "next/link";
import Image from "next/image";
import { getMostReadBooks } from "@/lib/books";
import { Eye, TrendingUp, BookOpen } from "lucide-react";

export async function MostReadSection() {
  const [weekBooks, monthBooks, allBooks] = await Promise.all([
    getMostReadBooks("week", 5),
    getMostReadBooks("month", 5),
    getMostReadBooks("all", 5),
  ]);

  const sections = [
    { key: "week",  label: "За неделю", icon: TrendingUp, books: weekBooks,  countKey: "weekly_read_count" as const },
    { key: "month", label: "За месяц",  icon: Eye,        books: monthBooks, countKey: "monthly_read_count" as const },
    { key: "all",   label: "Всё время", icon: BookOpen,   books: allBooks,   countKey: "read_count" as const },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Самые читаемые
        </h2>
        <p className="mt-2 text-base text-foreground/45">Книги, которые читают прямо сейчас</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map(({ key, label, icon: Icon, books, countKey }) => (
          <div
            key={key}
            className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0071e3]/10">
                <Icon className="h-4 w-4 text-[#0071e3]" />
              </div>
              <span className="text-sm font-semibold text-foreground">{label}</span>
            </div>

            {books.length === 0 ? (
              <p className="py-8 text-center text-sm text-foreground/30">Данных пока нет</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {books.map((book, i) => {
                  const count = book[countKey] ?? 0;
                  const title = book.title_ru ?? book.title;
                  const author = book.authors?.name_ru ?? book.authors?.name;
                  return (
                    <li key={book.id}>
                      <Link
                        href={`/books/${book.slug}`}
                        prefetch={false}
                        className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-foreground/[0.04]"
                      >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-[10px] font-bold text-foreground/40">
                          {i + 1}
                        </span>
                        {book.cover_url ? (
                          <div className="relative h-10 w-7 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={book.cover_url}
                              alt={title}
                              fill
                              sizes="28px"
                              className="object-cover"
                              loading="lazy"
                              unoptimized={book.cover_url.startsWith("http") && !book.cover_url.includes("supabase")}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-7 flex-shrink-0 rounded bg-foreground/10" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-foreground group-hover:text-[#0071e3] transition-colors">
                            {title}
                          </p>
                          {author && (
                            <p className="truncate text-[10px] text-foreground/40">{author}</p>
                          )}
                        </div>
                        {count > 0 && (
                          <span className="flex-shrink-0 text-[10px] text-foreground/25 tabular-nums">
                            {count.toLocaleString("ru")}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
