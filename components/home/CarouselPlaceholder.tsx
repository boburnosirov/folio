import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";
import { BookCover } from "./BookCover";
import { MONTH_BOOKS } from "./homeData";

export function CarouselPlaceholder() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 fade-up md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">Рекомендуем</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-6xl">
              Книги месяца
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/58 dark:text-white/58">
              В подборке смешаны жанры: литература, наука, узбекское наследие, бизнес и философия.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/48">
            <BookMarked className="h-4 w-4" />
            Лучшие книги этого месяца
          </div>
        </div>

        <div className="relative rounded-[34px] border border-black/6 bg-white/62 px-5 py-10 shadow-[0_26px_80px_rgba(0,0,0,.07)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[.055] sm:px-8">
          <div className="flex items-end justify-center gap-3 sm:gap-6">
            {MONTH_BOOKS.map((book, index) => {
              const offset = index - 2;
              return (
                <div
                  key={book.title}
                  className={`fade-up transition-transform duration-300 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.04] ${index === 0 || index === 4 ? "hidden sm:block" : ""}`}
                  style={{
                    transform: `rotate(${offset * 3}deg)`,
                    animationDelay: `${index * 0.07}s`,
                  }}
                >
                  <BookCover {...book} size={index === 2 ? "xl" : "lg"} />
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex h-10 items-center rounded-full bg-[#0071e3] px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.025] active:scale-[.97]"
            >
              Весь каталог <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
