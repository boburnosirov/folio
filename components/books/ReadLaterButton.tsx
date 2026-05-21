"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleReadLater } from "@/app/actions/favorites";

interface Props {
  bookId: number;
  initialIsReadLater: boolean;
  isLoggedIn: boolean;
}

export function ReadLaterButton({ bookId, initialIsReadLater, isLoggedIn }: Props) {
  const [isRL, setIsRL] = useState(initialIsReadLater);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) { window.location.href = "/login"; return; }
    startTransition(async () => {
      const res = await toggleReadLater(bookId);
      setIsRL(res.isReadLater);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex h-10 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all ${
        isRL
          ? "border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/15"
          : "border-foreground/10 bg-foreground/[0.04] text-foreground/60 hover:bg-foreground/8 hover:text-foreground"
      }`}
    >
      <Bookmark className={`h-4 w-4 ${isRL ? "fill-[#0071e3]" : ""}`} />
      {isRL ? "Сохранено" : "Читать потом"}
    </button>
  );
}
