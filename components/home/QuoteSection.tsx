"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const QUOTE = {
  text: "Всё смешалось в доме Облонских. Жена узнала, что муж был в связи с бывшею в их доме француженкою-гувернанткой, и объявила мужу, что не может жить с ним в одном доме.",
  author: "Лев Толстой",
  work: "«Анна Каренина»",
};

// Split into words for stagger animation
function AnimatedQuote({ text, inView }: { text: string; inView: boolean }) {
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.45,
            delay: 0.1 + i * 0.022,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28"
      style={{
        background:
          "linear-gradient(to bottom, transparent, oklch(0.09 0.014 268) 20%, oklch(0.09 0.014 268) 80%, transparent)",
      }}
    >
      {/* Decorative gold lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full opacity-20"
          style={{ background: "linear-gradient(to right, transparent, #d4a843 40%, #d4a843 60%, transparent)" }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-full opacity-10"
          style={{ background: "linear-gradient(to bottom, transparent, #d4a843 30%, #d4a843 70%, transparent)" }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Opening quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6 text-8xl leading-none text-primary/20 select-none"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
          aria-hidden
        >
          "
        </motion.div>

        {/* Quote text */}
        <blockquote
          className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-foreground/85 italic"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          <AnimatedQuote text={QUOTE.text} inView={inView} />
        </blockquote>

        {/* Attribution */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-1"
        >
          <div className="h-px w-12 bg-primary/40 mb-4" />
          <cite className="not-italic text-sm font-medium text-primary/80">
            {QUOTE.author}
          </cite>
          <span className="text-xs text-muted-foreground">{QUOTE.work}</span>
        </motion.footer>
      </div>
    </section>
  );
}
