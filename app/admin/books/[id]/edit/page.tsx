import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Upload } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { updateBook } from "../../../actions";
import BookForm from "../../BookForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const bookId = parseInt(id);
  if (isNaN(bookId)) notFound();

  const supabase = createAdminClient();
  const [{ data: book }, { data: categories }] = await Promise.all([
    supabase
      .from("books")
      .select("*, authors(name, name_ru)")
      .eq("id", bookId)
      .single(),
    supabase.from("categories").select("slug, name").order("display_order"),
  ]);

  if (!book) notFound();

  const action = updateBook.bind(null, bookId);

  return (
    <div className="p-8">
      <Link
        href="/admin/books"
        className="mb-6 flex items-center gap-1.5 text-sm text-foreground/45 hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад к книгам
      </Link>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-foreground">Редактировать книгу</h1>
          <p className="text-sm text-foreground/45">{book.title_ru ?? book.title}</p>
        </div>
        <Link
          href={`/admin/books/${bookId}/upload`}
          className="flex items-center gap-2 rounded-full border border-foreground/12 px-4 py-2 text-sm text-foreground/60 hover:border-foreground/25 hover:text-foreground"
        >
          <Upload className="h-4 w-4" />
          Файлы книги
        </Link>
      </div>
      <div className="max-w-2xl">
        <BookForm
          action={action}
          categories={categories ?? []}
          defaultValues={{
            title: book.title,
            title_ru: book.title_ru ?? undefined,
            author_name:
              (book.authors as any)?.name_ru ??
              (book.authors as any)?.name ??
              "",
            category_slug: book.category_slug,
            language: book.language,
            year_published: book.year_published,
            description: book.description,
            cover_url: book.cover_url,
            gutenberg_id: book.gutenberg_id,
            is_featured: book.is_featured,
            is_public: book.is_public,
          }}
          submitLabel="Сохранить изменения"
        />
      </div>
    </div>
  );
}
