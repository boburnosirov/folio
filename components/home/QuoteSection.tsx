"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BookCover, CoverVariant } from "./BookCover";

const EXCERPTS: Array<{
  text: string;
  author: string;
  work: string;
  slug: string;
  variant: CoverVariant;
  imageUrl: string;
}> = [
  {
    text: "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.",
    author: "Лев Толстой",
    work: "Анна Каренина",
    slug: "anna-karenina",
    variant: "anna",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/AnnaKareninaTitle.jpg?width=700",
  },
  {
    text: "Он был задавлен бедностью; но стеснённое положение перестало в последнее время тяготить его.",
    author: "Фёдор Достоевский",
    work: "Преступление и наказание",
    slug: "prestuplenie-i-nakazanie",
    variant: "crime",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cover_of_the_first_edition_of_Crime_and_Punishment.jpg?width=700",
  },
  {
    text: "Небо было в звёздах, и каждая звезда казалась живой точкой огромного молчаливого пространства.",
    author: "Камиль Фламмарион",
    work: "Популярная астрономия",
    slug: "populyarnaya-astronomiya",
    variant: "verne",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/AstronomiePopulaire1880.jpg?width=700",
  },
  {
    text: "Богатство приходит к тому, кто действует в определённом образе мышления и делает это последовательно.",
    author: "Уоллес Уоттлз",
    work: "Наука стать богатым",
    slug: "the-science-of-getting-rich",
    variant: "franklin",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/The_Science_of_Getting_Rich_-_title_frame.png?width=700",
  },
  {
    text: "Менинг кўнглим гулшан истар, гулшан ичра ёр истар.",
    author: "Алишер Навои",
    work: "Лирика",
    slug: "alisher-navai-lyrics",
    variant: "navai",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Alisher_Navoi_-_Five_Poems_(Quintet)_-_Walters_W663_-_Top_Exterior.jpg?width=700",
  },
];

export function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const active = EXCERPTS[index];

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % EXCERPTS.length);
    }, 22000);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(0,113,227,.10),transparent_30%),radial-gradient(circle_at_78%_44%,rgba(212,168,67,.15),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 rounded-[34px] border border-black/6 bg-white/64 p-6 shadow-[0_28px_90px_rgba(0,0,0,.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.055] md:grid-cols-[260px_1fr] md:p-10">
        <div className="flex justify-center md:justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 18, rotate: -4 }}
              animate={inView ? { opacity: 1, y: 0, rotate: -2 } : undefined}
              exit={{ opacity: 0, y: -14, rotate: 3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookCover
                title={active.work}
                author={active.author}
                variant={active.variant}
                imageUrl={active.imageUrl}
                size="xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">Отрывок, который цепляет</p>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.slug}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-5xl"
            >
              “{active.text}”
            </motion.blockquote>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${active.slug}-meta`}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.42 }}
              className="mt-7"
            >
              <p className="text-base font-semibold text-foreground">{active.author}</p>
              <p className="mt-1 text-sm text-foreground/55 dark:text-white/55">{active.work}</p>
              <Link
                href={`/books/${active.slug}`}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.025] active:scale-[0.97] dark:bg-white dark:text-black"
              >
                Открыть книгу <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2 md:justify-start" aria-label="Переключить отрывок">
            {EXCERPTS.map((item, dotIndex) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setIndex(dotIndex)}
                className={`h-2 rounded-full transition-all ${
                  dotIndex === index ? "w-7 bg-[#0071e3] dark:bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/35"
                }`}
                aria-label={`Показать отрывок: ${item.work}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
