"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BookOpen, Globe, Heart, Brain,
  TrendingUp, Briefcase, Telescope, User, Star
} from "lucide-react";

const CATEGORIES = [
  { slug: "russian-classics", name: "Русская классика",       icon: BookOpen,  color: "#1a2d4a", desc: "Толстой, Достоевский, Чехов" },
  { slug: "world-classics",   name: "Зарубежная классика",    icon: Globe,     color: "#2c1940", desc: "Диккенс, Гюго, Дюма" },
  { slug: "romance",          name: "Романтика",              icon: Heart,     color: "#3d1414", desc: "Остин, Куприн, Тургенев" },
  { slug: "philosophy",       name: "Философия",              icon: Brain,     color: "#1a2a1a", desc: "Марк Аврелий, Ницше, Сенека" },
  { slug: "self-development", name: "Саморазвитие",           icon: TrendingUp,color: "#2d2010", desc: "Наполеон Хилл, Смайлс" },
  { slug: "business-success", name: "Бизнес и успех",         icon: Briefcase, color: "#1a2d35", desc: "Франклин, Карнеги" },
  { slug: "science",          name: "Космос и наука",         icon: Telescope, color: "#0f1f3a", desc: "Циолковский, Жюль Верн" },
  { slug: "uzbek-classics",   name: "Узбекская классика",     icon: Star,      color: "#3a2010", desc: "Навои, Бабур, Чулпан" },
] as const;

// Mock preview covers per category
const COVER_COLORS: Record<string, string[]> = {
  "russian-classics":  ["#1a2d4a", "#223a5a", "#152438"],
  "world-classics":    ["#2c1940", "#381f52", "#220f33"],
  "romance":           ["#3d1414", "#521c1c", "#2d0f0f"],
  "philosophy":        ["#1a2a1a", "#233523", "#122012"],
  "self-development":  ["#2d2010", "#3d2a15", "#1f1508"],
  "business-success":  ["#1a2d35", "#22384a", "#102028"],
  "science":           ["#0f1f3a", "#152a52", "#0a1528"],
  "uzbek-classics":    ["#3a2010", "#4d2a15", "#2a1508"],
};

interface CategoryCardProps {
  category: typeof CATEGORIES[number];
  index: number;
  inView: boolean;
}

function CategoryCard({ category, index, inView }: CategoryCardProps) {
  const Icon = category.icon;
  const covers = COVER_COLORS[category.slug] ?? ["#222", "#333", "#444"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/categories/${category.slug}`} className="group block">
        <div
          className="relative overflow-hidden rounded-xl border border-border/30 bg-card/60 p-5
                     transition-all duration-300 ease-out
                     hover:-translate-y-2 hover:border-primary/30
                     hover:shadow-xl hover:shadow-primary/10 hover:bg-card"
        >
          {/* Icon + title */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
              style={{ background: `${category.color}88` }}
            >
              <Icon className="h-4 w-4 text-primary/80" />
            </div>
            <div>
              <h3
                className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors duration-200"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{category.desc}</p>
            </div>
          </div>

          {/* Fan-out mini covers */}
          <div className="relative h-10 mt-2 overflow-visible">
            {covers.map((color, ci) => (
              <div
                key={ci}
                className="absolute bottom-0 rounded-sm border border-white/10 transition-all duration-300"
                style={{
                  width: 24,
                  height: 36,
                  background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
                  left: ci * 22,
                  transform: `rotate(${(ci - 1) * 5}deg)`,
                  transformOrigin: "bottom center",
                  zIndex: ci,
                }}
              />
            ))}
            {/* Hover: fan out */}
            <style>{`
              .group:hover .fan-${category.slug.replace(/-/g, "_")} {
                transform: rotate(0deg) translateY(-4px) !important;
              }
            `}</style>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary/60 mb-3">
            Разделы
          </p>
          <h2
            className="text-4xl sm:text-5xl font-semibold text-foreground"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Категории
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
