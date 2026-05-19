"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Download, Search } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Выберите книгу",
    desc: "Ищите по категории, автору, языку, эпохе или настроению. Каталог будет расти постепенно.",
    from: { x: -50, opacity: 0 },
    delay: 0,
  },
  {
    icon: BookOpen,
    title: "Читайте онлайн",
    desc: "Читалка сохранит прогресс, тему, шрифт, ширину колонки и закладки, когда вы войдёте в аккаунт.",
    from: { y: 50, opacity: 0 },
    delay: 0.15,
  },
  {
    icon: Download,
    title: "Скачайте формат",
    desc: "EPUB, PDF или TXT — только легальные книги из общественного достояния.",
    from: { x: 50, opacity: 0 },
    delay: 0.3,
  },
] as const;

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm font-semibold text-[#0071e3] dark:text-primary">Просто</p>
          <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-6xl">
            От выбора до чтения — без лишних шагов.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={step.from}
                animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.65, delay: step.delay, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-[28px] border border-black/6 bg-white/62 p-8 shadow-[0_22px_70px_rgba(0,0,0,.055)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-white/[0.055] dark:hover:bg-white/[0.085]"
              >
                <span className="absolute right-7 top-5 select-none text-7xl font-semibold tracking-[-0.06em] text-foreground/[0.045] dark:text-white/[0.055]">
                  {index + 1}
                </span>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3]/10 text-[#0071e3] dark:bg-primary/12 dark:text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/58 dark:text-white/58">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
