#!/usr/bin/env tsx
/**
 * scripts/seed-books.ts
 *
 * Downloads public domain texts from Project Gutenberg, generates TXT + EPUB,
 * uploads both to Supabase Storage, and updates book records.
 *
 * Run: npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Gutenberg ID map ─────────────────────────────────────────────────────────
// slug → Gutenberg numeric ID
// Russian-original books (Tolstoy, Dostoevsky…) use their English translations
// from Gutenberg since clean Russian UTF-8 texts are not on Gutenberg.

const GUTENBERG: Record<string, number> = {
  // ── Jane Austen ──────────────────────────────────────────────────────────
  "pride-and-prejudice": 1342,
  "sense-and-sensibility": 161,
  "emma": 158,
  "northanger-abbey": 121,
  "persuasion": 105,
  "mansfield-park": 141,

  // ── Charles Dickens ──────────────────────────────────────────────────────
  "oliver-twist": 730,
  "david-copperfield": 766,
  "great-expectations": 1400,
  "a-tale-of-two-cities": 98,
  "a-christmas-carol": 46,
  "bleak-house": 1023,
  "pickwick-papers": 580,

  // ── Shakespeare ──────────────────────────────────────────────────────────
  "hamlet": 1524,
  "romeo-and-juliet": 1513,
  "macbeth": 1533,
  "othello": 1531,
  "king-lear": 1532,
  "midsummer-night": 1514,
  "merchant-of-venice": 2243,
  "tempest": 23042,

  // ── Arthur Conan Doyle ───────────────────────────────────────────────────
  "sherlock-holmes-adventures": 1661,
  "hound-of-baskervilles": 2852,
  "study-in-scarlet": 244,
  "sign-of-four": 2097,
  "memoirs-of-sherlock-holmes": 834,

  // ── Brontë sisters ───────────────────────────────────────────────────────
  "jane-eyre": 1260,
  "shirley": 30486,
  "wuthering-heights": 768,
  "tenant-of-wildfell-hall": 969,

  // ── Hardy / Eliot ────────────────────────────────────────────────────────
  "tess-of-the-durbervilles": 110,
  "far-from-madding-crowd": 107,
  "middlemarch": 145,
  "mill-on-the-floss": 6688,

  // ── Wilde / Stevenson / Collins / Thackeray ──────────────────────────────
  "dorian-gray": 174,
  "happy-prince-wilde": 902,
  "treasure-island": 120,
  "jekyll-and-hyde": 43,
  "woman-in-white": 583,
  "the-moonstone": 155,
  "vanity-fair": 599,

  // ── Defoe / Swift / American ─────────────────────────────────────────────
  "robinson-crusoe": 521,
  "moll-flanders": 370,
  "gullivers-travels": 829,
  "huckleberry-finn": 76,
  "tom-sawyer": 74,
  "connecticut-yankee": 86,

  // ── Jack London ──────────────────────────────────────────────────────────
  "call-of-the-wild": 215,
  "white-fang": 910,
  "sea-wolf": 1074,

  // ── Poe / Hawthorne / Melville ────────────────────────────────────────────
  "tales-of-mystery-poe": 2147,
  "scarlet-letter": 33,
  "moby-dick": 2701,

  // ── French / European ────────────────────────────────────────────────────
  "don-quixote": 996,
  "les-miserables": 135,
  "notre-dame-de-paris": 2333,
  "toilers-of-the-sea": 32338,
  "three-musketeers": 1257,
  "count-of-monte-cristo": 1184,
  "twenty-years-after": 1259,
  "queen-margot": 2759,
  "pere-goriot": 1237,
  "eugenie-grandet": 1608,
  "madame-bovary": 2413,
  "maupassant-stories": 3090,
  "quo-vadis": 2853,

  // ── Romance ──────────────────────────────────────────────────────────────
  "north-and-south": 4547,
  "agnes-grey": 767,
  "vicar-of-wakefield": 2667,
  "werther": 2527,

  // ── Philosophy ───────────────────────────────────────────────────────────
  "meditations": 2680,
  "seneca-letters": 2130,
  "seneca-shortness": 1740,
  "enchiridion": 45109,
  "discourses-epictetus": 4135,
  "republic-plato": 1497,
  "symposium-plato": 1600,
  "apology-plato": 1656,
  "nicomachean-ethics": 8438,
  "politics-aristotle": 6762,
  "montaigne-essays": 3600,
  "candide": 19942,
  "zarathustra": 1998,
  "beyond-good-and-evil": 4363,
  "genealogy-of-morality": 52319,
  "world-as-will": 38427,
  "art-of-war": 132,
  "divine-comedy": 8800,
  "the-prince": 1232,

  // ── Self-Development (public domain) ─────────────────────────────────────
  "self-help": 935,
  "character-smiles": 4897,
  "thrift-smiles": 14418,
  "duty-smiles": 14429,
  "science-of-getting-rich": 1541,
  "science-of-being-great": 4053,
  "pushing-to-the-front": 11840,
  "he-can-who-thinks-he-can": 21623,

  // ── Business (public domain) ─────────────────────────────────────────────
  "autobiography-franklin": 20203,
  "poor-richard": 73742,
  "emerson-essays": 2944,

  // ── Jules Verne & Darwin ─────────────────────────────────────────────────
  "around-the-world-80-days": 103,
  "20000-leagues": 164,
  "from-earth-to-moon": 83,
  "journey-to-center-of-earth": 3748,
  "mysterious-island": 1268,
  "michael-strogoff": 1848,
  "origin-of-species": 1228,
  "voyage-of-beagle": 944,
  "descent-of-man": 2300,

  // ── Russian Classics — English translations from Gutenberg ───────────────
  // Tolstoy
  "anna-karenina": 1399,
  "voyna-i-mir": 2600,
  "smert-ivana-ilyicha": 600,
  "voskreseniye": 1938,
  "kreutzer-sonata": 689,
  "detstvo-tolstoy": 2450,
  "kazaki": 1898,
  // Dostoevsky
  "prestuplenie-i-nakazanie": 2554,
  "idiot": 2668,
  "bratya-karamazovy": 28054,
  "besy": 8117,
  "zapiski-iz-podpolya": 600,
  "bednye-lyudi": 38043,
  "igrok": 2197,
  "belye-nochi": 36034,
  // Chekhov
  "vishnyovy-sad": 7986,
  "tri-sestry": 7986,
  "dyadya-vanya": 7986,
  "chayka": 7986,
  "palata-6": 1823,
  "dama-s-sobachkoy": 1823,
  "chekhov-rasskazy": 1823,
  // Gogol
  "mertvye-dushi": 1081,
  "revizor": 4717,
  "taras-bulba": 1705,
  "shinel": 1081,
  "vechera-na-khutore": 1081,
  // Pushkin
  "evgeniy-onegin": 23954,
  "pikovaya-dama": 31516,
  "kapitanskaya-dochka": 36034,
  "boris-godunov": 27500,
  // Turgenev
  "ottsy-i-deti": 30723,
  "pervaya-lyubov": 14813,
  "rudin": 21076,
  "dvoryanskoe-gnezdo": 21076,
  "mumu": 2570,
  // Others
  "oblomov": 23062,
  "geroy-nashego-vremeni": 913,
  "demon-lermontov": 913,
  "mat-gorky": 12557,
  "na-dne": 13836,
  "ocharovanny-strannik": 14499,
  "ledi-makbet-mcenskogo": 17078,
  "poedinok-kuprin": 14931,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Book {
  id: number;
  slug: string;
  title: string;
  title_ru: string | null;
  language: string;
  txt_url: string | null;
  epub_url: string | null;
}

interface UploadResult {
  slug: string;
  title: string;
  status: "uploaded" | "skipped" | "error";
  reason?: string;
  gutenbergId?: number;
}

// ─── Gutendex lookup ──────────────────────────────────────────────────────────

async function getGutenbergTextUrl(id: number): Promise<string | null> {
  try {
    const res = await fetch(`https://gutendex.com/books/?ids=${id}`, {
      headers: { "User-Agent": "Folio-Library/1.0 (educational)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as any;
    const book = data.results?.[0];
    if (!book) return null;
    const formats = book.formats as Record<string, string>;
    return (
      formats["text/plain; charset=utf-8"] ??
      formats["text/plain; charset=us-ascii"] ??
      formats["text/plain"] ??
      null
    );
  } catch {
    return null;
  }
}

// ─── Text download ────────────────────────────────────────────────────────────

async function downloadText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Folio-Library/1.0 (educational)" },
      signal: AbortSignal.timeout(90000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function cleanGutenbergText(raw: string): string {
  let text = raw.replace(/^﻿/, ""); // strip BOM

  // Strip header (everything up to and including the START marker line)
  const startRe = /\*{3}\s*START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/i;
  const startMatch = startRe.exec(text);
  if (startMatch) {
    text = text.slice(startMatch.index + startMatch[0].length);
  }

  // Strip footer
  const endRe = /\*{3}\s*END OF (THE|THIS) PROJECT GUTENBERG[^\n]*/i;
  const endMatch = endRe.exec(text);
  if (endMatch) {
    text = text.slice(0, endMatch.index);
  }

  // Normalize line endings, collapse 3+ blank lines to 2
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/\n{4,}/g, "\n\n\n");

  return text.trim();
}

// ─── EPUB builder ─────────────────────────────────────────────────────────────

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function textToHtml(text: string, title: string): string {
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter((p) => p.length > 0)
    .map((p) => {
      if (p.length < 80 && /^(chapter|part|book|section|глава|часть|книга)\b/i.test(p)) {
        return `<h2>${esc(p)}</h2>`;
      }
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

// ─── Supabase upload ──────────────────────────────────────────────────────────

async function uploadFile(buf: Buffer, path: string, mime: string): Promise<string | null> {
  const { error } = await supabase.storage.from("book-files").upload(path, buf, {
    contentType: mime,
    upsert: true,
  });
  if (error) {
    console.error(`    ✗ storage error (${path}):`, error.message);
    return null;
  }
  return supabase.storage.from("book-files").getPublicUrl(path).data.publicUrl;
}

// ─── Process one book ─────────────────────────────────────────────────────────

async function processBook(book: Book): Promise<UploadResult> {
  const base: UploadResult = { slug: book.slug, title: book.title_ru ?? book.title, status: "skipped" };

  const gutId = GUTENBERG[book.slug];
  if (!gutId) return { ...base, reason: "нет в Gutenberg (современная/защищённая)" };

  base.gutenbergId = gutId;

  if (book.txt_url) return { ...base, reason: "уже загружено" };

  console.log(`  ↓ ${book.slug} (Gutenberg #${gutId})…`);

  const textUrl = await getGutenbergTextUrl(gutId);
  if (!textUrl) return { ...base, status: "error", reason: "файл не найден на Gutendex" };

  const raw = await downloadText(textUrl);
  if (!raw || raw.length < 3000) return { ...base, status: "error", reason: "текст пустой или недоступен" };

  const text = cleanGutenbergText(raw);
  if (text.length < 3000) return { ...base, status: "error", reason: "текст после очистки слишком короткий" };

  const words = text.split(/\s+/).length;
  console.log(`    ${words.toLocaleString()} слов`);

  const txtUrl = await uploadFile(Buffer.from(text, "utf-8"), `${book.slug}/${book.slug}.txt`, "text/plain");
  if (!txtUrl) return { ...base, status: "error", reason: "ошибка загрузки TXT" };

  const epubBuf = await buildEpub(text, book.slug, book.title_ru ?? book.title);
  const epubUrl = await uploadFile(epubBuf, `${book.slug}/${book.slug}.epub`, "application/epub+zip");

  const upd: Record<string, string> = { txt_url: txtUrl };
  if (epubUrl) upd.epub_url = epubUrl;

  const { error: dbErr } = await supabase.from("books").update(upd).eq("id", book.id);
  if (dbErr) return { ...base, status: "error", reason: `DB: ${dbErr.message}` };

  console.log(`    ✅ TXT${epubUrl ? " + EPUB" : ""} загружены`);
  return { ...base, status: "uploaded" };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n📚 Folio — загрузка текстов книг\n");

  const { data: books, error } = await supabase
    .from("books")
    .select("id, slug, title, title_ru, language, txt_url, epub_url")
    .eq("is_public", true)
    .order("slug");

  if (error || !books) {
    console.error("Ошибка подключения к Supabase:", error?.message);
    process.exit(1);
  }

  console.log(`Книг в базе: ${books.length}`);
  console.log(`Книг с Gutenberg ID: ${books.filter((b) => GUTENBERG[b.slug]).length}`);
  console.log(`Уже загружено: ${books.filter((b) => b.txt_url).length}\n`);

  const results: UploadResult[] = [];
  let n = 0;
  const total = books.length;

  for (const book of books as Book[]) {
    n++;
    if (GUTENBERG[book.slug] && !book.txt_url) {
      process.stdout.write(`[${n}/${total}] `);
    }
    const r = await processBook(book);
    results.push(r);
    if (r.status === "uploaded") await new Promise((res) => setTimeout(res, 1200));
  }

  // ── Report ────────────────────────────────────────────────────────────────
  const uploaded = results.filter((r) => r.status === "uploaded");
  const errors = results.filter((r) => r.status === "error");
  const alreadyDone = results.filter((r) => r.status === "skipped" && r.reason === "уже загружено");
  const noPD = results.filter((r) => r.status === "skipped" && r.reason?.includes("современная"));

  const div = "═".repeat(62);
  console.log(`\n${div}`);
  console.log("📊  РЕЗУЛЬТАТ ЗАГРУЗКИ");
  console.log(div);

  if (uploaded.length) {
    console.log(`\n✅  ЗАГРУЖЕНО (${uploaded.length} книг):`);
    uploaded.forEach((r) => console.log(`   • ${r.slug}  —  «${r.title}»  (Gutenberg #${r.gutenbergId})`));
  }

  if (alreadyDone.length) {
    console.log(`\n⏭️   УЖЕ БЫЛО ЗАГРУЖЕНО (${alreadyDone.length} книг):`);
    alreadyDone.forEach((r) => console.log(`   • ${r.slug}`));
  }

  if (errors.length) {
    console.log(`\n❌  ОШИБКИ (${errors.length} книг):`);
    errors.forEach((r) => console.log(`   • ${r.slug}: ${r.reason}`));
  }

  if (noPD.length) {
    console.log(`\n🔒  ПРОПУЩЕНО — авторские права (${noPD.length} книг):`);
    noPD.slice(0, 20).forEach((r) => console.log(`   • ${r.slug}`));
    if (noPD.length > 20) console.log(`   … и ещё ${noPD.length - 20}`);
  }

  // Which Russian books got EN translations only
  const ruWithEN = uploaded.filter((r) => {
    const b = books.find((x) => x.slug === r.slug);
    return b?.language === "ru";
  });
  if (ruWithEN.length) {
    console.log(`\n⚠️   РУССКИЕ КНИГИ — загружен АНГЛИЙСКИЙ перевод (нужен RU текст):`);
    ruWithEN.forEach((r) => console.log(`   • ${r.slug}`));
    console.log(`   → Загрузите оригинальный русский текст вручную через /admin/books/[id]/upload`);
  }

  console.log(`\n${div}`);
  console.log(
    `Итого: ✅ ${uploaded.length} загружено  |  ❌ ${errors.length} ошибок  |  ` +
    `⏭️ ${alreadyDone.length} уже было  |  🔒 ${noPD.length} авт. права`
  );
  console.log(`${div}\n`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
