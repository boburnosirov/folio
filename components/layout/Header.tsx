"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Menu, Search, X, Heart, Bookmark } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsMenu } from "./SettingsMenu";
import { UserMenu, UserMenuMobile } from "./UserMenu";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/categories/russian-classics", label: "Классика" },
  { href: "/categories/uzbek-classics", label: "Узбекская классика" },
  { href: "/categories/philosophy", label: "Философия" },
  { href: "/favorites", label: "Избранное" },
  { href: "/read-later", label: "Читать потом" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/6 bg-background/78 backdrop-blur-2xl dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="Folio — главная">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-heading text-2xl font-semibold tracking-[-0.03em] text-foreground">Folio</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 rounded-full bg-foreground/[0.045] p-1 md:flex dark:bg-white/[0.065]">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
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
            href="/favorites"
            aria-label="Избранное"
            prefetch={false}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 rounded-full text-foreground/62 hover:text-foreground")}
          >
            <Heart className="h-4 w-4" />
          </Link>
          <Link
            href="/read-later"
            aria-label="Читать потом"
            prefetch={false}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 rounded-full text-foreground/62 hover:text-foreground")}
          >
            <Bookmark className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label="Поиск (⌘K)"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true }));
            }}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 rounded-full text-foreground/62 hover:text-foreground")}
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <SettingsMenu />
          <UserMenu />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <SettingsMenu />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Меню"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu — CSS-driven, no framer */}
      <div
        className={cn(
          "overflow-hidden border-t border-black/6 bg-background/95 backdrop-blur-2xl transition-[max-height,opacity] duration-300 ease-out md:hidden dark:border-white/10",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl px-3 py-2 text-sm font-medium text-foreground/72 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-black/6 pt-3 dark:border-white/10">
            <UserMenuMobile onClose={() => setMobileOpen(false)} />
          </div>
        </nav>
      </div>
    </header>
  );
}
