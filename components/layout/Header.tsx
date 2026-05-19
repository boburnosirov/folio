"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, BookOpen, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Folio — главная"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/15 group-hover:ring-primary/40">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <span
            className="text-2xl font-semibold tracking-wide text-foreground transition-colors group-hover:text-primary"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Folio
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === link.href
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/catalog?search=true"
            aria-label="Поиск"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9 text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground hover:text-foreground"
            )}
          >
            Войти
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-px hover:shadow-md hover:shadow-primary/20"
            )}
          >
            Начать читать
          </Link>
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/40 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-border/40 pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "flex-1 bg-primary text-primary-foreground"
                  )}
                >
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
