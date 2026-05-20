"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(bookId: number, bookSlug: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("user_bookmarks")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .limit(1);

  const isBookmarked = (existing ?? []).length > 0;

  if (isBookmarked) {
    await supabase.from("user_bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("book_id", bookId);
  } else {
    await supabase.from("user_bookmarks")
      .insert({ user_id: user.id, book_id: bookId });
  }

  revalidatePath(`/books/${bookSlug}`);
  revalidatePath("/profile");
  return !isBookmarked;
}
