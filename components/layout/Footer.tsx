import Link from "next/link";
import { BookOpen } from "lucide-react";

const footerLinks = {
  Каталог: [
    { href: "/categories/russian-classics", label: "Русская классика" },
    { href: "/categories/world-classics", label: "Зарубежная классика" },
    { href: "/categories/uzbek-classics", label: "Узбекская классика" },
    { href: "/categories/philosophy", label: "Философия" },
    { href: "/categories/science", label: "Космос и наука" },
  ],
  Читателям: [
    { href: "/catalog", label: "Все книги" },
    { href: "/register", label: "Регистрация" },
    { href: "/login", label: "Войти" },
    { href: "/account", label: "Личный кабинет" },
  ],
  "О проекте": [
    { href: "/about", label: "О библиотеке" },
    { href: "/about#public-domain", label: "Public domain" },
    { href: "/about#sources", label: "Источники текстов" },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-black/6 bg-[#f5f5f7] dark:border-white/10 dark:bg-[#050507]">
      <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100">
        <div className="absolute left-[12%] top-10 h-1 w-1 rounded-full bg-foreground/20" />
        <div className="absolute left-[44%] top-24 h-1 w-1 rounded-full bg-foreground/14" />
        <div className="absolute right-[18%] top-14 h-1 w-1 rounded-full bg-foreground/18" />
        <div className="absolute right-[34%] bottom-16 h-1 w-1 rounded-full bg-foreground/12" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group flex w-fit items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-heading text-2xl font-semibold tracking-[-0.03em] text-foreground">Folio</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-foreground/56 dark:text-white/56">
              Бесплатная библиотека книг общественного достояния. Читайте и скачивайте легально.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/42">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group text-sm text-foreground/58 transition-colors hover:text-foreground dark:text-white/58 dark:hover:text-white">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/6 pt-6 dark:border-white/10 sm:flex-row">
          <p className="text-xs text-foreground/45 dark:text-white/45">
            © {new Date().getFullYear()} Folio. Все тексты - из общественного достояния.
          </p>
          <p className="text-xs text-foreground/45 dark:text-white/45">
            Сделано для читателей СНГ и Узбекистана
          </p>
        </div>
      </div>
    </footer>
  );
}
