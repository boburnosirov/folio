import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFavorites } from "@/app/actions/favorites";
import { BookCard } from "@/components/catalog/BookCard";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Избранное — Folio",
  description: "Ваши избранные книги на Folio",
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const books = await getFavorites();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10">
          <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Избранное
          </h1>
          <p className="text-sm text-foreground/45 mt-0.5">
            {books.length > 0 ? `${books.length} книг` : "Нет сохранённых книг"}
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-16 w-16 text-foreground/10 mb-4" />
          <p className="text-lg font-semibold text-foreground/40">Здесь пусто</p>
          <p className="mt-1 text-sm text-foreground/30">
            Добавляйте книги в избранное, чтобы быстро их находить
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
