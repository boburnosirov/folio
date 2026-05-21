"use client";

import { useRouter } from "next/navigation";
import type { BookWithAuthor } from "@/lib/types/database";

interface Props {
  currentSlug: string;
  currentLanguage: string;
  companion: BookWithAuthor | null;
}

const LANG_LABEL: Record<string, string> = {
  ru: "RU", en: "EN", uz: "UZ",
};

export function LanguageSwitcher({ currentSlug, currentLanguage, companion }: Props) {
  const router = useRouter();

  if (!companion) return null;

  const compLang = companion.language;

  return (
    <div className="flex items-center gap-1 rounded-full bg-foreground/[0.06] p-1 text-sm font-semibold">
      <span className="rounded-full bg-background px-3 py-1 text-xs font-bold text-foreground shadow-sm">
        {LANG_LABEL[currentLanguage] ?? currentLanguage.toUpperCase()}
      </span>
      <button
        onClick={() => router.push(`/books/${companion.slug}`)}
        className="rounded-full px-3 py-1 text-xs text-foreground/50 transition-colors hover:text-foreground"
      >
        {LANG_LABEL[compLang] ?? compLang.toUpperCase()}
      </button>
    </div>
  );
}
