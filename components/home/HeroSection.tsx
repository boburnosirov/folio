import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroBook {
  slug: string;
  title: string;
  author: string;
  cover_url: string | null;
}

interface Props {
  books?: HeroBook[];
}

// Default fallback positions for up to 8 floating covers
const POSITIONS = [
  { className: "-left-14 top-[18%] hidden lg:block",       rotate: -13, size: "xl" },
  { className: "left-[10%] top-[12%] hidden md:block",     rotate:   8, size: "lg" },
  { className: "right-[12%] top-[10%] hidden md:block",    rotate:  -7, size: "lg" },
  { className: "right-[-2rem] top-[24%] hidden sm:block",  rotate:  14, size: "md" },
  { className: "left-[18%] bottom-[14%] hidden sm:block",  rotate:  -9, size: "md" },
  { className: "right-[18%] bottom-[11%] hidden md:block", rotate:  10, size: "lg" },
  { className: "left-[4%] bottom-[7%]",                    rotate:  12, size: "sm" },
  { className: "right-[4%] bottom-[6%]",                   rotate: -15, size: "md" },
];

const SIZE_CLASS: Record<string, string> = {
  sm: "h-28 w-20 rounded-[8px]",
  md: "h-40 w-28 rounded-[10px]",
  lg: "h-52 w-36 rounded-[12px]",
  xl: "h-64 w-44 rounded-[14px]",
};

export function HeroSection({ books = [] }: Props) {
  // Take up to 8 books with covers
  const heroBooks = books.filter(b => !!b.cover_url).slice(0, 8);

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

      {heroBooks.length > 0 && (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {heroBooks.map((book, index) => {
            const pos = POSITIONS[index] ?? POSITIONS[0];
            return (
              <div
                key={book.slug}
                className={cn("hero-book absolute will-change-transform", pos.className)}
                style={{
                  ["--rot" as string]: `${pos.rotate}deg`,
                  ["--delay" as string]: `${index * 0.15}s`,
                  ["--dur" as string]: `${6 + index * 0.55}s`,
                  transform: `rotate(${pos.rotate}deg)`,
                  animation: `heroFloat var(--dur) ease-in-out infinite alternate var(--delay)`,
                }}
              >
                <div
                  className={cn(
                    "relative overflow-hidden border border-black/10 bg-foreground/[0.05] shadow-2xl shadow-black/25 ring-1 ring-white/20 dark:border-white/10",
                    SIZE_CLASS[pos.size],
                    "drop-shadow-[0_30px_45px_rgba(0,0,0,.22)] dark:drop-shadow-[0_38px_58px_rgba(0,0,0,.55)]"
                  )}
                >
                  {book.cover_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.cover_url}
                      alt={`${book.title} — ${book.author}`}
                      className="absolute inset-0 h-full w-full bg-white object-cover"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-black/30 to-transparent mix-blend-multiply" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.14),transparent_28%,rgba(0,0,0,.10))]" />
                </div>
              </div>
            );
          })}
        </div>
      )}

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
