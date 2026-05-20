"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, BookMarked, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  // Still loading
  if (user === undefined) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/10" />;
  }

  // Not logged in
  if (user === null) {
    return (
      <>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "rounded-full text-foreground/62 hover:text-foreground"
          )}
        >
          Войти
        </Link>
        <Link
          href="/register"
          className="inline-flex h-9 items-center rounded-full bg-[#0071e3] px-4 text-sm font-semibold text-white transition-transform hover:scale-[1.025] active:scale-[.97] dark:bg-white dark:text-black"
        >
          Начать читать
        </Link>
      </>
    );
  }

  // Logged in
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-foreground/12 bg-foreground/[0.04] pl-1 pr-3 py-1 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/8 hover:text-foreground"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0071e3] text-[10px] font-bold text-white">
          {getInitials(user.email ?? "U")}
        </span>
        <span className="hidden max-w-[120px] truncate sm:block">
          {user.email?.split("@")[0]}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 py-1 shadow-2xl shadow-black/15 backdrop-blur-xl">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <User className="h-4 w-4" />
            Мой профиль
          </Link>
          <Link
            href="/profile#bookmarks"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <BookMarked className="h-4 w-4" />
            Закладки
          </Link>
          <div className="my-1 h-px bg-foreground/8" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500/80 transition-colors hover:bg-red-500/8 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

// Mobile version for burger menu
export function UserMenuMobile({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  };

  if (user === undefined || user === null) {
    return (
      <div className="flex gap-2">
        <Link
          href="/login"
          onClick={onClose}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex-1 rounded-full"
          )}
        >
          Войти
        </Link>
        <Link
          href="/register"
          onClick={onClose}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-[#0071e3] text-sm font-semibold text-white"
        >
          Регистрация
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 py-1 text-xs text-foreground/35">{user.email}</p>
      <Link
        href="/profile"
        onClick={onClose}
        className="rounded-2xl px-3 py-2 text-sm font-medium text-foreground/72 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        Мой профиль
      </Link>
      <button
        onClick={handleLogout}
        className="rounded-2xl px-3 py-2 text-left text-sm font-medium text-red-500/70 transition-colors hover:bg-red-500/8 hover:text-red-500"
      >
        Выйти
      </button>
    </div>
  );
}
