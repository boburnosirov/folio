"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/favorites";

interface Props {
  bookId: number;
  initialIsFavorite: boolean;
  isLoggedIn: boolean;
}

export function FavoriteButton({ bookId, initialIsFavorite, isLoggedIn }: Props) {
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) { window.location.href = "/login"; return; }
    startTransition(async () => {
      const res = await toggleFavorite(bookId);
      setIsFav(res.isFavorite);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex h-10 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all ${
        isFav
          ? "border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/15"
          : "border-foreground/10 bg-foreground/[0.04] text-foreground/60 hover:bg-foreground/8 hover:text-foreground"
      }`}
    >
      <Heart className={`h-4 w-4 ${isFav ? "fill-rose-500" : ""}`} />
      {isFav ? "В избранном" : "В избранное"}
    </button>
  );
}
