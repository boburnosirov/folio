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

  if (search) {
    // Search by title AND author name via SQL function
    const { data, error } = await supabase
      .rpc("search_books", { query: search })
      .select("*, authors(*)")
      .range(offset, offset + limit - 1);
    if (error) {
      // Fallback to ilike if rpc fails
      const { data: fallback } = await supabase
        .from("books")
        .select("*, authors(*)")
        .eq("is_public", true)
        .or(`title.ilike.%${search}%,title_ru.ilike.%${search}%`)
        .order("is_featured", { ascending: false })
        .range(offset, offset + limit - 1);
      return (fallback ?? []) as BookWithAuthor[];
    }
    return (data ?? []) as BookWithAuthor[];
  }

  let q = supabase
    .from("books")
    .select("*, authors(*)")
    .eq("is_public", true)
    .order("is_featured", { ascending: false })
    .order("avg_rating", { ascending: false })
    .order("read_count", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) q = q.eq("category_slug", category);
  if (language) q = q.eq("language", language);
  if (featured) q = q.eq("is_featured", true);

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

export async function getRelatedBooks(
  bookId: number,
  categorySlug: string | null,
  authorId: number | null,
  limit = 4
): Promise<BookWithAuthor[]> {
  const supabase = await createClient();

  if (categorySlug) {
    const { data } = await supabase
      .from("books")
      .select("*, authors(*)")
      .eq("is_public", true)
      .eq("category_slug", categorySlug)
      .neq("id", bookId)
      .order("is_featured", { ascending: false })
      .order("read_count", { ascending: false })
      .limit(limit);
    if (data && data.length > 0) return data as BookWithAuthor[];
  }

  if (authorId) {
    const { data } = await supabase
      .from("books")
      .select("*, authors(*)")
      .eq("is_public", true)
      .eq("author_id", authorId)
      .neq("id", bookId)
      .limit(limit);
    if (data && data.length > 0) return data as BookWithAuthor[];
  }

  return [];
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

export async function incrementReadCount(bookId: number): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_read_count", { book_id: bookId });
}

export async function getCompanionBook(companionSlug: string): Promise<BookWithAuthor | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("slug", companionSlug)
    .eq("is_public", true)
    .single();
  return data as BookWithAuthor | null;
}

export async function getMostReadBooks(period: "week" | "month" | "all", limit = 5): Promise<BookWithAuthor[]> {
  const supabase = await createClient();
  const orderCol = period === "week" ? "weekly_read_count" : period === "month" ? "monthly_read_count" : "read_count";
  const { data } = await supabase
    .from("books")
    .select("*, authors(*)")
    .eq("is_public", true)
    .order(orderCol, { ascending: false })
    .limit(limit);
  return (data ?? []) as BookWithAuthor[];
}
