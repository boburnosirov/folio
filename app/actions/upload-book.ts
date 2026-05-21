"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "book-files";

type FileType = "txt" | "epub" | "pdf";

const MIME: Record<FileType, string> = {
  txt: "text/plain",
  epub: "application/epub+zip",
  pdf: "application/pdf",
};

const FOLDER: Record<FileType, string> = {
  txt: "texts",
  epub: "epubs",
  pdf: "pdfs",
};

const COLUMN: Record<FileType, "txt_url" | "epub_url" | "pdf_url"> = {
  txt: "txt_url",
  epub: "epub_url",
  pdf: "pdf_url",
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
}

export async function uploadBookFile(
  bookId: number,
  bookSlug: string,
  fileType: FileType,
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { success: false, error: "Файл не выбран" };

  const ext = fileType === "txt" ? "txt" : fileType === "epub" ? "epub" : "pdf";
  const path = `${FOLDER[fileType]}/${bookSlug}.${ext}`;

  const db = createAdminClient();

  // Upload to storage (upsert — overwrite if exists)
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: MIME[fileType],
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // Get public URL
  const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(path);

  // Update book record
  const { error: updateError } = await db
    .from("books")
    .update({ [COLUMN[fileType]]: publicUrl })
    .eq("id", bookId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/admin/books/${bookId}/upload`);
  revalidatePath(`/books/${bookSlug}`);
  revalidatePath(`/read/${bookSlug}`);

  return { success: true, url: publicUrl };
}

export async function removeBookFile(
  bookId: number,
  bookSlug: string,
  fileType: FileType
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const ext = fileType === "txt" ? "txt" : fileType === "epub" ? "epub" : "pdf";
  const path = `${FOLDER[fileType]}/${bookSlug}.${ext}`;

  const db = createAdminClient();

  await db.storage.from(BUCKET).remove([path]);

  await db
    .from("books")
    .update({ [COLUMN[fileType]]: null })
    .eq("id", bookId);

  revalidatePath(`/admin/books/${bookId}/upload`);

  return { success: true };
}
