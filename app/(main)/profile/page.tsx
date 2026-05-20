"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, BookMarked, LogOut, Mail, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

type LocalProgress = { slug: string; page: number; total?: number };

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

function getLocalProgress(): LocalProgress[] {
  const items: LocalProgress[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("folio_read_")) {
        const slug = key.replace("folio_read_", "");
        const val = JSON.parse(localStorage.getItem(key) ?? "{}");
        if (typeof val.page === "number") {
          items.push({ slug, page: val.page });
        }
      }
    }
  } catch {}
  return items;
}

export default function ProfilePage() {
  const user = useUser();
  const router = useRouter();
  const [progress, setProgress] = useState<LocalProgress[]>([]);

  useEffect(() => {
    setProgress(getLocalProgress());
  }, []);

  // Redirect if not logged in (middleware also handles this)
  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (user === undefined || user === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
      </div>
    );
  }

  const joinedAt = new Date(user.created_at).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {/* Header */}
        <div className="mb-10 flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0071e3] text-xl font-bold text-white dark:bg-white dark:text-black">
            {getInitials(user.email ?? "U")}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {user.email?.split("@")[0]}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-foreground/45">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                С нами с {joinedAt}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-foreground/12 px-3 py-1.5 text-xs text-foreground/50 transition-colors hover:border-red-500/30 hover:text-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            Выйти
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Читаю сейчас", value: progress.length, icon: BookOpen },
            { label: "Закладки", value: 0, icon: BookMarked },
            { label: "Прочитано", value: 0, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-4"
            >
              <Icon className="mb-2 h-4 w-4 text-foreground/35" />
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {value}
              </p>
              <p className="text-xs text-foreground/45">{label}</p>
            </div>
          ))}
        </div>

        {/* Reading progress */}
        <section className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Продолжить чтение
          </h2>
          {progress.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-foreground/12 py-10 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-foreground/20" />
              <p className="text-sm text-foreground/40">Вы ещё не начали ни одной книги</p>
              <Link
                href="/catalog"
                className="mt-3 inline-flex rounded-full bg-[#0071e3] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0077ed]"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {progress.map(({ slug, page }) => (
                <Link
                  key={slug}
                  href={`/read/${slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-foreground/8 bg-foreground/[0.03] px-5 py-4 transition-colors hover:bg-foreground/[0.06]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground/80 group-hover:text-foreground">
                      {slug.replace(/-/g, " ")}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/40">
                      Страница {page + 1}
                    </p>
                  </div>
                  <span className="ml-4 shrink-0 text-xs text-[#0071e3]">
                    Продолжить →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Bookmarks placeholder */}
        <section id="bookmarks">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Закладки
          </h2>
          <div className="rounded-2xl border border-dashed border-foreground/12 py-10 text-center">
            <BookMarked className="mx-auto mb-3 h-8 w-8 text-foreground/20" />
            <p className="text-sm text-foreground/40">Закладок пока нет</p>
          </div>
        </section>
      </div>
    </div>
  );
}
