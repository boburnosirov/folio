import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://folio-ten-ashy.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: books } = await supabase
    .from("books")
    .select("slug, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const bookUrls: MetadataRoute.Sitemap = (books ?? []).map((book) => ({
    url: `${BASE_URL}/books/${book.slug}`,
    lastModified: book.created_at ? new Date(book.created_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticPages, ...bookUrls];
}
