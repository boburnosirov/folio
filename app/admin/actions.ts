"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ёе]/g, "e").replace(/[ый]/g, "y").replace(/[а]/g, "a")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

async function getOrCreateAuthor(name: string): Promise<number | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;

  const { data: byName } = await db.from("authors").select("id").ilike("name", trimmed).limit(1);
  if (byName?.length > 0) return byName[0].id as number;

  const { data: byRu } = await db.from("authors").select("id").ilike("name_ru", trimmed).limit(1);
  if (byRu?.length > 0) return byRu[0].id as number;

  const { data: created } = await db.from("authors").insert({ name: trimmed }).select("id").single();
  return (created?.id as number) ?? null;
}

function parseBookForm(formData: FormData) {
  return {
    title: (formData.get("title") as string).trim(),
    title_ru: ((formData.get("title_ru") as string) ?? "").trim() || null,
    author_name: (formData.get("author_name") as string) ?? "",
    category_slug: ((formData.get("category_slug") as string) ?? "").trim() || null,
    language: (formData.get("language") as string) || "ru",
    year_published:
      formData.get("year_published")
        ? parseInt(formData.get("year_published") as string)
        : null,
    description: ((formData.get("description") as string) ?? "").trim() || null,
    cover_url: ((formData.get("cover_url") as string) ?? "").trim() || null,
    gutenberg_id: formData.get("gutenberg_id")
      ? parseInt(formData.get("gutenberg_id") as string)
      : null,
    is_featured: formData.get("is_featured") === "on",
    is_public: formData.get("is_public") === "on",
  };
}

export async function createBook(formData: FormData) {
  await requireAdmin();
  const fields = parseBookForm(formData);
  const author_id = await getOrCreateAuthor(fields.author_name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  const slug = slugify(fields.title_ru ?? fields.title);
  const { error } = await supabase.from("books").insert({
    slug,
    title: fields.title,
    title_ru: fields.title_ru,
    author_id,
    category_slug: fields.category_slug,
    language: fields.language as any,
    year_published: fields.year_published,
    description: fields.description,
    cover_url: fields.cover_url,
    gutenberg_id: fields.gutenberg_id,
    is_featured: fields.is_featured,
    is_public: fields.is_public,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/books");
  revalidatePath("/catalog");
  redirect("/admin/books");
}

export async function updateBook(id: number, formData: FormData) {
  await requireAdmin();
  const fields = parseBookForm(formData);
  const author_id = await getOrCreateAuthor(fields.author_name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  const { error } = await supabase
    .from("books")
    .update({
      title: fields.title,
      title_ru: fields.title_ru,
      author_id,
      category_slug: fields.category_slug,
      language: fields.language as any,
      year_published: fields.year_published,
      description: fields.description,
      cover_url: fields.cover_url,
      gutenberg_id: fields.gutenberg_id,
      is_featured: fields.is_featured,
      is_public: fields.is_public,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/books");
  revalidatePath("/catalog");
  redirect("/admin/books");
}

export async function deleteBook(id: number) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/books");
  revalidatePath("/catalog");
}

export async function toggleBookVisibility(id: number, isPublic: boolean) {
  await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;
  const { error } = await supabase
    .from("books")
    .update({ is_public: isPublic })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/books");
  revalidatePath("/catalog");
}
