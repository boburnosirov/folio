import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, BookMarked, LogOut, Mail, Clock, Trophy, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileLogout } from "./ProfileLogout";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const isAdmin = !!user.email && user.email === process.env.ADMIN_EMAIL;

  // Fetch reading progress with book info (only public, readable books)
  const { data: progressRows } = await supabase
    .from("reading_progress")
    .select("position, updated_at, books!inner(id, slug, title, title_ru, cover_url, is_public, txt_url, authors(name, name_ru))")
    .eq("user_id", user.id)
    .eq("books.is_public", true)
    .order("updated_at", { ascending: false })
    .limit(10);

  // Fetch bookmarks with book info (only public books)
  const { data: bookmarkRows } = await supabase
    .from("user_bookmarks")
    .select("created_at, books!inner(id, slug, title, title_ru, cover_url, is_public, authors(name, name_ru))")
    .eq("user_id", user.id)
    .eq("books.is_public", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const progress = (progressRows ?? []).filter((r) => r.books);
  const bookmarks = (bookmarkRows ?? []).filter((r) => r.books);

  const joinedAt = new Date(user.created_at).toLocaleDateString("ru-RU", {
    year: "numeric", month: "long", day: "numeric",
  });

  function getInitials(email: string) {
    return email.slice(0, 2).toUpperCase();
  }

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
          <ProfileLogout />
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Читаю сейчас", value: progress.length, icon: BookOpen },
            { label: "Закладки", value: bookmarks.length, icon: BookMarked },
            { label: "Всего книг", value: progress.length + bookmarks.length, icon: Trophy },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-4">
              <Icon className="mb-2 h-4 w-4 text-foreground/35" />
              <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
              <p className="text-xs text-foreground/45">{label}</p>
            </div>
          ))}
        </div>

        {/* Admin panel — only for ADMIN_EMAIL */}
        {isAdmin && (
          <Link
            href="/admin"
            className="mb-8 flex items-center gap-3 rounded-2xl border border-[#0071e3]/20 bg-gradient-to-r from-[#0071e3]/10 to-[#0071e3]/[0.04] p-4 transition-all hover:border-[#0071e3]/40 hover:from-[#0071e3]/15 hover:to-[#0071e3]/[0.08]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-[0_6px_18px_rgba(0,113,227,0.35)]">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Администраторская панель</p>
              <p className="mt-0.5 text-xs text-foreground/55">
                Управление книгами, авторами и категориями библиотеки
              </p>
            </div>
            <span className="hidden text-xs font-medium text-[#0071e3] sm:inline-block">
              Открыть →
            </span>
          </Link>
        )}

        {/* Reading progress */}
        <section className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-foreground">Продолжить чтение</h2>
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
              {progress.map((row) => {
                const book = row.books as any;
                const title = book.title_ru ?? book.title;
                const author = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;
                const page = parseInt(row.position, 10) + 1;
                return (
                  <Link
                    key={book.slug}
                    href={`/read/${book.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-foreground/8 bg-foreground/[0.03] px-4 py-3 transition-colors hover:bg-foreground/[0.06]"
                  >
                    {book.cover_url && (
                      <img
                        src={book.cover_url}
                        alt={title}
                        className="h-14 w-10 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground/80 group-hover:text-foreground">{title}</p>
                      {author && <p className="mt-0.5 truncate text-xs text-foreground/45">{author}</p>}
                      <p className="mt-1 text-xs text-foreground/35">Страница {page}</p>
                    </div>
                    <span className="ml-2 shrink-0 text-xs text-[#0071e3]">Продолжить →</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Bookmarks */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Закладки</h2>
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-foreground/12 py-10 text-center">
              <BookMarked className="mx-auto mb-3 h-8 w-8 text-foreground/20" />
              <p className="text-sm text-foreground/40">Закладок пока нет</p>
              <p className="mt-1 text-xs text-foreground/30">
                Нажмите «В закладки» на странице книги
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {bookmarks.map((row) => {
                const book = row.books as any;
                const title = book.title_ru ?? book.title;
                const author = book.authors ? (book.authors.name_ru ?? book.authors.name) : null;
                return (
                  <Link
                    key={book.slug}
                    href={`/books/${book.slug}`}
                    className="group flex flex-col gap-2"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-xl border border-foreground/8 bg-foreground/[0.04] shadow-sm transition-transform group-hover:scale-[1.02]">
                      {book.cover_url ? (
                        <img src={book.cover_url} alt={title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-3 text-center">
                          <span className="text-xs font-medium text-foreground/50 leading-tight">{title}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground line-clamp-2 leading-snug">{title}</p>
                      {author && <p className="mt-0.5 text-xs text-foreground/45 truncate">{author}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
