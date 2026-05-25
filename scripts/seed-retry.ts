#!/usr/bin/env tsx
/**
 * scripts/seed-retry.ts
 * Повторная загрузка книг, которые не удалось загрузить в seed-books.ts
 * Использует прямые URL Gutenberg как запасной вариант
 */

import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Исправленные/дополнительные Gutenberg IDs для книг, у которых не нашлись тексты
const RETRY_MAP: Record<string, number> = {
  // Исправленные ID
  "dvoryanskoe-gnezdo": 6760,   // "A House of Gentlefolk" by Turgenev
  "rudin": 6759,                // "Rudin" by Turgenev (separate book)
  "kazaki": 1898,               // The Cossacks — try direct download
  "kreutzer-sonata": 689,
  "ledi-makbet-mcenskogo": 17078,
  "macbeth": 1533,
  "madame-bovary": 2413,
  "mansfield-park": 141,
  "mat-gorky": 12557,
  "sense-and-sensibility": 161,
  "wuthering-heights": 768,
  // Timeout retries
  "far-from-madding-crowd": 107,
  "hound-of-baskervilles": 2852,
  "les-miserables": 135,
  "maupassant-stories": 3090,
  "meditations": 2680,
  "michael-strogoff": 1848,
  "middlemarch": 145,
  "moby-dick": 2701,
  "mysterious-island": 1268,
  "na-dne": 13836,
  "northanger-abbey": 121,
  "notre-dame-de-paris": 2333,
  "origin-of-species": 1228,
  "palata-6": 1823,
  "pere-goriot": 1237,
  "pervaya-lyubov": 14813,
  "poor-richard": 73742,
  "pride-and-prejudice": 1342,
  "pushing-to-the-front": 11840,
  "queen-margot": 2759,
  "science-of-being-great": 4053,
  "werther": 2527,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function tryDownload(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    try {
      console.log(`    Trying: ${url}`);
      const res = await fetch(url, {
        headers: { "User-Agent": "Folio-Library/1.0 (educational)" },
        signal: AbortSignal.timeout(120000),
      });
      if (!res.ok) { console.log(`    HTTP ${res.status}`); continue; }
      const text = await res.text();
      if (text && text.length > 3000) return text;
      console.log(`    Too short: ${text.length} chars`);
    } catch (e: any) {
      console.log(`    Error: ${e.message}`);
    }
  }
  return null;
}

async function getGutenbergUrls(id: number): Promise<string[]> {
  const urls: string[] = [];

  // Try gutendex first
  try {
    const res = await fetch(`https://gutendex.com/books/?ids=${id}`, {
      headers: { "User-Agent": "Folio-Library/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      const book = data.results?.[0];
      if (book) {
        const formats = book.formats as Record<string, string>;
        const textUrl =
          formats["text/plain; charset=utf-8"] ??
          formats["text/plain; charset=us-ascii"] ??
          formats["text/plain"];
        if (textUrl) urls.push(textUrl);
      }
    }
  } catch {}

  // Direct Gutenberg URLs as fallback
  urls.push(`https://www.gutenberg.org/files/${id}/${id}-0.txt`);
  urls.push(`https://www.gutenberg.org/files/${id}/${id}.txt`);
  urls.push(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);

  return urls;
}

function cleanGutenbergText(raw: string): string {
  let text = raw.replace(/^﻿/, "");
  const startRe = /\*{3}\s*START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/i;
  const startMatch = startRe.exec(text);
  if (startMatch) text = text.slice(startMatch.index + startMatch[0].length);
  const endRe = /\*{3}\s*END OF (THE|THIS) PROJECT GUTENBERG[^\n]*/i;
  const endMatch = endRe.exec(text);
  if (endMatch) text = text.slice(0, endMatch.index);
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/\n{4,}/g, "\n\n\n");
  return text.trim();
}

function textToHtml(text: string, title: string): string {
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter((p) => p.length > 0)
    .map((p) => {
      if (p.length < 80 && /^(chapter|part|book|section|глава|часть|книга)\b/i.test(p))
        return `<h2>${esc(p)}</h2>`;
      return `<p>${esc(p)}</p>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head><meta charset="utf-8"/><title>${esc(title)}</title>
<style>body{font-family:serif;line-height:1.7;margin:1em 2em}h2{margin-top:2em}p{text-indent:1.5em;margin:.2em 0}</style>
</head>
<body><h1>${esc(title)}</h1>
${paras}
</body>
</html>`;
}

async function buildEpub(text: string, slug: string, title: string): Promise<Buffer> {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml",
    `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
  zip.file("OEBPS/content.opf",
    `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">folio-${slug}</dc:identifier><dc:title>${esc(title)}</dc:title><dc:language>en</dc:language></metadata><manifest><item id="c" href="content.html" media-type="application/xhtml+xml"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/></manifest><spine toc="ncx"><itemref idref="c"/></spine></package>`);
  zip.file("OEBPS/toc.ncx",
    `<?xml version="1.0" encoding="utf-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="folio-${slug}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${esc(title)}</text></docTitle><navMap><navPoint id="np1" playOrder="1"><navLabel><text>${esc(title)}</text></navLabel><content src="content.html"/></navPoint></navMap></ncx>`);
  zip.file("OEBPS/content.html", textToHtml(text, title));
  return await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

async function uploadFile(buf: Buffer, path: string, mime: string): Promise<string | null> {
  const { error } = await supabase.storage.from("book-files").upload(path, buf, {
    contentType: mime,
    upsert: true,
  });
  if (error) { console.error(`    ✗ storage: ${error.message}`); return null; }
  return supabase.storage.from("book-files").getPublicUrl(path).data.publicUrl;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔄 Folio — повторная загрузка неудачных книг\n");

  const slugs = Object.keys(RETRY_MAP);
  const { data: books, error } = await supabase
    .from("books")
    .select("id, slug, title, title_ru, language, txt_url")
    .in("slug", slugs);

  if (error || !books) {
    console.error("Supabase error:", error?.message);
    process.exit(1);
  }

  // Filter only books still missing txt_url
  const todo = books.filter((b) => !b.txt_url);
  console.log(`Книг для повторной попытки: ${todo.length}\n`);

  const ok: string[] = [];
  const fail: Array<{ slug: string; reason: string }> = [];

  for (let i = 0; i < todo.length; i++) {
    const book = todo[i];
    const gutId = RETRY_MAP[book.slug];
    process.stdout.write(`[${i + 1}/${todo.length}] ${book.slug} (Gutenberg #${gutId})… `);

    const urls = await getGutenbergUrls(gutId);
    const raw = await tryDownload(urls);

    if (!raw) {
      console.log("❌ Не удалось скачать");
      fail.push({ slug: book.slug, reason: "все URL не сработали" });
      continue;
    }

    const text = cleanGutenbergText(raw);
    if (text.length < 3000) {
      console.log(`❌ Текст слишком короткий (${text.length} символов)`);
      fail.push({ slug: book.slug, reason: `текст ${text.length} символов` });
      continue;
    }

    const words = text.split(/\s+/).length;
    console.log(`${words.toLocaleString()} слов`);

    const title = book.title_ru ?? book.title;

    const txtUrl = await uploadFile(Buffer.from(text, "utf-8"), `${book.slug}/${book.slug}.txt`, "text/plain");
    if (!txtUrl) { fail.push({ slug: book.slug, reason: "ошибка TXT upload" }); continue; }

    const epubBuf = await buildEpub(text, book.slug, title);
    const epubUrl = await uploadFile(epubBuf, `${book.slug}/${book.slug}.epub`, "application/epub+zip");

    const upd: Record<string, string> = { txt_url: txtUrl };
    if (epubUrl) upd.epub_url = epubUrl;
    const { error: dbErr } = await supabase.from("books").update(upd).eq("id", book.id);
    if (dbErr) { fail.push({ slug: book.slug, reason: dbErr.message }); continue; }

    console.log(`    ✅ TXT${epubUrl ? " + EPUB" : ""} загружены`);
    ok.push(book.slug);
    await new Promise((r) => setTimeout(r, 1000));
  }

  const div = "═".repeat(56);
  console.log(`\n${div}`);
  console.log("📊  РЕЗУЛЬТАТ ПОВТОРНОЙ ЗАГРУЗКИ");
  console.log(div);

  if (ok.length) {
    console.log(`\n✅  ЗАГРУЖЕНО (${ok.length}):`);
    ok.forEach((s) => console.log(`   • ${s}`));
  }
  if (fail.length) {
    console.log(`\n❌  НЕ УДАЛОСЬ (${fail.length}):`);
    fail.forEach(({ slug, reason }) => console.log(`   • ${slug}: ${reason}`));
  }

  console.log(`\n${div}`);
  console.log(`Итого: ✅ ${ok.length} загружено  |  ❌ ${fail.length} не удалось`);
  console.log(`${div}\n`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
