import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { BookOpen, Library, Star, Users } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [
    { count: total },
    { count: pub },
    { count: featured },
    { count: authors },
    { count: categories },
    { data: recent },
  ] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }).eq("is_public", true),
    supabase.from("books").select("*", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("authors").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("books")
      .select("id, title, title_ru, is_public, is_featured, authors(name, name_ru)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const stats = [
    { label: "Всего книг", value: total ?? 0, icon: Library, cls: "text-[#0071e3]" },
    { label: "Опубликовано", value: pub ?? 0, icon: BookOpen, cls: "text-green-500" },
    { label: "Рекомендуемые", value: featured ?? 0, icon: Star, cls: "text-yellow-500" },
    { label: "Авторов", value: authors ?? 0, icon: Users, cls: "text-purple-400" },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Дашборд</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, cls }) => (
          <div
            key={label}
            className="rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-5"
          >
            <Icon className={`mb-3 h-5 w-5 ${cls}`} />
            <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
            <p className="mt-1 text-sm text-foreground/50">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Последние добавленные</h2>
        <Link
          href="/admin/books"
          className="text-sm text-[#0071e3] hover:underline"
        >
          Все книги →
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-foreground/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/8 bg-foreground/[0.03]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/40">
                Название
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/40 md:table-cell">
                Автор
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/40">
                Статус
              </th>
            </tr>
          </thead>
          <tbody>
            {(recent ?? []).map((book) => (
              <tr
                key={book.id}
                className="border-b border-foreground/6 last:border-0 hover:bg-foreground/[0.02]"
              >
                <td className="px-4 py-3 font-medium text-foreground/85">
                  {book.title_ru ?? book.title}
                </td>
                <td className="hidden px-4 py-3 text-foreground/50 md:table-cell">
                  {(book.authors as any)?.name_ru ??
                    (book.authors as any)?.name ??
                    "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      book.is_public
                        ? "bg-green-500/12 text-green-600 dark:text-green-400"
                        : "bg-foreground/8 text-foreground/40"
                    }`}
                  >
                    {book.is_public ? "публично" : "скрыто"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-foreground/30">
        Категорий в базе: {categories ?? 0}
      </p>
    </div>
  );
}
