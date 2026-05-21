"use server";

import { createClient } from "@/lib/supabase/server";
import type { BookWithAuthor } from "@/lib/types/database";

// ── Favorites ────────────────────────────────────────────────────

export async function getFavorites(): Promise<BookWithAuthor[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_favorites")
    .select("book_id, books(*, authors(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []).map((r: any) => r.books).filter(Boolean)) as BookWithAuthor[];
}

export async function toggleFavorite(
  bookId: number
): Promise<{ isFavorite: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isFavorite: false };

  const { data: existing } = await supabase
    .from("user_favorites")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single();

  if (existing) {
    await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("book_id", bookId);
    return { isFavorite: false };
  } else {
    await supabase.from("user_favorites").insert({ user_id: user.id, book_id: bookId });
    return { isFavorite: true };
  }
}

export async function isFavorite(bookId: number): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("user_favorites")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single();
  return !!data;
}

// ── Read Later ───────────────────────────────────────────────────

export async function getReadLater(): Promise<BookWithAuthor[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_read_later")
    .select("book_id, books(*, authors(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []).map((r: any) => r.books).filter(Boolean)) as BookWithAuthor[];
}

export async function toggleReadLater(
  bookId: number
): Promise<{ isReadLater: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isReadLater: false };

  const { data: existing } = await supabase
    .from("user_read_later")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single();

  if (existing) {
    await supabase.from("user_read_later").delete().eq("user_id", user.id).eq("book_id", bookId);
    return { isReadLater: false };
  } else {
    await supabase.from("user_read_later").insert({ user_id: user.id, book_id: bookId });
    return { isReadLater: true };
  }
}

export async function isReadLater(bookId: number): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("user_read_later")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single();
  return !!data;
}
