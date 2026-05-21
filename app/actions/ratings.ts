"use server";

import { createClient } from "@/lib/supabase/server";
import type { BookRating } from "@/lib/types/database";

export async function getRatings(bookId: number): Promise<BookRating[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_ratings")
    .select("*")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });
  return (data ?? []) as BookRating[];
}

export async function getUserRating(bookId: number): Promise<BookRating | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("book_ratings")
    .select("*")
    .eq("book_id", bookId)
    .eq("user_id", user.id)
    .single();
  return data as BookRating | null;
}

export async function submitRating(
  bookId: number,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Необходимо войти в аккаунт" };

  const { error } = await supabase
    .from("book_ratings")
    .upsert(
      { user_id: user.id, book_id: bookId, rating, comment: comment.trim() || null },
      { onConflict: "user_id,book_id" }
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteRating(bookId: number): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  await supabase.from("book_ratings").delete().eq("book_id", bookId).eq("user_id", user.id);
  return { success: true };
}
