#!/usr/bin/env tsx
/**
 * scripts/seed-ru.ts — v4
 * Загружает РУССКИЕ ОРИГИНАЛЬНЫЕ тексты из:
 *   1. ru.wikisource.org  (с поддержкой редиректов и подстраниц)
 *   2. lib.ru / az.lib.ru (http, через curl — node fetch не работает со старым HTTP/1.1)
 *
 * Запуск: npm run seed:ru
 */

import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── ИСТОЧНИКИ ───────────────────────────────────────────────────────────────
// ws  = Wikisource заголовок (с автоматическим следованием #REDIRECT)
// lib = URL(s) на az.lib.ru  ** ТОЛЬКО http:// **  (одна или несколько частей)
interface Source {
  title: string;
  ws?: string;
  lib?: string | string[];  // string[] для многотомных произведений
}

const TOLSTOY  = "http://az.lib.ru/t/tolstoj_lew_nikolaewich";
const DOST     = "http://az.lib.ru/d/dostoewskij_f_m";
const CHEK     = "http://az.lib.ru/c/chehow_a_p";
const GOGOL    = "http://az.lib.ru/g/gogolx_n_w";
const PUSH     = "http://az.lib.ru/p/pushkin_a_s";
const TURG     = "http://az.lib.ru/t/turgenew_i_s";
const LERM     = "http://az.lib.ru/l/lermontow_m_j";
const LESK     = "http://az.lib.ru/l/leskow_n_s";
const GONCH    = "http://az.lib.ru/g/goncharow_i_a";
const KUPRIN   = "http://az.lib.ru/k/kuprin_a_i";
const GORKY    = "http://az.lib.ru/g/gorxkij_m";

const SOURCES: Record<string, Source> = {
  // ── Толстой ──────────────────────────────────────────────────────────────
  "anna-karenina": {
    title: "Анна Каренина",
    ws: "Анна Каренина (Толстой)",
    lib: `${TOLSTOY}/text_0080.shtml`,
  },
  "voyna-i-mir": {
    title: "Война и мир",
    ws: "Война и мир (Толстой)",
    lib: [
      `${TOLSTOY}/text_0040.shtml`,
      `${TOLSTOY}/text_0050.shtml`,
      `${TOLSTOY}/text_0060.shtml`,
      `${TOLSTOY}/text_0070.shtml`,
    ],
  },
  "smert-ivana-ilyicha": {
    title: "Смерть Ивана Ильича",
    ws: "Смерть Ивана Ильича",
    lib: `${TOLSTOY}/text_0136.shtml`,
  },
  "voskreseniye": {
    title: "Воскресение",
    ws: "Воскресение (Толстой)",
    lib: `${TOLSTOY}/text_0090.shtml`,
  },
  "kreutzer-sonata": {
    title: "Крейцерова соната",
    ws: "Крейцерова соната",
    lib: `${TOLSTOY}/text_0240.shtml`,
  },
  "detstvo-tolstoy": {
    title: "Детство",
    ws: "Детство (Толстой)",
    lib: `${TOLSTOY}/text_0010.shtml`,
  },
  "kazaki": {
    title: "Казаки",
    ws: "Казаки (Толстой)",
    lib: `${TOLSTOY}/text_0160.shtml`,
  },

  // ── Достоевский ──────────────────────────────────────────────────────────
  "prestuplenie-i-nakazanie": {
    title: "Преступление и наказание",
    ws: "Преступление и наказание (Достоевский)",
    lib: `${DOST}/text_0060.shtml`,
  },
  "idiot": {
    title: "Идиот",
    ws: "Идиот (Достоевский)",
    lib: `${DOST}/text_0070.shtml`,
  },
  "bratya-karamazovy": {
    title: "Братья Карамазовы",
    ws: "Братья Карамазовы",
    lib: [
      `${DOST}/text_0100.shtml`,
      `${DOST}/text_0110.shtml`,
      `${DOST}/text_0120.shtml`,
      `${DOST}/text_0130.shtml`,
    ],
  },
  "besy": {
    title: "Бесы",
    ws: "Бесы (Достоевский)",
    lib: `${DOST}/text_0080.shtml`,
  },
  "zapiski-iz-podpolya": {
    title: "Записки из подполья",
    ws: "Записки из подполья",
    lib: `${DOST}/text_0290.shtml`,
  },
  "bednye-lyudi": {
    title: "Бедные люди",
    ws: "Бедные люди",
    lib: `${DOST}/text_0010.shtml`,
  },
  "igrok": {
    title: "Игрок",
    ws: "Игрок (Достоевский)",
    lib: `${DOST}/text_0050.shtml`,
  },
  "belye-nochi": {
    title: "Белые ночи",
    ws: "Белые ночи (Достоевский)",
    lib: `${DOST}/text_0230.shtml`,
  },

  // ── Чехов ─────────────────────────────────────────────────────────────────
  "vishnyovy-sad": {
    title: "Вишнёвый сад",
    ws: "Вишнёвый сад",
    lib: `${CHEK}/text_0150.shtml`,
  },
  "tri-sestry": {
    title: "Три сестры",
    ws: "Три сестры (Чехов)",
    lib: `${CHEK}/text_0140.shtml`,
  },
  "dyadya-vanya": {
    title: "Дядя Ваня",
    ws: "Дядя Ваня",
    lib: `${CHEK}/text_0130.shtml`,
  },
  "chayka": {
    title: "Чайка",
    ws: "Чайка (Чехов)",
    lib: `${CHEK}/text_0120.shtml`,
  },
  "palata-6": {
    title: "Палата № 6",
    ws: "Палата № 6",
    lib: `${CHEK}/text_1892_palata.shtml`,
  },
  "dama-s-sobachkoy": {
    title: "Дама с собачкой",
    ws: "Дама с собачкой",
    lib: `${CHEK}/text_0100.shtml`,   // Рассказы 1898–1903 (содержит Даму с собачкой)
  },
  "chekhov-rasskazy": {
    title: "Рассказы",
    ws: "Скучная история",
    lib: `${CHEK}/text_0080.shtml`,   // Рассказы 1892–1894
  },

  // ── Гоголь ────────────────────────────────────────────────────────────────
  "mertvye-dushi": {
    title: "Мёртвые души",
    ws: "Мёртвые души (Гоголь)",
    lib: [
      `${GOGOL}/text_0140.shtml`,
      `${GOGOL}/text_0150.shtml`,
    ],
  },
  "revizor": {
    title: "Ревизор",
    ws: "Ревизор (Гоголь)",
    lib: `${GOGOL}/text_0070.shtml`,
  },
  "taras-bulba": {
    title: "Тарас Бульба",
    ws: "Тарас Бульба",
    lib: `${GOGOL}/text_0040.shtml`,
  },
  "shinel": {
    title: "Шинель",
    ws: "Шинель (Гоголь)",
    lib: `${GOGOL}/text_0120.shtml`,
  },
  "vechera-na-khutore": {
    title: "Вечера на хуторе близ Диканьки",
    ws: "Вечера на хуторе близ Диканьки",
    lib: [
      `${GOGOL}/text_0010.shtml`,
      `${GOGOL}/text_0020.shtml`,
    ],
  },

  // ── Пушкин ────────────────────────────────────────────────────────────────
  "evgeniy-onegin": {
    title: "Евгений Онегин",
    ws: "Евгений Онегин",
    lib: `${PUSH}/text_0170.shtml`,
  },
  "pikovaya-dama": {
    title: "Пиковая дама",
    ws: "Пиковая дама",
    lib: `${PUSH}/text_0426.shtml`,
  },
  "kapitanskaya-dochka": {
    title: "Капитанская дочка",
    ws: "Капитанская дочка",
    lib: `${PUSH}/text_0430.shtml`,
  },
  "boris-godunov": {
    title: "Борис Годунов",
    ws: "Борис Годунов (Пушкин)",
    lib: `${PUSH}/text_0110.shtml`,
  },

  // ── Тургенев ─────────────────────────────────────────────────────────────
  "ottsy-i-deti": {
    title: "Отцы и дети",
    ws: "Отцы и дети (Тургенев)",
    lib: `${TURG}/text_0040.shtml`,
  },
  "pervaya-lyubov": {
    title: "Первая любовь",
    ws: "Первая любовь (Тургенев)",
    lib: `${TURG}/text_0120.shtml`,
  },
  "rudin": {
    title: "Рудин",
    ws: "Рудин",
    lib: `${TURG}/text_0010.shtml`,
  },
  "dvoryanskoe-gnezdo": {
    title: "Дворянское гнездо",
    ws: "Дворянское гнездо",
    lib: `${TURG}/text_0020.shtml`,
  },
  "mumu": {
    title: "Муму",
    ws: "Муму",
    lib: `${TURG}/text_0070.shtml`,
  },

  // ── Гончаров ──────────────────────────────────────────────────────────────
  "oblomov": {
    title: "Обломов",
    ws: "Обломов",
    lib: `${GONCH}/text_0020.shtml`,
  },

  // ── Лермонтов ─────────────────────────────────────────────────────────────
  "geroy-nashego-vremeni": {
    title: "Герой нашего времени",
    ws: "Герой нашего времени",
    lib: `${LERM}/text_0410.shtml`,
  },
  "demon-lermontov": {
    title: "Демон",
    ws: "Демон (Лермонтов)",
    lib: `${LERM}/text_0160.shtml`,   // early edition, Wikisource preferred
  },

  // ── Горький ───────────────────────────────────────────────────────────────
  "mat-gorky": {
    title: "Мать",
    ws: "Мать (Горький)",
    lib: `${GORKY}/text_0003.shtml`,
  },
  "na-dne": {
    title: "На дне",
    ws: "На дне",
    lib: `${GORKY}/text_0180.shtml`,
  },

  // ── Лесков ────────────────────────────────────────────────────────────────
  "ocharovanny-strannik": {
    title: "Очарованный странник",
    ws: "Очарованный странник",
    lib: `${LESK}/text_0029.shtml`,
  },
  "ledi-makbet-mcenskogo": {
    title: "Леди Макбет Мценского уезда",
    ws: "Леди Макбет Мценского уезда",
    lib: `${LESK}/text_0023.shtml`,
  },

  // ── Куприн ────────────────────────────────────────────────────────────────
  "poedinok-kuprin": {
    title: "Поединок",
    ws: "Поединок (Куприн)",
    lib: `${KUPRIN}/text_0150.shtml`,
  },
};

// ─── LIB.RU через curl ────────────────────────────────────────────────────────

const CURL = process.platform === "win32" ? "curl.exe" : "curl";

function downloadWithCurl(url: string): Buffer | null {
  const tmp = path.join(os.tmpdir(), `libru_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
  try {
    execFileSync(CURL, [
      "--silent",
      "--max-time", "90",
      "--location",              // follow HTTP redirects
      "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "-H", "Accept-Language: ru-RU,ru;q=0.9",
      "-o", tmp,
      url,
    ], { stdio: ["ignore", "ignore", "ignore"], timeout: 100_000 });
    if (!fs.existsSync(tmp)) return null;
    const buf = fs.readFileSync(tmp);
    return buf.length > 1000 ? buf : null;
  } catch {
    return null;
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

function decodeLibruHtml(buf: Buffer): string {
  // lib.ru ALWAYS uses Windows-1251 — decode directly, no charset detection needed
  // (charset detection from buf.toString("utf-8") fails because lib.ru often omits meta charset)
  let html = new TextDecoder("windows-1251").decode(buf);

  // ── Extract only the book text: between 2nd and 3rd <hr> ─────────────────
  // lib.ru page structure (4 <hr> total):
  //  HR1: after title/nav | metadata block | HR2: "Собственно произведение"
  //  BOOK TEXT | HR3: footer start | footer | HR4: page end
  const hrRe = /<hr[\s>][^>]*/gi;
  const hrMatches: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = hrRe.exec(html)) !== null) hrMatches.push(m.index);

  if (hrMatches.length >= 3) {
    // Start after 2nd HR, end before 3rd HR from the end
    const startHR = hrMatches[1];
    const endHR = hrMatches[hrMatches.length - 2];
    html = html.slice(startHR, endHR > startHR + 1000 ? endHR : html.length);
  } else if (hrMatches.length >= 1) {
    // Fallback: start after 1st HR
    html = html.slice(hrMatches[0]);
  }

  html = html.replace(/<head[\s\S]*?<\/head>/gi, "");
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");

  // ── Convert HTML structure to paragraphs ──────────────────────────────────
  html = html.replace(/<\/p>/gi, "\n\n");
  html = html.replace(/<p[^>]*>/gi, "");
  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<hr\s*\/?>/gi, "\n\n");
  html = html.replace(/<h[1-6][^>]*>/gi, "\n\n");
  html = html.replace(/<\/h[1-6]>/gi, "\n\n");
  // Strip HTML comments and remaining tags
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<[^>]+>/g, "");
  // Decode entities
  html = html
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&laquo;/g, "«").replace(/&raquo;/g, "»")
    .replace(/&#0*(\d+);?/g, (_, n) => String.fromCharCode(+n));
  // Normalize whitespace
  html = html.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  html = html.replace(/[ \t]+/g, " ");
  html = html.replace(/\n{4,}/g, "\n\n\n");
  return html.trim();
}

async function getFromLibru(urls: string | string[]): Promise<string | null> {
  const urlList = Array.isArray(urls) ? urls : [urls];
  const parts: string[] = [];

  for (const url of urlList) {
    console.log(`    [lib.ru] ${url}`);
    const buf = downloadWithCurl(url);
    if (!buf) { console.log(`    lib.ru: curl failed`); continue; }
    const text = decodeLibruHtml(buf);
    if (text.length >= 3000) {
      parts.push(text);
    } else {
      console.log(`    lib.ru: too short (${text.length} chars)`);
    }
    await delay(400);
  }

  if (parts.length === 0) return null;
  const combined = parts.join("\n\n\n");
  return combined.length >= 4000 ? combined : null;
}

// ─── WIKISOURCE ───────────────────────────────────────────────────────────────

const wsCache = new Map<string, string>();

async function fetchWikiRaw(title: string): Promise<string> {
  if (wsCache.has(title)) return wsCache.get(title)!;
  const url =
    "https://ru.wikisource.org/w/index.php?title=" +
    encodeURIComponent(title.replace(/ /g, "_")) +
    "&action=raw";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Folio-Library/1.0 (educational)" },
      signal: AbortSignal.timeout(30000),
    });
    const text = res.ok ? await res.text() : "";
    wsCache.set(title, text);
    return text;
  } catch {
    return "";
  }
}

/** Fetch Wikisource page, following #REDIRECT automatically */
async function fetchWikiResolved(title: string, depth = 0): Promise<string> {
  if (depth > 3) return "";
  const wt = await fetchWikiRaw(title);
  const redir = wt.match(/^#REDIRECT\s*\[\[([^\]]+)\]\]/i);
  if (redir) {
    await delay(200);
    return fetchWikiResolved(redir[1].trim(), depth + 1);
  }
  return wt;
}

/** Expand {{:SubPage}} transclusions */
async function expandTransclusions(wt: string, depth = 0): Promise<string> {
  if (depth > 5) return wt;
  const tRe = /\{\{:([^}|#\n]+?)(?:\|[^}]*)?\}\}/g;
  const matches = [...wt.matchAll(tRe)];
  for (const m of matches) {
    const sub = m[1].trim();
    const subRaw = await fetchWikiResolved(sub);
    if (subRaw) {
      const expanded = await expandTransclusions(subRaw, depth + 1);
      wt = wt.replace(m[0], expanded);
    }
    await delay(120);
  }
  return wt;
}

function stripWikitext(wt: string): string {
  wt = wt.replace(/<!--[\s\S]*?-->/g, "");
  wt = wt.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, "");
  wt = wt.replace(/<ref[^>]*\/>/gi, "");
  wt = wt.replace(/<pages[^>]*\/>/gi, "");
  wt = wt.replace(/\{\{[Сс]тр\|[^}]*\}\}/g, "");
  wt = wt.replace(/\{\{(?:center|right|left|центр|право|лево|block center)\|([^}]*)\}\}/gi, "$1");
  wt = wt.replace(/\{\{[Dd]rop\|[^|]*\|([^}]*)\}\}/g, "$1");
  wt = wt.replace(/\{\{—\}\}/g, "—");
  wt = wt.replace(/\{\{нп\d?\|([^|}\]]*)[^}]*\}\}/gi, "$1");
  for (let i = 0; i < 10; i++) {
    const prev = wt;
    wt = wt.replace(/\{\{[^{}]*\}\}/g, "");
    if (prev === wt) break;
  }
  wt = wt.replace(/\[\[(?:[^\]|]*\|)([^\]]*)\]\]/g, "$1");
  wt = wt.replace(/\[\[([^\]]*)\]\]/g, "$1");
  wt = wt.replace(/\[https?:\/\/\S+\s([^\]]+)\]/g, "$1");
  wt = wt.replace(/\[https?:\/\/\S+\]/g, "");
  wt = wt.replace(/={2,}\s*(.+?)\s*={2,}/g, "\n\n$1\n\n");
  wt = wt.replace(/'{3}/g, "").replace(/'{2}/g, "");
  wt = wt.replace(/<br\s*\/?>/gi, "\n");
  wt = wt.replace(/<[^>]+>/g, "");
  wt = wt
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&laquo;/g, "«").replace(/&raquo;/g, "»")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
  wt = wt.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  wt = wt.replace(/[ \t]+/g, " ");
  wt = wt.replace(/\n{4,}/g, "\n\n\n");
  return wt.trim();
}

async function getFromWikisource(wsTitle: string): Promise<string | null> {
  console.log(`    [WS] ${wsTitle}`);

  // Fetch with redirect resolution
  let mainWt = await fetchWikiResolved(wsTitle);
  if (!mainWt) return null;

  // Expand {{:SubPage}} transclusions
  mainWt = await expandTransclusions(mainWt);

  // Try subpage crawling for container pages
  const subpageLinks = new Set<string>();
  for (const m of mainWt.matchAll(/\[\[\/(([^/\]]+)\/?)\]\]/g)) {
    subpageLinks.add(`${wsTitle}/${m[2].trim()}`);
  }
  const escTitle = wsTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const m of mainWt.matchAll(new RegExp(`\\[\\[${escTitle}\\/([^\\]|]+)(?:\\|[^\\]]*)?\\]\\]`, "g"))) {
    subpageLinks.add(`${wsTitle}/${m[1].trim()}`);
  }

  if (subpageLinks.size > 0) {
    console.log(`    [WS] ${subpageLinks.size} подстраниц…`);
    const parts: string[] = [];
    for (const sub of subpageLinks) {
      const subWt = await fetchWikiResolved(sub);
      if (subWt) {
        const expanded = await expandTransclusions(subWt);
        parts.push(stripWikitext(expanded));
      }
      await delay(150);
    }
    if (parts.length > 0) {
      const combined = parts.join("\n\n");
      if (combined.length >= 4000) return combined;
    }
  }

  const stripped = stripWikitext(mainWt);
  return stripped.length >= 4000 ? stripped : null;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function buildEpub(text: string, slug: string, title: string): Promise<Buffer> {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml",
    `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`);
  zip.file("OEBPS/content.opf",
    `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">folio-${slug}</dc:identifier><dc:title>${esc(title)}</dc:title><dc:language>ru</dc:language></metadata><manifest><item id="c" href="content.html" media-type="application/xhtml+xml"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/></manifest><spine toc="ncx"><itemref idref="c"/></spine></package>`);
  zip.file("OEBPS/toc.ncx",
    `<?xml version="1.0" encoding="utf-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="folio-${slug}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${esc(title)}</text></docTitle><navMap><navPoint id="np1" playOrder="1"><navLabel><text>${esc(title)}</text></navLabel><content src="content.html"/></navPoint></navMap></ncx>`);
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter((p) => p.length > 0)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("\n");
  zip.file("OEBPS/content.html",
    `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru"><head><meta charset="utf-8"/><title>${esc(title)}</title><style>body{font-family:serif;line-height:1.7;margin:1em 2em}p{text-indent:1.5em;margin:.2em 0}</style></head><body><h1>${esc(title)}</h1>${paras}</body></html>`);
  return await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

async function upload(buf: Buffer, path: string, mime: string): Promise<string | null> {
  const { error } = await supabase.storage
    .from("book-files")
    .upload(path, buf, { contentType: mime, upsert: true });
  if (error) { console.log(`    ✗ storage: ${error.message}`); return null; }
  return supabase.storage.from("book-files").getPublicUrl(path).data.publicUrl;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🇷🇺 Folio — загрузка РУССКИХ текстов (v4)\n");

  const slugs = Object.keys(SOURCES);
  const { data: books, error } = await supabase
    .from("books")
    .select("id, slug, title, title_ru, txt_url")
    .in("slug", slugs);

  if (error || !books) { console.error("Supabase:", error?.message); process.exit(1); }

  const bookMap = Object.fromEntries(books.map((b) => [b.slug, b]));
  const ok: string[] = [];
  const fail: Array<{ slug: string; reason: string }> = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const src = SOURCES[slug];
    const book = bookMap[slug];
    if (!book) {
      console.log(`[${i + 1}/${slugs.length}] ${slug} — НЕТ В БАЗЕ, пропуск`);
      fail.push({ slug, reason: "нет в базе" });
      continue;
    }

    // Skip only books where we already uploaded a RUSSIAN text
    // (those uploaded in THIS script run, identified by presence in ok[])
    // We always overwrite English translations from seed-retry

    const displayTitle = book.title_ru ?? book.title ?? src.title;
    console.log(`\n[${i + 1}/${slugs.length}] ${slug} — «${displayTitle}»`);

    let text: string | null = null;
    let source = "";

    // 1. Try Wikisource (redirect + subpage aware)
    if (src.ws) {
      text = await getFromWikisource(src.ws);
      if (text) source = "Wikisource";
    }

    // 2. Fallback: lib.ru via curl
    if (!text && src.lib) {
      text = await getFromLibru(src.lib);
      if (text) source = "lib.ru";
    }

    if (!text) {
      console.log(`    ❌ Текст не найден`);
      fail.push({ slug, reason: "нет текста" });
      continue;
    }

    const words = text.split(/\s+/).length;
    console.log(`    ✓ ${source}: ${words.toLocaleString()} слов`);

    // Upload TXT
    const txtUrl = await upload(Buffer.from(text, "utf-8"), `${slug}/${slug}.txt`, "text/plain");
    if (!txtUrl) { fail.push({ slug, reason: "ошибка загрузки TXT" }); continue; }

    // Build & upload EPUB
    const epubBuf = await buildEpub(text, slug, displayTitle);
    const epubUrl = await upload(epubBuf, `${slug}/${slug}.epub`, "application/epub+zip");

    // Update DB
    const upd: Record<string, string> = { txt_url: txtUrl };
    if (epubUrl) upd.epub_url = epubUrl;
    const { error: dbErr } = await supabase.from("books").update(upd).eq("id", book.id);
    if (dbErr) { fail.push({ slug, reason: dbErr.message }); continue; }

    console.log(`    ✅ RU TXT${epubUrl ? " + EPUB" : ""} загружены`);
    ok.push(slug);
    await delay(500);
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  const div = "═".repeat(60);
  console.log(`\n${div}`);
  console.log("📊  РЕЗУЛЬТАТ — РУССКИЕ ТЕКСТЫ");
  console.log(div);
  if (ok.length) {
    console.log(`\n✅  ЗАГРУЖЕНО (${ok.length}):`);
    ok.forEach((s) => console.log(`   • ${s} — «${SOURCES[s].title}»`));
  }
  if (fail.length) {
    console.log(`\n❌  НЕ УДАЛОСЬ (${fail.length}):`);
    fail.forEach(({ slug, reason }) => console.log(`   • ${slug}: ${reason}`));
  }
  console.log(`\n${div}`);
  console.log(`Итого: ✅ ${ok.length} / ${slugs.length}  |  ❌ ${fail.length}`);
  console.log(`${div}\n`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
