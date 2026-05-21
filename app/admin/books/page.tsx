import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import BooksTableActions from "./BooksTableActions";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminBooksPage({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1"));
  const perPage = 25;
  const offset = (pageNum - 1) * perPage;

  const supabase = createAdminClient();

  let query = supabase
    .from("books")
    .select("id, title, title_ru, category_slug, language, is_public, is_featured, txt_url, authors(name, name_ru)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (q) query = query.ilike("title", `%${q}%`);

  const { data: books, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Книги</h1>
          <p className="mt-0.5 text-sm text-foreground/45">{count ?? 0} записей</p>
        </div>
        <Link
          href="/admin/books/new"
          className="flex items-center gap-2 rounded-full bg-[#0071e3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0077ed]"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </Link>
      </div>

      <form className="mb-5" method="GET">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск по названию..."
          className="w-full max-w-sm rounded-xl border border-foreground/12 bg-foreground/[0.03] px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-[#0071e3]/50 focus:outline-none"
        />
      </form>

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
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/40 lg:table-cell">
                Категория
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/40">
                Статус
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground/40">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {(books ?? []).map((book) => (
              <tr
                key={book.id}
                className="border-b border-foreground/6 last:border-0 hover:bg-foreground/[0.02]"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground/85">
                    {book.title_ru ?? book.title}
                  </p>
                  {book.title_ru && (
                    <p className="text-xs text-foreground/35">{book.title}</p>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-foreground/55 md:table-cell">
                  {(book.authors as any)?.name_ru ??
                    (book.authors as any)?.name ??
                    "—"}
                </td>
                <td className="hidden px-4 py-3 text-foreground/45 lg:table-cell">
                  {book.category_slug ?? "—"}
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
                  {book.is_featured && (
                    <span className="ml-1.5 inline-flex rounded-full bg-yellow-500/12 px-2 py-0.5 text-[11px] font-medium text-yellow-600 dark:text-yellow-400">
                      топ
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <BooksTableActions bookId={book.id} isPublic={book.is_public} hasTxt={!!book.txt_url} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(books ?? []).length === 0 && (
          <div className="py-16 text-center text-sm text-foreground/35">
            {q ? `Книги по запросу «${q}» не найдены` : "Книг нет"}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`/admin/books?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                  p === pageNum
                    ? "bg-[#0071e3] font-semibold text-white"
                    : "text-foreground/50 hover:bg-foreground/[0.06]"
                }`}
              >
                {p}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
