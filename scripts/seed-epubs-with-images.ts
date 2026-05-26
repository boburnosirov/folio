#!/usr/bin/env tsx
/**
 * scripts/seed-epubs-with-images.ts
 *
 * Скачивает оригинальные EPUB файлы с иллюстрациями с Project Gutenberg
 * для всех публичных книг с gutenberg_id и обновляет epub_url в БД.
 *
 * Gutenberg предоставляет несколько форматов EPUB:
 *   - .epub3.images          — EPUB3 со всеми иллюстрациями (приоритет)
 *   - .epub.images           — EPUB2 со всеми иллюстрациями (fallback)
 *   - cache/.../pg{id}-images.epub  — кеш-версия с картинками
 *
 * Без флага «-images» Gutenberg отдаёт EPUB без рисунков (только текст).
 *
 * Запуск: npm run seed:epubs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UA = "Folio-Library/1.0 (educational; +https://folio-ten-ashy.vercel.app)";

interface BookRow {
  id: number;
  slug: string;
  title: string;
  title_ru: string | null;
  gutenberg_id: number;
  epub_url: string | null;
}

async function downloadEpubWithImages(gid: number): Promise<{ buf: Buffer; hasImages: boolean } | null> {
  // Try in order of preference
  const candidates = [
    `https://www.gutenberg.org/ebooks/${gid}.epub3.images`,
    `https://www.gutenberg.org/cache/epub/${gid}/pg${gid}-images-3.epub`,
    `https://www.gutenberg.org/ebooks/${gid}.epub.images`,
    `https://www.gutenberg.org/cache/epub/${gid}/pg${gid}-images.epub`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/epub+zip,*/*" },
        signal: AbortSignal.timeout(180_000),
        redirect: "follow",
      });

      if (!res.ok) {
        // Skip silently — try next
        continue;
      }

      const ct = res.headers.get("content-type") ?? "";
      const buf = Buffer.from(await res.arrayBuffer());

      // Sanity: EPUB ZIP magic = "PK\x03\x04"; size > 5KB (real EPUB)
      if (buf.length < 5000) continue;
      if (buf[0] !== 0x50 || buf[1] !== 0x4B) continue;
      if (ct.includes("html")) continue; // got an HTML 404 page

      // Heuristic: if a buffer is > 200KB it likely contains real images
      // (text-only EPUBs are usually 30-150KB)
      const hasImages = buf.length > 200_000;

      console.log(`    ✓ ${url.split("/").slice(-2).join("/")}  (${(buf.length/1024).toFixed(0)} KB${hasImages ? ", вероятно с картинками" : ""})`);
      return { buf, hasImages };
    } catch (e: any) {
      // network/timeout — try next URL
    }
  }
  return null;
}

async function uploadEpub(slug: string, buf: Buffer): Promise<string | null> {
  const path = `epubs/${slug}.epub`;
  const { error } = await supabase.storage.from("book-files").upload(path, buf, {
    contentType: "application/epub+zip",
    upsert: true,
  });
  if (error) {
    console.log(`    ✗ storage: ${error.message}`);
    return null;
  }
  return supabase.storage.from("book-files").getPublicUrl(path).data.publicUrl;
}

/** Returns size of existing supabase EPUB or 0 if not present/error */
async function existingEpubSize(epubUrl: string | null): Promise<number> {
  if (!epubUrl) return 0;
  try {
    const res = await fetch(epubUrl, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return 0;
    const len = parseInt(res.headers.get("content-length") ?? "0", 10);
    return isNaN(len) ? 0 : len;
  } catch { return 0; }
}

async function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("\n📚 Folio — загрузка EPUB с иллюстрациями с Project Gutenberg\n");

  const { data, error } = await supabase
    .from("books")
    .select("id, slug, title, title_ru, gutenberg_id, epub_url, language")
    .eq("is_public", true)
    .not("gutenberg_id", "is", null)
    .order("language")
    .order("slug");

  if (error || !data) { console.error("Supabase:", error?.message); process.exit(1); }

  const books = data as Array<BookRow & { language: string }>;
  console.log(`Найдено ${books.length} книг с gutenberg_id\n`);

  const ok: string[] = [];
  const skip: string[] = [];
  const fail: Array<{ slug: string; reason: string }> = [];
  let withImages = 0;
  let textOnly = 0;

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const title = b.title_ru ?? b.title;
    console.log(`[${i+1}/${books.length}] ${b.slug} (#${b.gutenberg_id}) — «${title}»`);

    // Skip if Supabase already has a "fat" EPUB (>200KB suggests illustrations included)
    const existingSize = await existingEpubSize(b.epub_url);
    if (existingSize > 200_000 && b.epub_url?.includes("supabase")) {
      console.log(`    ⏭  уже загружен (${(existingSize/1024).toFixed(0)} KB)`);
      skip.push(b.slug);
      continue;
    }

    try {
      const dl = await downloadEpubWithImages(b.gutenberg_id);
      if (!dl) {
        console.log(`    ❌ Gutenberg не отдал EPUB с картинками`);
        fail.push({ slug: b.slug, reason: "Gutenberg отказал" });
        await delay(500);
        continue;
      }

      const url = await uploadEpub(b.slug, dl.buf);
      if (!url) {
        fail.push({ slug: b.slug, reason: "ошибка Supabase upload" });
        await delay(500);
        continue;
      }

      const { error: updErr } = await supabase
        .from("books")
        .update({ epub_url: url })
        .eq("id", b.id);

      if (updErr) {
        fail.push({ slug: b.slug, reason: updErr.message });
        await delay(500);
        continue;
      }

      ok.push(b.slug);
      if (dl.hasImages) withImages++; else textOnly++;

      // Throttle: Gutenberg is sensitive to scraping
      await delay(1200);
    } catch (e: any) {
      console.log(`    ❌ ${e.message}`);
      fail.push({ slug: b.slug, reason: e.message });
      await delay(800);
    }
  }

  const div = "═".repeat(60);
  console.log(`\n${div}`);
  console.log("📊 РЕЗУЛЬТАТ");
  console.log(div);
  console.log(`\n✅  EPUB обновлено: ${ok.length}`);
  console.log(`     • с картинками (>200KB): ${withImages}`);
  console.log(`     • только текст:          ${textOnly}`);
  if (skip.length) console.log(`\n⏭  Пропущено: ${skip.length}`);
  if (fail.length) {
    console.log(`\n❌  Не удалось (${fail.length}):`);
    fail.forEach(({ slug, reason }) => console.log(`   • ${slug}: ${reason}`));
  }
  console.log(`\n${div}\n`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
