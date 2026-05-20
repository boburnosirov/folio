"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

const LANGUAGES = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
  { value: "uz", label: "Ўзбекча" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

interface Props {
  categories: Category[];
  activeCategory?: string;
  activeLanguage?: string;
}

export function CatalogFilters({ categories, activeCategory, activeLanguage }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildUrl(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val) params.set(key, val);
      else params.delete(key);
    }
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildUrl({ category: undefined })}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            !activeCategory
              ? "bg-foreground text-background dark:bg-white dark:text-black"
              : "bg-foreground/[0.06] text-foreground/65 hover:bg-foreground/10 hover:text-foreground"
          )}
        >
          Все
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={buildUrl({ category: cat.slug })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat.slug
                ? "bg-foreground text-background dark:bg-white dark:text-black"
                : "bg-foreground/[0.06] text-foreground/65 hover:bg-foreground/10 hover:text-foreground"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildUrl({ language: undefined })}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            !activeLanguage
              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
              : "bg-foreground/[0.04] text-foreground/50 hover:bg-foreground/8 hover:text-foreground"
          )}
        >
          Все языки
        </Link>
        {LANGUAGES.map((lang) => (
          <Link
            key={lang.value}
            href={buildUrl({ language: lang.value })}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeLanguage === lang.value
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-foreground/[0.04] text-foreground/50 hover:bg-foreground/8 hover:text-foreground"
            )}
          >
            {lang.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
