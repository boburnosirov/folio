"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmark } from "@/app/actions/bookmarks";

interface Props {
  bookId: number;
  bookSlug: string;
  initialBookmarked: boolean;
  isLoggedIn: boolean;
}

export function BookmarkButton({ bookId, bookSlug, initialBookmarked, isLoggedIn }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isLoggedIn) {
      window.location.href = `/login?next=/books/${bookSlug}`;
      return;
    }
    startTransition(async () => {
      try {
        const next = await toggleBookmark(bookId, bookSlug);
        setBookmarked(next);
      } catch {}
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={bookmarked ? "Убрать из закладок" : "Добавить в закладки"}
      className={`flex h-12 items-center justify-center gap-2 rounded-full border text-[15px] font-semibold transition-all hover:scale-[1.02] active:scale-[.98] disabled:opacity-60 ${
        bookmarked
          ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3] dark:border-white/30 dark:bg-white/10 dark:text-white"
          : "border-foreground/12 bg-foreground/[0.04] text-foreground/70 hover:bg-foreground/8 hover:text-foreground"
      }`}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      {bookmarked ? "В закладках" : "В закладки"}
    </button>
  );
}
