/**
 * lib/epub.ts
 * Парсит EPUB на клиенте: извлекает HTML контент и картинки.
 * Картинки превращаются в blob URLs, чтобы отображаться в читалке.
 */
import JSZip from "jszip";

export interface EpubPage {
  html: string;
  plainText: string;
  hasImage: boolean;
}

export interface EpubContent {
  pages: EpubPage[];
  title?: string;
  language?: string;
  hasImages: boolean;
  blobUrls: string[]; // for cleanup
}

const ALLOWED_TAGS = new Set([
  "p","br","b","strong","i","em","u","s","small","sub","sup","mark",
  "h1","h2","h3","h4","h5","h6","blockquote","q","cite","figure","figcaption",
  "img","hr","ul","ol","li","dl","dt","dd","span","div","section","article","header","footer",
  "table","thead","tbody","tfoot","tr","td","th","caption",
  "a","abbr","time","code","pre","kbd","var","samp",
]);

function joinPath(dir: string, href: string): string {
  // Handle absolute paths
  if (href.startsWith("/")) return href.slice(1);
  // Handle "../" segments
  const dirParts = dir.split("/").filter(Boolean);
  const hrefParts = href.split("/");
  for (const part of hrefParts) {
    if (part === "..") dirParts.pop();
    else if (part !== ".") dirParts.push(part);
  }
  return dirParts.join("/");
}

function getDir(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx >= 0 ? path.slice(0, idx + 1) : "";
}

/** Detect encoding from XML declaration or meta charset */
function detectEncoding(bytes: Uint8Array): string {
  // Sniff first 1024 bytes
  const head = new TextDecoder("ascii", { fatal: false }).decode(bytes.slice(0, 1024));
  const xmlMatch = head.match(/<\?xml[^>]*\sencoding\s*=\s*["']([^"']+)["']/i);
  if (xmlMatch) return xmlMatch[1].toLowerCase();
  const metaMatch = head.match(/<meta[^>]*charset\s*=\s*["']?([^"'>\s;]+)/i);
  if (metaMatch) return metaMatch[1].toLowerCase();
  return "utf-8";
}

/** Decode bytes using detected encoding, fallback to UTF-8 */
function decodeBytes(bytes: Uint8Array): string {
  const enc = detectEncoding(bytes);
  try {
    return new TextDecoder(enc, { fatal: false }).decode(bytes);
  } catch {
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  }
}

/** Quality check: returns ratio of "good" chars (letters/digits/punct/whitespace) */
function textQuality(s: string): number {
  if (s.length === 0) return 0;
  let good = 0;
  let bad = 0;
  // Sample up to 10000 chars
  const sample = s.length > 10000 ? s.slice(0, 10000) : s;
  for (let i = 0; i < sample.length; i++) {
    const c = sample.charCodeAt(i);
    if (
      c === 0xFFFD ||                       // replacement char
      (c < 32 && c !== 9 && c !== 10 && c !== 13) || // control chars
      (c >= 0xE000 && c <= 0xF8FF)          // PUA (custom-font glyphs)
    ) {
      bad++;
    } else if (
      (c >= 32 && c < 127) ||               // basic ASCII
      c === 0x00A0 ||                       // nbsp
      (c >= 0x00A1 && c <= 0x024F) ||       // latin-1 supplement + extended
      (c >= 0x0400 && c <= 0x04FF) ||       // Cyrillic
      (c >= 0x2000 && c <= 0x206F) ||       // general punctuation (em dash etc.)
      c === 9 || c === 10 || c === 13
    ) {
      good++;
    } else if (c >= 0x4E00 && c <= 0x9FFF) {
      // CJK — penalize since our library is RU/EN/FR/DE
      bad++;
    } else {
      // Other Unicode — half-credit
      good += 0.5;
    }
  }
  return good / (good + bad);
}

/** Strip XHTML namespaces and dangerous content from EPUB chapter HTML */
function sanitizeHtml(html: string, imageUrls: Map<string, string>, chapterDir: string): string {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Remove dangerous content
  content = content.replace(/<script[\s\S]*?<\/script>/gi, "");
  content = content.replace(/<style[\s\S]*?<\/style>/gi, "");
  content = content.replace(/<link[^>]*>/gi, "");
  content = content.replace(/<meta[^>]*>/gi, "");
  content = content.replace(/<!DOCTYPE[^>]*>/gi, "");
  content = content.replace(/<\?xml[^>]*\?>/gi, "");
  content = content.replace(/<!--[\s\S]*?-->/g, "");

  // Strip on* event handlers
  content = content.replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "");
  content = content.replace(/\s+on\w+\s*=\s*'[^']*'/gi, "");
  content = content.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");

  // Strip javascript: hrefs
  content = content.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"');
  content = content.replace(/href\s*=\s*'javascript:[^']*'/gi, "href=\"#\"");

  // Fix image sources: resolve relative paths and swap to blob URLs
  content = content.replace(
    /<img\s+([^>]*?)\s*\/?>/gi,
    (match, attrs: string) => {
      const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt\s*=\s*["']([^"']*)["']/i);
      if (!srcMatch) return "";
      let src = srcMatch[1];
      // Try various resolution forms
      const candidates = [
        src,
        joinPath(chapterDir, src),
        decodeURIComponent(src),
        joinPath(chapterDir, decodeURIComponent(src)),
      ];
      let blobUrl: string | undefined;
      for (const c of candidates) {
        blobUrl = imageUrls.get(c);
        if (blobUrl) break;
      }
      if (!blobUrl) return ""; // Image not found in zip — drop it
      const alt = altMatch?.[1] ?? "";
      return `<img src="${blobUrl}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" />`;
    }
  );

  // Handle SVG <image> tags inside <svg>: replace whole <svg> with <img>
  content = content.replace(
    /<svg[^>]*>[\s\S]*?<image[^>]*?(?:xlink:)?href\s*=\s*["']([^"']+)["'][^>]*?\/?>[\s\S]*?<\/svg>/gi,
    (match, href: string) => {
      const candidates = [
        href,
        joinPath(chapterDir, href),
        decodeURIComponent(href),
        joinPath(chapterDir, decodeURIComponent(href)),
      ];
      for (const c of candidates) {
        const b = imageUrls.get(c);
        if (b) return `<img src="${b}" alt="" loading="lazy" />`;
      }
      return "";
    }
  );

  // Strip unknown tags (keep content)
  content = content.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tag: string) => {
    return ALLOWED_TAGS.has(tag.toLowerCase()) ? match : "";
  });

  return content.trim();
}

/** Extract plain text from HTML for fallback / search */
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, " ").trim();
}

/** Split big HTML chunks into pages at element boundaries, ~targetChars each */
function splitHtmlIntoPages(html: string, targetChars: number): EpubPage[] {
  if (!html.trim()) return [];

  // Split into top-level blocks (paragraphs, headings, images, etc.)
  // Match: <p>, <h1-h6>, <img>, <blockquote>, <figure>, <hr>, <ul/ol>, <table>, <div>
  const blockRe = /<(p|h[1-6]|blockquote|figure|ul|ol|table|div|hr|img)\b[^>]*>(?:[\s\S]*?<\/\1>)?|<img\b[^>]*\/?>/gi;
  const blocks: string[] = [];
  let lastEnd = 0;
  let m;
  while ((m = blockRe.exec(html)) !== null) {
    // Loose-text in between gets folded into a <p>
    if (m.index > lastEnd) {
      const tail = html.slice(lastEnd, m.index).trim();
      if (tail) blocks.push(`<p>${tail}</p>`);
    }
    blocks.push(m[0]);
    lastEnd = blockRe.lastIndex;
  }
  if (lastEnd < html.length) {
    const tail = html.slice(lastEnd).trim();
    if (tail) blocks.push(`<p>${tail}</p>`);
  }
  if (blocks.length === 0) {
    // No structured blocks, wrap whole thing
    blocks.push(`<p>${html}</p>`);
  }

  const pages: EpubPage[] = [];
  let currentBlocks: string[] = [];
  let currentChars = 0;
  let currentHasImage = false;

  const flush = () => {
    if (currentBlocks.length === 0) return;
    const pageHtml = currentBlocks.join("\n");
    pages.push({
      html: pageHtml,
      plainText: htmlToText(pageHtml),
      hasImage: currentHasImage,
    });
    currentBlocks = [];
    currentChars = 0;
    currentHasImage = false;
  };

  for (const block of blocks) {
    const text = htmlToText(block);
    const charCount = text.length;
    const hasImg = /<img\b/i.test(block);

    // Images add visual weight — count as 600 chars
    const weight = hasImg ? Math.max(charCount, 600) : charCount;

    // If single block is huge, flush current and put this alone (or split)
    if (weight > targetChars * 1.6 && currentBlocks.length > 0) {
      flush();
    }

    if (currentChars + weight > targetChars && currentBlocks.length > 0) {
      flush();
    }

    currentBlocks.push(block);
    currentChars += weight;
    if (hasImg) currentHasImage = true;

    // If we crossed the threshold with this block, flush
    if (currentChars >= targetChars) {
      flush();
    }
  }
  flush();

  return pages;
}

/** Main entry point: fetch EPUB, parse, return paginated content */
export async function parseEpubFromUrl(url: string, charsPerPage = 1800): Promise<EpubContent | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    // 1. Find OPF via container.xml
    const containerBytes = await zip.file("META-INF/container.xml")?.async("uint8array");
    if (!containerBytes) return null;
    const containerXml = decodeBytes(containerBytes);
    const opfMatch = containerXml.match(/full-path=["']([^"']+)["']/i);
    if (!opfMatch) return null;
    const opfPath = opfMatch[1];
    const opfDir = getDir(opfPath);

    // 2. Parse OPF
    const opfBytes = await zip.file(opfPath)?.async("uint8array");
    if (!opfBytes) return null;
    const opfXml = decodeBytes(opfBytes);

    // Manifest: id → {href, mediaType}
    const manifest = new Map<string, { href: string; mediaType: string }>();
    const itemRe = /<item\s+([^/>]+?)\s*\/?>/g;
    let m;
    while ((m = itemRe.exec(opfXml)) !== null) {
      const attrs = m[1];
      const id = attrs.match(/id\s*=\s*["']([^"']+)["']/i)?.[1];
      const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
      const mediaType = attrs.match(/media-type\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
      if (id && href) {
        manifest.set(id, { href: decodeURIComponent(href), mediaType });
      }
    }

    // Spine: ordered list of idrefs
    const spine: string[] = [];
    const spineRe = /<itemref\s+[^>]*idref\s*=\s*["']([^"']+)["']/gi;
    while ((m = spineRe.exec(opfXml)) !== null) spine.push(m[1]);

    // Title & language
    const title = opfXml.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i)?.[1]?.trim();
    const language = opfXml.match(/<dc:language[^>]*>([^<]+)<\/dc:language>/i)?.[1]?.trim();

    // 3. Load all images as blob URLs
    const imageUrls = new Map<string, string>();
    const blobUrls: string[] = [];
    for (const item of manifest.values()) {
      if (!item.mediaType.startsWith("image/")) continue;
      const fullPath = joinPath(opfDir, item.href);
      const file = zip.file(fullPath);
      if (file) {
        const blob = await file.async("blob");
        const url = URL.createObjectURL(blob);
        blobUrls.push(url);
        imageUrls.set(fullPath, url);
        imageUrls.set(item.href, url); // also map relative
      }
    }
    const hasImages = imageUrls.size > 0;

    // 4. Load spine HTML chunks (encoding-aware)
    const chunks: { content: string; dir: string }[] = [];
    for (const id of spine) {
      const item = manifest.get(id);
      if (!item) continue;
      if (!/html|xml/i.test(item.mediaType)) continue;
      // Skip NCX TOC files
      if (/ncx/i.test(item.mediaType)) continue;
      const fullPath = joinPath(opfDir, item.href);
      const bytes = await zip.file(fullPath)?.async("uint8array");
      if (!bytes) continue;
      const html = decodeBytes(bytes);
      const dir = getDir(fullPath);
      chunks.push({ content: sanitizeHtml(html, imageUrls, dir), dir });
    }

    // 5. Concatenate sanitized content and split into pages
    const combinedHtml = chunks.map(c => c.content).join("\n\n<hr/>\n\n");
    const pages = splitHtmlIntoPages(combinedHtml, charsPerPage);

    // 6. Quality check: if too much garbage, reject EPUB (will fall back to TXT)
    const samplePlain = pages.slice(0, 5).map(p => p.plainText).join(" ");
    const quality = textQuality(samplePlain);
    if (quality < 0.85) {
      console.warn(`[parseEpub] Low text quality (${(quality * 100).toFixed(0)}%) — falling back to TXT`);
      revokeBlobUrls(blobUrls);
      return null;
    }

    return { pages, title, language, hasImages, blobUrls };
  } catch (e) {
    console.error("[parseEpub]", e);
    return null;
  }
}

/** Plain-text fallback splitter (used when no EPUB available) — char-based */
export function splitTextIntoPages(raw: string, charsPerPage = 1800): EpubPage[] {
  if (!raw.trim()) return [];

  const paragraphs = raw
    .split(/\n{2,}/)
    .map(p => p.replace(/\n/g, " ").trim())
    .filter(p => p.length > 0);

  const pages: EpubPage[] = [];
  let currentParas: string[] = [];
  let currentChars = 0;

  const flush = () => {
    if (currentParas.length === 0) return;
    const text = currentParas.join("\n\n");
    const html = currentParas
      .map(p => {
        if (p.length < 80 && /^(chapter|part|book|section|глава|часть|книга|том|act|сцена|scene)\b/i.test(p)) {
          return `<h2>${escapeHtml(p)}</h2>`;
        }
        return `<p>${escapeHtml(p)}</p>`;
      })
      .join("");
    pages.push({ html, plainText: text, hasImage: false });
    currentParas = [];
    currentChars = 0;
  };

  for (const p of paragraphs) {
    const len = p.length;
    // If a single paragraph is too long, split it into sentences
    if (len > charsPerPage * 1.5) {
      if (currentParas.length > 0) flush();
      const sentences = p.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) ?? [p];
      let sentBuf = "";
      for (const s of sentences) {
        if (sentBuf.length + s.length > charsPerPage && sentBuf) {
          currentParas = [sentBuf];
          flush();
          sentBuf = s;
        } else {
          sentBuf += s;
        }
      }
      if (sentBuf.trim()) {
        currentParas = [sentBuf];
        currentChars = sentBuf.length;
      }
      continue;
    }
    if (currentChars + len > charsPerPage && currentParas.length > 0) {
      flush();
    }
    currentParas.push(p);
    currentChars += len;
  }
  flush();
  return pages;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Cleanup helper — call when reader unmounts */
export function revokeBlobUrls(urls: string[]) {
  for (const u of urls) {
    try { URL.revokeObjectURL(u); } catch {}
  }
}
