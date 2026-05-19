"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { BookCover } from "./BookCover";
import { MONTH_BOOKS } from "./homeData";

function PillLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex h-10 items-center rounded-full bg-[#0071e3] px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.025] active:scale-[.97]"
          : "inline-flex h-10 items-center rounded-full border border-foreground/12 bg-background/70 px-5 text-sm font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-foreground/[.06]"
      }
    >
      {children}
    </Link>
  );
}

export function CarouselPlaceholder() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55 }}
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
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
            <Layers className="h-4 w-4" />
            Демо-карусель оставлена для сравнения
          </div>
        </motion.div>

        <div className="relative rounded-[34px] border border-black/6 bg-white/62 px-5 py-10 shadow-[0_26px_80px_rgba(0,0,0,.07)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[.055] sm:px-8">
          <div className="flex items-end justify-center gap-3 sm:gap-6">
            {MONTH_BOOKS.map((book, index) => {
              const offset = index - 2;
              return (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, y: 28, rotate: offset * 4 }}
                  animate={inView ? { opacity: 1, y: 0, rotate: offset * 3 } : undefined}
                  transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.035, rotate: 0 }}
                  className={index === 0 || index === 4 ? "hidden sm:block" : ""}
                >
                  <BookCover {...book} size={index === 2 ? "xl" : "lg"} />
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillLink href="/demo/css">CSS 3D</PillLink>
            <PillLink href="/demo/r3f">React Three Fiber</PillLink>
            <PillLink href="/catalog" primary>
              Весь каталог <ArrowRight className="ml-2 h-4 w-4" />
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
