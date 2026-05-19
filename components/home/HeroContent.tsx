"use client";

import Link from "next/link";
import { MutableRefObject } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTypewriter } from "@/lib/hooks/useTypewriter";
import { useMagnetic } from "@/lib/hooks/useMagnetic";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// ─── Letter stagger ──────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.2 } },
};
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const letterVariants = {
  hidden: { opacity: 0, y: 70, rotateX: 50 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

// ─── Magnetic button wrapper ─────────────────────────────────
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.38);
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main content ────────────────────────────────────────────
interface HeroContentProps {
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}

const SUBTITLE = "Бесплатная библиотека книг из общественного достояния";
const TITLE_LETTERS = ["F", "o", "l", "i", "o"];

export function HeroContent({ mouseRef: _mouseRef }: HeroContentProps) {
  const { displayed } = useTypewriter(SUBTITLE, 42, 950);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center select-none">
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary/70"
      >
        Читайте. Открывайте. Погружайтесь.
      </motion.p>

      {/* Title — letter by letter */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="font-heading text-[min(18vw,9rem)] font-semibold leading-none tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-cormorant), serif", perspective: "600px" }}
        aria-label="Folio"
      >
        {TITLE_LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            className="inline-block"
            style={{ display: "inline-block" }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtitle — typewriter */}
      <div className="mt-6 h-8 flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-base sm:text-lg text-muted-foreground font-light tracking-wide"
        >
          {displayed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-[2px] h-[1.1em] bg-primary ml-[2px] align-middle"
          />
        </motion.p>
      </div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
      >
        <MagneticButton>
          <Link
            href="/catalog"
            className={cn(
              buttonVariants({ size: "lg" }),
              "relative overflow-hidden bg-primary text-primary-foreground px-8 py-3 text-sm font-medium",
              "shadow-lg shadow-primary/25 hover:shadow-primary/45",
              "transition-all duration-300 hover:-translate-y-0.5",
              "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            )}
          >
            Перейти в каталог
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </MagneticButton>

        <MagneticButton>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-8 py-3 text-sm font-medium",
              "border-white/15 bg-white/5 text-foreground/80",
              "hover:bg-white/10 hover:border-white/25 hover:text-foreground",
              "backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            )}
          >
            Создать аккаунт
          </Link>
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
          Прокрутите
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </div>
  );
}
