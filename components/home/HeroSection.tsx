"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BookCover, CoverVariant } from "./BookCover";
import { cn } from "@/lib/utils";

const HERO_BOOKS: Array<{
  title: string;
  author: string;
  variant: CoverVariant;
  size: "sm" | "md" | "lg" | "xl";
  className: string;
  rotate: number;
  delay: number;
  back?: boolean;
}> = [
  {
    title: "Анна Каренина",
    author: "Л. Толстой",
    variant: "anna",
    size: "xl",
    className: "-left-14 top-[18%] hidden lg:block",
    rotate: -13,
    delay: 0,
  },
  {
    title: "Преступление",
    author: "Достоевский",
    variant: "crime",
    size: "lg",
    className: "left-[10%] top-[12%] hidden md:block",
    rotate: 8,
    delay: 0.25,
  },
  {
    title: "Бабур-наме",
    author: "Бабур",
    variant: "babur",
    size: "lg",
    className: "right-[12%] top-[10%] hidden md:block",
    rotate: -7,
    delay: 0.1,
  },
  {
    title: "Гордость",
    author: "Дж. Остин",
    variant: "austen",
    size: "md",
    className: "right-[-2rem] top-[24%] hidden sm:block",
    rotate: 14,
    delay: 0.35,
  },
  {
    title: "Навои",
    author: "Алишер",
    variant: "navai",
    size: "md",
    className: "left-[18%] bottom-[14%] hidden sm:block",
    rotate: -9,
    delay: 0.45,
  },
  {
    title: "Верн",
    author: "Жюль",
    variant: "verne",
    size: "lg",
    className: "right-[18%] bottom-[11%] hidden md:block",
    rotate: 10,
    delay: 0.2,
  },
  {
    title: "Записки",
    author: "Чехов",
    variant: "chekhov",
    size: "sm",
    className: "left-[4%] bottom-[7%]",
    rotate: 12,
    delay: 0.55,
  },
  {
    title: "Обложка",
    author: "",
    variant: "franklin",
    size: "md",
    className: "right-[4%] bottom-[6%]",
    rotate: -15,
    delay: 0.5,
    back: true,
  },
];

function AppleButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 420, damping: 28 }}>
      <Link
        href={href}
        className={cn(
          "inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold tracking-[-0.01em]",
          "outline-none transition-[background,color,box-shadow,border-color] duration-200",
          "focus-visible:ring-4 focus-visible:ring-primary/25",
          variant === "primary"
            ? "bg-[#0071e3] text-white shadow-[0_10px_24px_rgba(0,113,227,.22)] hover:bg-[#0077ed] dark:bg-white dark:text-[#111111] dark:hover:bg-white/92"
            : "border border-foreground/12 bg-background/68 text-foreground shadow-[0_8px_22px_rgba(0,0,0,.06)] backdrop-blur-xl hover:bg-foreground/[0.06] dark:border-white/16 dark:bg-white/9 dark:text-white dark:hover:bg-white/14"
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const letters = "Folio".split("");

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
          <motion.div
            key={`${book.title}-${index}`}
            className={cn("absolute will-change-transform", book.className)}
            style={{ rotate: book.rotate }}
            animate={{
              y: reduceMotion ? 0 : [0, -10, 0],
            }}
            transition={{
              y: reduceMotion ? { duration: 0 } : { duration: 6 + index * 0.55, repeat: Infinity, ease: "easeInOut", delay: book.delay },
            }}
          >
            <BookCover {...book} className="drop-shadow-[0_30px_45px_rgba(0,0,0,.22)] dark:drop-shadow-[0_38px_58px_rgba(0,0,0,.55)]" />
          </motion.div>
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
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="inline-block"
            >
              {letter}
            </span>
          ))}
        </h1>

        <motion.p
          initial={false}
          animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 0.65, delay: 0.35 }}
          className="mt-7 max-w-2xl text-balance text-lg leading-8 text-foreground/68 dark:text-white/68 sm:text-xl"
        >
          Русская, зарубежная и узбекская классика для чтения онлайн и скачивания. Легально, спокойно, без лишнего шума.
        </motion.p>

        <motion.div
          initial={false}
          animate={undefined}
          transition={{ duration: 0.6, delay: 0.52 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <AppleButton href="/catalog">
            Перейти в каталог <ArrowRight className="ml-2 h-4 w-4" />
          </AppleButton>
          <AppleButton href="/register" variant="secondary">
            Создать аккаунт
          </AppleButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/45 dark:text-white/45"
          aria-hidden
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.24em]">Прокрутите</span>
          <motion.div animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
