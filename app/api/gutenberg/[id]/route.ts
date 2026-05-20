import { NextResponse } from "next/server";

// Gutenberg text URL candidates for a given book ID
function gutenbergUrls(id: number) {
  return [
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    `https://www.gutenberg.org/files/${id}/${id}.txt`,
  ];
}

function stripGutenbergWrapper(raw: string): string {
  // Find content between the standard PG markers
  const startRx = /\*{3}\s*START OF (THE |THIS )?PROJECT GUTENBERG/i;
  const endRx   = /\*{3}\s*END OF (THE |THIS )?PROJECT GUTENBERG/i;

  const startMatch = startRx.exec(raw);
  const endMatch   = endRx.exec(raw);

  let text = raw;
  if (startMatch) {
    const after = raw.indexOf("\n", startMatch.index);
    text = after !== -1 ? raw.slice(after + 1) : raw.slice(startMatch.index + startMatch[0].length);
  }
  if (endMatch) {
    const pos = endRx.exec(text);
    if (pos) text = text.slice(0, pos.index);
  }

  return text.trim();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid Gutenberg ID" }, { status: 400 });
  }

  let rawText = "";
  for (const url of gutenbergUrls(id)) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Folio-Library/1.0 (public domain reader)" },
        next: { revalidate: 86400 }, // cache 24 h
      });
      if (res.ok) {
        rawText = await res.text();
        break;
      }
    } catch {
      // try next mirror
    }
  }

  if (!rawText) {
    return NextResponse.json(
      { error: "Text not available from Project Gutenberg" },
      { status: 404 }
    );
  }

  const text = stripGutenbergWrapper(rawText);

  return NextResponse.json(
    { text },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    }
  );
}
