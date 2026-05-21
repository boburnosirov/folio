-- ══════════════════════════════════════════════════════════════
--  Folio — Migration 008: Storage bucket for book files
-- ══════════════════════════════════════════════════════════════

-- Create public bucket for book text files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-files',
  'book-files',
  true,
  52428800,  -- 50 MB max per file
  ARRAY['text/plain', 'application/epub+zip', 'application/pdf', 'text/plain;charset=utf-8']
)
ON CONFLICT (id) DO NOTHING;

-- RLS: anyone can read files (bucket is public)
CREATE POLICY "book-files: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-files');

-- RLS: only service role (admin actions) can insert/update/delete
-- Note: admin server actions use service role key which bypasses RLS
-- This policy allows no direct client uploads (only via server actions)
CREATE POLICY "book-files: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'book-files' AND auth.role() = 'service_role');
