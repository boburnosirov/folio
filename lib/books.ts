import { createClient } from "@/lib/supabase/server";
import type { BookFull, BookWithAuthor } from "@/lib/types/database";

export interface BooksQuery {
  category?: string;
  language?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export async function getBooks(query: BooksQuery = {}): Promise<BookWithAuthor[]> {
  const supabase = await createClient();
  const { category, language, search, featured, limit = 24, offset = 0 } = query;

  let q = supabase
    .from("books")
    .select("*, authors(*)")
    .eq("is_public", true)
    .order("is_featured", { ascending: false })
    .order("read_count", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) q = q.eq("category_slug", category);
  if (language) q = q.eq("language", language);
  if (featured) q = q.eq("is_featured", true);
  if (search) q = q.ilike("title", `%${search}%`);

  const { data, error } = await q;
  if (error) { console.error("[getBooks]", error.message); return []; }
  return (data ?? []) as BookWithAuthor[];
}

export async function getBook(slug: string): Promise<BookFull | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*, authors(*), categories(*)")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (error) { console.error("[getBook]", error.message); return null; }
  return data as BookFull;
}

export async function getFeaturedBooks(limit = 6): Promise<BookWithAuthor[]> {
  return getBooks({ featured: true, limit });
}

export async function getBooksByCategory(
  categorySlug: string,
  limit = 24
): Promise<BookWithAuthor[]> {
  return getBooks({ category: categorySlug, limit });
}

export async function searchBooks(query: string): Promise<BookWithAuthor[]> {
  return getBooks({ search: query });
}

export async function incrementReadCount(_bookId: number): Promise<void> {
  // Increment happens server-side via DB trigger once wired up
}
