import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { UploadClient } from "./UploadClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UploadFilesPage({ params }: Props) {
  const { id } = await params;
  const bookId = parseInt(id);
  if (isNaN(bookId)) notFound();

  const db = createAdminClient();
  const { data: book } = await db
    .from("books")
    .select("id, slug, title, title_ru, language, txt_url, epub_url, pdf_url")
    .eq("id", bookId)
    .single();

  if (!book) notFound();

  return (
    <div className="p-8">
      <Link
        href={`/admin/books/${bookId}/edit`}
        className="mb-6 flex w-fit items-center gap-1.5 text-sm text-foreground/45 hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад к редактированию
      </Link>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Файлы книги</h1>
      <p className="mb-8 text-sm text-foreground/45">{book.title_ru ?? book.title}</p>

      <UploadClient book={book as any} />
    </div>
  );
}
