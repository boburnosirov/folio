"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, BookOpen, Download } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Выберите книгу",
    desc: "Используйте поиск или фильтры по категории, автору, языку и эпохе.",
    from: { x: -50, opacity: 0 },
    delay: 0,
  },
  {
    icon: BookOpen,
    title: "Читайте онлайн",
    desc: "Встроенная читалка с настройками шрифта, темы и сохранением прогресса.",
    from: { y: 50, opacity: 0 },
    delay: 0.15,
  },
  {
    icon: Download,
    title: "Скачайте формат",
    desc: "EPUB, PDF или TXT — выберите удобный формат для вашего устройства.",
    from: { x: 50, opacity: 0 },
    delay: 0.3,
  },
] as const;

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary/60 mb-3">
            Просто
          </p>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-foreground"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Как это работает
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={step.from}
                animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 0.65,
                  delay: step.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center text-center rounded-2xl
                           border border-border/30 bg-card/40 p-8
                           hover:border-primary/25 hover:bg-card/70
                           transition-all duration-300"
              >
                {/* Step number */}
                <span
                  className="absolute top-5 right-6 text-6xl font-bold text-border/20 select-none"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                  aria-hidden
                >
                  {i + 1}
                </span>

                {/* Icon */}
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl
                              bg-primary/10 ring-1 ring-primary/20
                              group-hover:bg-primary/15 group-hover:ring-primary/35
                              transition-all duration-300"
                >
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3
                  className="mb-3 text-xl font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector arrow on desktop */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-10
                               hidden md:flex h-6 w-6 items-center justify-center
                               rounded-full bg-background border border-border/40 text-muted-foreground/40"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
