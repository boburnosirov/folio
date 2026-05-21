-- ══════════════════════════════════════════════════════════════
--  Folio — fix broken covers (fabricated OL8…W IDs → verified OLIDs)
--  Source: openlibrary.org/works/ search, Jan 2026
-- ══════════════════════════════════════════════════════════════

-- ── Dostoevsky ────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL166971W-L.jpg'   WHERE slug = 'besy';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL166934W-L.jpg'   WHERE slug = 'zapiski-iz-podpolya';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL166923W-L.jpg'   WHERE slug = 'igrok';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL41039150W-L.jpg' WHERE slug = 'belye-nochi';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/2302/pg2302.cover.medium.jpg' WHERE slug = 'bednye-lyudi';

-- ── Gogol ─────────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL17396611W-L.jpg' WHERE slug = 'mertvye-dushi';

-- ── Pushkin ───────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL623499W-L.jpg'   WHERE slug = 'evgeniy-onegin';

-- ── Turgenev ──────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL43370W-L.jpg'    WHERE slug = 'ottsy-i-deti';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL38788505W-L.jpg' WHERE slug = 'pervaya-lyubov';

-- ── Lermontov ─────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL19979226W-L.jpg' WHERE slug = 'geroy-nashego-vremeni';

-- ── Victor Hugo ───────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL15202030W-L.jpg' WHERE slug = 'notre-dame-de-paris';

-- ── Goethe ────────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL17372815W-L.jpg' WHERE slug = 'werther';

-- ── Shakespeare (verified work OLIDs) ────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL9170454W-L.jpg'  WHERE slug = 'hamlet';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL362427W-L.jpg'   WHERE slug = 'romeo-and-juliet';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL258902W-L.jpg'   WHERE slug = 'macbeth';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL258850W-L.jpg'   WHERE slug = 'othello';
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL259026W-L.jpg'   WHERE slug = 'king-lear';

-- ── Philosophy ────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL1317211W-L.jpg'  WHERE slug = 'meditations';
-- Seneca Letters from a Stoic — Penguin Classics ISBN
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/isbn/0140442103-L.jpg'  WHERE slug = 'seneca-letters';

-- ── Self-development ──────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL2321834W-L.jpg'  WHERE slug = 'self-help';
UPDATE books SET cover_url = 'https://www.gutenberg.org/cache/epub/1579/pg1579.cover.medium.jpg' WHERE slug = 'science-of-getting-rich';

-- ── Biography ─────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL26492W-L.jpg'    WHERE slug = 'autobiography-franklin';

-- ── Science ───────────────────────────────────────────────────
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/olid/OL515051W-L.jpg'   WHERE slug = 'origin-of-species';

-- ── Russian literature (ISBN-based covers via Penguin Classics) ──
-- Leskov: Lady Macbeth of the Mtsensk District (Penguin Classics)
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/isbn/0140446230-L.jpg'  WHERE slug = 'ledi-makbet-mcenskogo';
-- Kuprin: The Duel (Penguin Classics)
UPDATE books SET cover_url = 'https://covers.openlibrary.org/b/isbn/0140441522-L.jpg'  WHERE slug = 'poedinok-kuprin';
