import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { createBook } from "../../actions";
import BookForm from "../BookForm";

export default async function NewBookPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("display_order");

  return (
    <div className="p-8">
      <Link
        href="/admin/books"
        className="mb-6 flex items-center gap-1.5 text-sm text-foreground/45 hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад к книгам
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Добавить книгу</h1>
      <div className="max-w-2xl">
        <BookForm
          action={createBook}
          categories={categories ?? []}
          submitLabel="Добавить книгу"
        />
      </div>
    </div>
  );
}
