"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1100;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

interface CounterSectionProps {
  bookCount?: number;
  authorCount?: number;
}

export function CounterSection({ bookCount = 500, authorCount = 42 }: CounterSectionProps) {
  const STATS = [
    { value: bookCount, suffix: "", label: "книг в библиотеке" },
    { value: 8, suffix: "", label: "категорий" },
    { value: authorCount, suffix: "", label: "авторов" },
    { value: 3, suffix: " века", label: "литературы" },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,168,67,.09),transparent_48%)]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="fade-up rounded-[24px] border border-black/6 bg-white/55 px-4 py-8 text-center shadow-[0_18px_50px_rgba(0,0,0,.045)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045]"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <span className="font-heading text-5xl font-semibold tabular-nums tracking-[-0.04em] text-[#0071e3] dark:text-primary sm:text-6xl">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-2 block text-sm text-foreground/55 dark:text-white/55">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
