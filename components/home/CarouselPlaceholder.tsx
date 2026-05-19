"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const MOCK_BOOKS = [
  { title: "Война и мир",    author: "Толстой",      color: "#1a2d4a" },
  { title: "Преступление",   author: "Достоевский",  color: "#3d1414" },
  { title: "Отцы и дети",    author: "Тургенев",     color: "#173822" },
  { title: "Бабур-наме",     author: "Бабур",        color: "#2c1940" },
  { title: "Мастер и Маргарита", author: "Булгаков", color: "#3d2710" },
];

export function CarouselPlaceholder() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary/60 mb-3">
            Рекомендуем
          </p>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-foreground"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Книги месяца
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-md mx-auto">
            3D-карусель в разработке. Скоро здесь появятся книги с объёмными обложками.
          </p>
        </motion.div>

        {/* Mock book row */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 perspective-[1000px]">
          {MOCK_BOOKS.map((book, i) => {
            const isCentre = i === 2;
            const offset = i - 2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, rotateY: offset * 8 }}
                animate={inView ? { opacity: 1, y: 0, rotateY: offset * 5 } : {}}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, rotateY: 0, scale: 1.04 }}
                className={cn(
                  "relative flex-shrink-0 rounded-md cursor-pointer",
                  "transition-shadow duration-300",
                  isCentre ? "shadow-2xl shadow-primary/20" : "shadow-lg"
                )}
                style={{
                  width: isCentre ? 140 : 110,
                  height: isCentre ? 210 : 165,
                  background: `linear-gradient(135deg, ${book.color} 0%, ${book.color}cc 100%)`,
                  transformOrigin: "bottom center",
                  transform: `scale(${isCentre ? 1 : 0.88 - Math.abs(offset) * 0.06})`,
                }}
              >
                {/* Spine */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-3 rounded-l-md"
                  style={{ background: "rgba(212,168,67,0.35)" }}
                />
                {/* Title */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 pl-5">
                  <p
                    className="text-white/90 font-semibold leading-tight text-xs"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {book.title}
                  </p>
                  <p className="text-white/50 text-[10px] mt-0.5">{book.author}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Demo links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5 text-primary/60" />
            Сравни два варианта карусели:
          </div>
          <div className="flex gap-3">
            <Link
              href="/demo/css"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs")}
            >
              CSS 3D
            </Link>
            <Link
              href="/demo/r3f"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs")}
            >
              React Three Fiber
            </Link>
          </div>
          <Link
            href="/catalog"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-primary text-primary-foreground text-xs"
            )}
          >
            Весь каталог <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
