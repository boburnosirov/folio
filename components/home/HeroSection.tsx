import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BookCover, CoverVariant } from "./BookCover";
import { cn } from "@/lib/utils";
import { COVERS } from "./homeData";

const HERO_BOOKS: Array<{
  title: string;
  author: string;
  variant: CoverVariant;
  imageUrl?: string;
  size: "sm" | "md" | "lg" | "xl";
  className: string;
  rotate: number;
  delay: number;
  back?: boolean;
}> = [
  { title: "Анна Каренина", author: "Л. Толстой", variant: "anna", imageUrl: COVERS.anna, size: "xl", className: "-left-14 top-[18%] hidden lg:block", rotate: -13, delay: 0 },
  { title: "Преступление и наказание", author: "Ф. Достоевский", variant: "crime", imageUrl: COVERS.crime, size: "lg", className: "left-[10%] top-[12%] hidden md:block", rotate: 8, delay: 0.25 },
  { title: "Бабур-наме", author: "Бабур", variant: "babur", imageUrl: COVERS.babur, size: "lg", className: "right-[12%] top-[10%] hidden md:block", rotate: -7, delay: 0.1 },
  { title: "Популярная астрономия", author: "К. Фламмарион", variant: "verne", imageUrl: COVERS.astronomy, size: "md", className: "right-[-2rem] top-[24%] hidden sm:block", rotate: 14, delay: 0.35 },
  { title: "Self-Help", author: "С. Смайлс", variant: "franklin", imageUrl: COVERS.selfHelp, size: "md", className: "left-[18%] bottom-[14%] hidden sm:block", rotate: -9, delay: 0.45 },
  { title: "Вокруг света", author: "Ж. Верн", variant: "verne", imageUrl: COVERS.verneWorld, size: "lg", className: "right-[18%] bottom-[11%] hidden md:block", rotate: 10, delay: 0.2 },
  { title: "Размышления", author: "Марк Аврелий", variant: "marcus", imageUrl: COVERS.meditations, size: "sm", className: "left-[4%] bottom-[7%]", rotate: 12, delay: 0.55 },
  { title: "Задняя сторона книги", author: "", variant: "franklin", size: "md", className: "right-[4%] bottom-[6%]", rotate: -15, delay: 0.5, back: true },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#050507] dark:text-white">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 36%, color-mix(in oklch, var(--background), white 12%) 0%, transparent 38%), radial-gradient(circle at 16% 18%, rgba(255,190,80,.22), transparent 24%), radial-gradient(circle at 84% 20%, rgba(0,113,227,.18), transparent 28%)",
        }}
      />

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {HERO_BOOKS.map((book, index) => (
          <div
            key={`${book.title}-${index}`}
            className={cn("hero-book absolute will-change-transform", book.className)}
            style={{
              // CSS-only float animation — no JS RAF
              ["--rot" as string]: `${book.rotate}deg`,
              ["--delay" as string]: `${book.delay}s`,
              ["--dur" as string]: `${6 + index * 0.55}s`,
              transform: `rotate(${book.rotate}deg)`,
              animation: `heroFloat var(--dur) ease-in-out infinite alternate var(--delay)`,
            }}
          >
            <BookCover
              title={book.title}
              author={book.author}
              variant={book.variant}
              imageUrl={book.imageUrl}
              size={book.size}
              back={book.back}
              className="drop-shadow-[0_30px_45px_rgba(0,0,0,.22)] dark:drop-shadow-[0_38px_58px_rgba(0,0,0,.55)]"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(245,245,247,.72),rgba(245,245,247,.28)_35%,rgba(245,245,247,.76)_100%)] dark:bg-[linear-gradient(to_bottom,rgba(5,5,7,.72),rgba(5,5,7,.18)_35%,rgba(5,5,7,.82)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.28em] text-foreground/55 dark:text-white/55">
          Бесплатная библиотека public domain
        </p>

        <h1
          aria-label="Folio"
          className="font-heading text-[clamp(5rem,17vw,10.5rem)] font-semibold leading-[0.82] tracking-[-0.035em] text-foreground dark:text-white"
        >
          Folio
        </h1>

        <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-foreground/68 dark:text-white/68 sm:text-xl">
          Классика, философия, саморазвитие, бизнес, наука и узбекское наследие — для чтения онлайн и скачивания.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/catalog"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#0071e3] px-6 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_10px_24px_rgba(0,113,227,.22)] transition-[transform,background] duration-150 hover:scale-[1.025] hover:bg-[#0077ed] active:scale-[0.97] dark:bg-white dark:text-[#111111] dark:hover:bg-white/92"
          >
            Перейти в каталог <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/12 bg-background/68 px-6 text-[15px] font-semibold text-foreground shadow-[0_8px_22px_rgba(0,0,0,.06)] backdrop-blur-xl transition-[transform,background] duration-150 hover:scale-[1.025] hover:bg-foreground/[0.06] active:scale-[0.97] dark:border-white/16 dark:bg-white/9 dark:text-white dark:hover:bg-white/14"
          >
            Создать аккаунт
          </Link>
        </div>

        <div
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/45 dark:text-white/45"
          aria-hidden
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.24em]">Прокрутите</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
