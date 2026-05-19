"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookCover } from "./BookCover";
import { HOME_CATEGORIES, type HomeCategory } from "./homeData";

function CategoryCard({
  category,
  index,
  inView,
}: {
  category: HomeCategory;
  index: number;
  inView: boolean;
}) {
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

          <div className="relative mb-6 h-32 overflow-visible">
            {category.covers.slice(0, 6).map((cover, coverIndex) => {
              const row = coverIndex > 2 ? 1 : 0;
              const col = coverIndex % 3;
              return (
                <div
                  key={`${category.slug}-${cover.title}-${coverIndex}`}
                  className="absolute transition-transform duration-300 ease-out group-hover:translate-y-[-6px]"
                  style={{
                    left: `calc(50% - 58px + ${col * 39}px)`,
                    bottom: row === 0 ? 35 : 0,
                    zIndex: 8 - coverIndex,
                    transform: `rotate(${(col - 1) * 7 + row * 3}deg)`,
                  }}
                >
                  <BookCover {...cover} size="xs" className="shadow-xl shadow-black/15" />
                </div>
              );
            })}
          </div>

          <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {category.name}
          </h3>
          <p className="mt-2 min-h-10 text-sm leading-5 text-foreground/58 dark:text-white/58">
            {category.desc}
          </p>
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
          <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">
            Разделы библиотеки
          </p>
          <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-6xl">
            Больше жанров, больше входов в чтение.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_CATEGORIES.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
