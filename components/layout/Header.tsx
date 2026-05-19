"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Menu, Search, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/categories/russian-classics", label: "Классика" },
  { href: "/categories/uzbek-classics", label: "Узбекская классика" },
  { href: "/categories/philosophy", label: "Философия" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/6 bg-background/78 backdrop-blur-2xl dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="Folio — главная">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-heading text-2xl font-semibold tracking-[-0.03em] text-foreground">Folio</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-foreground/[0.045] p-1 md:flex dark:bg-white/[0.065]">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-background text-foreground shadow-sm" : "text-foreground/62 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/catalog?search=true"
            aria-label="Поиск"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 rounded-full text-foreground/62 hover:text-foreground")}
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full text-foreground/62 hover:text-foreground")}
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center rounded-full bg-[#0071e3] px-4 text-sm font-semibold text-white transition-transform hover:scale-[1.025] active:scale-[.97] dark:bg-white dark:text-black"
          >
            Начать читать
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setMobileOpen((value) => !value)} aria-label="Меню">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-black/6 bg-background/95 backdrop-blur-2xl md:hidden dark:border-white/10"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-3 py-2 text-sm font-medium text-foreground/72 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-black/6 pt-3 dark:border-white/10">
                <Link href="/login" onClick={() => setMobileOpen(false)} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 rounded-full")}>
                  Войти
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-[#0071e3] text-sm font-semibold text-white">
                  Регистрация
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
