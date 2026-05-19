"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Brain, Briefcase, Globe, Heart, Star, Telescope, TrendingUp } from "lucide-react";
import { BookCover, CoverVariant } from "./BookCover";

const CATEGORIES: Array<{
  slug: string;
  name: string;
  desc: string;
  icon: typeof BookOpen;
  covers: Array<{ title: string; author: string; variant: CoverVariant }>;
}> = [
  {
    slug: "russian-classics",
    name: "Художественная литература",
    desc: "Толстой, Достоевский, Чехов, Гоголь",
    icon: BookOpen,
    covers: [
      { title: "Анна", author: "Толстой", variant: "anna" },
      { title: "Шинель", author: "Гоголь", variant: "gogol" },
      { title: "Чехов", author: "Рассказы", variant: "chekhov" },
    ],
  },
  {
    slug: "world-classics",
    name: "Зарубежная классика",
    desc: "Гюго, Остин, Диккенс, Конан Дойл",
    icon: Globe,
    covers: [
      { title: "Гюго", author: "Собор", variant: "hugo" },
      { title: "Остин", author: "Роман", variant: "austen" },
      { title: "Холмс", author: "Дойл", variant: "sherlock" },
    ],
  },
  {
    slug: "romance",
    name: "Романтика",
    desc: "Ася, Первая любовь, Джейн Остин",
    icon: Heart,
    covers: [
      { title: "Остин", author: "Джейн", variant: "austen" },
      { title: "Ася", author: "Тургенев", variant: "chekhov" },
      { title: "Вертер", author: "Гёте", variant: "hugo" },
    ],
  },
  {
    slug: "philosophy",
    name: "Философия и характер",
    desc: "Марк Аврелий, Сенека, Монтень",
    icon: Brain,
    covers: [
      { title: "Наедине", author: "Аврелий", variant: "marcus" },
      { title: "Сенека", author: "Письма", variant: "franklin" },
      { title: "Монтень", author: "Опыты", variant: "gogol" },
    ],
  },
  {
    slug: "self-development",
    name: "Саморазвитие",
    desc: "Хилл, Смайлс, Марден, Уоттлз",
    icon: TrendingUp,
    covers: [
      { title: "Self Help", author: "Smiles", variant: "franklin" },
      { title: "Think", author: "Hill", variant: "marcus" },
      { title: "Science", author: "Wattles", variant: "verne" },
    ],
  },
  {
    slug: "business-success",
    name: "Бизнес и успех",
    desc: "Франклин, Карнеги и классические эссе",
    icon: Briefcase,
    covers: [
      { title: "Авто", author: "Франклин", variant: "franklin" },
      { title: "Успех", author: "Карнеги", variant: "marcus" },
      { title: "Эссе", author: "Классика", variant: "hugo" },
    ],
  },
  {
    slug: "science",
    name: "Космос и наука",
    desc: "Циолковский, Верн, Фламмарион",
    icon: Telescope,
    covers: [
      { title: "Верн", author: "Жюль", variant: "verne" },
      { title: "Космос", author: "Циолковский", variant: "navai" },
      { title: "Звёзды", author: "Фламмарион", variant: "hugo" },
    ],
  },
  {
    slug: "uzbek-classics",
    name: "Узбекская классика",
    desc: "Навои, Бабур, Чулпан, Мукими",
    icon: Star,
    covers: [
      { title: "Навои", author: "Алишер", variant: "navai" },
      { title: "Бабур", author: "Наме", variant: "babur" },
      { title: "Чулпан", author: "Классика", variant: "franklin" },
    ],
  },
];

function CategoryCard({ category, index, inView }: { category: (typeof CATEGORIES)[number]; index: number; inView: boolean }) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/categories/${category.slug}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-[24px] border border-black/6 bg-white/70 p-5 shadow-[0_18px_55px_rgba(0,0,0,.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(0,0,0,.1)] dark:border-white/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.085]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.045] text-foreground dark:bg-white/10">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium text-foreground/45">0{index + 1}</span>
          </div>

          <div className="relative mb-6 h-24">
            {category.covers.map((cover, coverIndex) => (
              <div
                key={cover.title}
                className="absolute bottom-0 transition-transform duration-300 ease-out group-hover:translate-y-[-6px]"
                style={{
                  left: `calc(50% - 42px + ${coverIndex * 28}px)`,
                  zIndex: 3 - coverIndex,
                  transform: `rotate(${(coverIndex - 1) * 8}deg)`,
                }}
              >
                <BookCover {...cover} size="xs" className="shadow-xl shadow-black/15" />
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">{category.name}</h3>
          <p className="mt-2 min-h-10 text-sm leading-5 text-foreground/58 dark:text-white/58">{category.desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">Разделы библиотеки</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-6xl">
            Выберите настроение, не только жанр.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
