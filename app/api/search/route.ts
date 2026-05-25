import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const revalidate = 30; // 30s edge cache

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  // Try fast SQL RPC search first (already used in /catalog)
  const rpc = await supabase
    .rpc("search_books", { query: q })
    .select("slug, title, title_ru, cover_url, language, authors!inner(name, name_ru)")
    .limit(8);

  let results = rpc.data;

  if (!results || results.length === 0) {
    // Fallback to ilike
    const fb = await supabase
      .from("books")
      .select("slug, title, title_ru, cover_url, language, authors(name, name_ru)")
      .eq("is_public", true)
      .or(`title.ilike.%${q}%,title_ru.ilike.%${q}%`)
      .limit(8);
    results = fb.data ?? [];
  }

  const shaped = (results ?? []).map((b: any) => ({
    slug: b.slug,
    title: b.title,
    title_ru: b.title_ru,
    cover_url: b.cover_url,
    language: b.language,
    author: b.authors?.name_ru ?? b.authors?.name ?? null,
  }));

  return NextResponse.json(
    { results: shaped },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300" } }
  );
}
