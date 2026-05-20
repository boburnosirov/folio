"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Clock } from "lucide-react";
import { BookCover } from "@/components/home/BookCover";
import { HOME_CATEGORIES } from "@/components/home/homeData";
import type { HomeBook } from "@/components/home/homeData";

const DEMO_BOOKS: HomeBook[] = [
  HOME_CATEGORIES[0].covers[0], // Анна Каренина
  HOME_CATEGORIES[0].covers[1], // Преступление и наказание
  HOME_CATEGORIES[1].covers[0], // Отверженные
  HOME_CATEGORIES[1].covers[1], // Гордость и предубеждение
  HOME_CATEGORIES[2].covers[0], // Jane Eyre
  HOME_CATEGORIES[2].covers[3], // Wuthering Heights
  HOME_CATEGORIES[3].covers[0], // Размышления
  HOME_CATEGORIES[3].covers[3], // Заратустра
  HOME_CATEGORIES[6].covers[1], // Вокруг света
  HOME_CATEGORIES[7].covers[0], // Бабур-наме
];

function Metric({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {icon}
      <span className="text-white/35">{label}:</span>
      {children}
    </div>
  );
}

export default function CssDemoPage() {
  const [active, setActive] = useState(0);
  const [fps, setFps] = useState(60);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const mountTime = useRef(Date.now());
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setLoadTime(Date.now() - mountTime.current);
    lastTime.current = performance.now();
  }, []);

  useEffect(() => {
    const tick = (now: number) => {
      frameCount.current++;
      const elapsed = now - lastTime.current;
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((a) => (a + dir + DEMO_BOOKS.length) % DEMO_BOOKS.length),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const count = DEMO_BOOKS.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-white">
      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Folio
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-400">
            CSS 3D
          </span>
          <Link
            href="/demo/r3f"
            className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/50 transition-all hover:border-white/25 hover:text-white"
          >
            → React Three Fiber
          </Link>
        </div>
      </header>

      {/* ── Metrics ── */}
      <div className="flex items-center justify-center gap-6 border-b border-white/5 bg-black/20 px-6 py-2.5">
        <Metric
          icon={<Zap className="h-3.5 w-3.5 text-yellow-400" />}
          label="FPS"
        >
          <span
            className={`font-mono font-bold tabular-nums ${
              fps >= 55
                ? "text-green-400"
                : fps >= 30
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {fps}
          </span>
        </Metric>
        <div className="h-3 w-px bg-white/10" />
        <Metric
          icon={<Clock className="h-3.5 w-3.5 text-blue-400" />}
          label="Загрузка"
        >
          <span className="font-mono font-bold tabular-nums text-blue-400">
            {loadTime !== null ? `${loadTime}мс` : "…"}
          </span>
        </Metric>
        <div className="h-3 w-px bg-white/10" />
        <span className="hidden text-xs text-white/20 sm:block">
          CSS perspective · rotateY · translateZ
        </span>
      </div>

      {/* ── Title ── */}
      <div className="pt-10 pb-4 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/25">
          Демо А
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          CSS 3D Карусель
        </h1>
        <p className="mt-2 text-sm text-white/35">
          Чистые CSS-трансформации без WebGL · ← → или клик по обложке
        </p>
      </div>

      {/* ── 3D Carousel ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-4">
        {/* Stage — perspective wrapper → preserve-3d inner */}
        <div
          className="relative h-72 w-full max-w-2xl"
          style={{ perspective: "900px" }}
        >
          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {DEMO_BOOKS.map((book, i) => {
              let offset = i - active;
              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;

              const rotY = offset * (360 / count);
              const absOffset = Math.abs(offset);
              const opacity =
                absOffset === 0
                  ? 1
                  : absOffset === 1
                  ? 0.72
                  : absOffset === 2
                  ? 0.42
                  : 0.12;

              return (
                <div
                  key={book.title + i}
                  onClick={() => setActive(i)}
                  className="absolute left-1/2 top-1/2 cursor-pointer"
                  style={{
                    transform: `translate(-50%,-50%) rotateY(${rotY}deg) translateZ(290px)`,
                    transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                    opacity,
                    filter: `brightness(${
                      absOffset === 0 ? 1 : 1 - absOffset * 0.12
                    })`,
                    zIndex: 10 - absOffset,
                  }}
                >
                  <BookCover
                    title={book.title}
                    author={book.author}
                    variant={book.variant}
                    imageUrl={book.imageUrl}
                    size={
                      absOffset === 0 ? "xl" : absOffset === 1 ? "lg" : "md"
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Book label */}
        <div className="min-h-12 text-center transition-all duration-300">
          <p className="text-base font-semibold">{DEMO_BOOKS[active].title}</p>
          <p className="text-sm text-white/40">{DEMO_BOOKS[active].author}</p>
        </div>

        {/* Prev / Dots / Next */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {DEMO_BOOKS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-white" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-colors hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="border-t border-white/8 px-6 py-6 text-center">
        <p className="mb-4 text-xs text-white/30">
          Сравни оба варианта и выбери лучший для главной страницы Folio
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo/r3f"
            className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/55 transition-colors hover:text-white"
          >
            Смотреть R3F →
          </Link>
          <Link
            href="/"
            className="rounded-full bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0077ed]"
          >
            Выбрать CSS вариант ✓
          </Link>
        </div>
      </div>
    </div>
  );
}
