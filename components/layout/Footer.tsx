import Link from "next/link";
import { BookOpen } from "lucide-react";

const footerLinks = {
  Каталог: [
    { href: "/categories/russian-classics", label: "Русская классика" },
    { href: "/categories/world-classics", label: "Зарубежная классика" },
    { href: "/categories/uzbek-classics", label: "Узбекская классика" },
    { href: "/categories/philosophy", label: "Философия" },
    { href: "/categories/self-development", label: "Саморазвитие" },
  ],
  Читателям: [
    { href: "/catalog", label: "Все книги" },
    { href: "/register", label: "Регистрация" },
    { href: "/login", label: "Войти" },
    { href: "/account", label: "Личный кабинет" },
  ],
  "О проекте": [
    { href: "/about", label: "О библиотеке" },
    { href: "/about#public-domain", label: "Что такое public domain" },
    { href: "/about#sources", label: "Источники текстов" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/10 ring-1 ring-primary/20">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
              </div>
              <span
                className="font-heading text-xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                Folio
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Бесплатная библиотека книг общественного достояния. Читайте и скачивайте легально.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Folio. Все тексты из общественного достояния.
          </p>
          <p className="text-xs text-muted-foreground">
            Сделано для читателей СНГ и Узбекистана
          </p>
        </div>
      </div>
    </footer>
  );
}
