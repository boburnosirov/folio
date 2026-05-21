import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getReadLater } from "@/app/actions/favorites";
import { BookCard } from "@/components/catalog/BookCard";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Читать потом — Folio",
  description: "Книги, которые вы хотите прочитать позже",
};

export default async function ReadLaterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const books = await getReadLater();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3]/10">
          <Bookmark className="h-5 w-5 fill-[#0071e3] text-[#0071e3]" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Читать потом
          </h1>
          <p className="text-sm text-foreground/45 mt-0.5">
            {books.length > 0 ? `${books.length} книг` : "Список пуст"}
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bookmark className="h-16 w-16 text-foreground/10 mb-4" />
          <p className="text-lg font-semibold text-foreground/40">Список пуст</p>
          <p className="mt-1 text-sm text-foreground/30">
            Сохраняйте книги сюда, чтобы вернуться к ним позже
          </p>
          <a
            href="/catalog"
            className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Перейти в каталог
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
