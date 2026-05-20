"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Library, ExternalLink } from "lucide-react";

const links = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/books", label: "Книги", icon: Library, exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors ${
              active
                ? "bg-foreground/[0.08] font-medium text-foreground"
                : "text-foreground/55 hover:bg-foreground/[0.05] hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
      <div className="mt-6 border-t border-foreground/8 pt-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground/45 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          На сайт
        </Link>
      </div>
    </nav>
  );
}
