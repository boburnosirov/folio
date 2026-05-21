-- ══════════════════════════════════════════════════════════════
--  Folio — ratings, favorites, read_later, companion_slug
-- ══════════════════════════════════════════════════════════════

-- ── companion_slug: links EN↔RU versions of same book ────────
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS companion_slug text REFERENCES public.books(slug) ON DELETE SET NULL;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS avg_rating numeric(3,1) NOT NULL DEFAULT 0;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS rating_count int NOT NULL DEFAULT 0;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS weekly_read_count bigint NOT NULL DEFAULT 0;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS monthly_read_count bigint NOT NULL DEFAULT 0;

-- ── book_ratings ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.book_ratings (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  book_id     bigint references public.books(id) on delete cascade not null,
  rating      smallint not null check (rating >= 1 and rating <= 10),
  comment     text,
  created_at  timestamptz not null default now(),
  unique(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS book_ratings_book ON public.book_ratings(book_id);

-- ── user_favorites ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id     uuid references auth.users(id) on delete cascade,
  book_id     bigint references public.books(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- ── user_read_later ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_read_later (
  user_id     uuid references auth.users(id) on delete cascade,
  book_id     bigint references public.books(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE public.book_ratings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_read_later ENABLE ROW LEVEL SECURITY;

-- ratings: anyone can read, auth users manage own
CREATE POLICY "ratings: public read"  ON public.book_ratings FOR SELECT USING (true);
CREATE POLICY "ratings: own rows"     ON public.book_ratings FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- favorites: own rows only
CREATE POLICY "favorites: own rows"   ON public.user_favorites FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- read_later: own rows only
CREATE POLICY "read_later: own rows"  ON public.user_read_later FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── Function: update avg_rating on books after insert/update/delete ──
CREATE OR REPLACE FUNCTION public.refresh_book_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.books
  SET
    avg_rating   = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.book_ratings WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)), 0),
    rating_count = (SELECT COUNT(*) FROM public.book_ratings WHERE book_id = COALESCE(NEW.book_id, OLD.book_id))
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_refresh_book_rating
AFTER INSERT OR UPDATE OR DELETE ON public.book_ratings
FOR EACH ROW EXECUTE FUNCTION public.refresh_book_rating();

-- ── Link companion slugs (EN ↔ RU) ───────────────────────────
UPDATE public.books SET companion_slug = 'where-the-crawdads-sing-ru' WHERE slug = 'where-the-crawdads-sing';
UPDATE public.books SET companion_slug = 'where-the-crawdads-sing'    WHERE slug = 'where-the-crawdads-sing-ru';
UPDATE public.books SET companion_slug = 'midnight-library-ru'        WHERE slug = 'midnight-library';
UPDATE public.books SET companion_slug = 'midnight-library'           WHERE slug = 'midnight-library-ru';
UPDATE public.books SET companion_slug = 'klara-and-the-sun-ru'       WHERE slug = 'klara-and-the-sun';
UPDATE public.books SET companion_slug = 'klara-and-the-sun'          WHERE slug = 'klara-and-the-sun-ru';
UPDATE public.books SET companion_slug = 'normal-people-ru'           WHERE slug = 'normal-people';
UPDATE public.books SET companion_slug = 'normal-people'              WHERE slug = 'normal-people-ru';
UPDATE public.books SET companion_slug = 'tomorrow-and-tomorrow-ru'   WHERE slug = 'tomorrow-and-tomorrow';
UPDATE public.books SET companion_slug = 'tomorrow-and-tomorrow'      WHERE slug = 'tomorrow-and-tomorrow-ru';
UPDATE public.books SET companion_slug = 'pachinko-ru'                WHERE slug = 'pachinko';
UPDATE public.books SET companion_slug = 'pachinko'                   WHERE slug = 'pachinko-ru';
UPDATE public.books SET companion_slug = 'a-little-life-ru'           WHERE slug = 'a-little-life';
UPDATE public.books SET companion_slug = 'a-little-life'              WHERE slug = 'a-little-life-ru';
UPDATE public.books SET companion_slug = 'the-vegetarian-ru'          WHERE slug = 'the-vegetarian';
UPDATE public.books SET companion_slug = 'the-vegetarian'             WHERE slug = 'the-vegetarian-ru';
UPDATE public.books SET companion_slug = 'hamnet-ru'                  WHERE slug = 'hamnet';
UPDATE public.books SET companion_slug = 'hamnet'                     WHERE slug = 'hamnet-ru';
UPDATE public.books SET companion_slug = 'lincoln-in-the-bardo-ru'   WHERE slug = 'lincoln-in-the-bardo';
UPDATE public.books SET companion_slug = 'lincoln-in-the-bardo'      WHERE slug = 'lincoln-in-the-bardo-ru';
UPDATE public.books SET companion_slug = 'it-ends-with-us-ru'        WHERE slug = 'it-ends-with-us';
UPDATE public.books SET companion_slug = 'it-ends-with-us'           WHERE slug = 'it-ends-with-us-ru';
UPDATE public.books SET companion_slug = 'the-hating-game-ru'        WHERE slug = 'the-hating-game';
UPDATE public.books SET companion_slug = 'the-hating-game'           WHERE slug = 'the-hating-game-ru';
UPDATE public.books SET companion_slug = 'beach-read-ru'             WHERE slug = 'beach-read';
UPDATE public.books SET companion_slug = 'beach-read'                WHERE slug = 'beach-read-ru';
UPDATE public.books SET companion_slug = 'seven-husbands-ru'         WHERE slug = 'seven-husbands-of-evelyn-hugo';
UPDATE public.books SET companion_slug = 'seven-husbands-of-evelyn-hugo' WHERE slug = 'seven-husbands-ru';
UPDATE public.books SET companion_slug = 'people-we-meet-on-vacation-ru' WHERE slug = 'people-we-meet-on-vacation';
UPDATE public.books SET companion_slug = 'people-we-meet-on-vacation' WHERE slug = 'people-we-meet-on-vacation-ru';
UPDATE public.books SET companion_slug = '12-rules-for-life-ru'      WHERE slug = '12-rules-for-life';
UPDATE public.books SET companion_slug = '12-rules-for-life'         WHERE slug = '12-rules-for-life-ru';
UPDATE public.books SET companion_slug = 'courage-to-be-disliked-ru' WHERE slug = 'courage-to-be-disliked';
UPDATE public.books SET companion_slug = 'courage-to-be-disliked'    WHERE slug = 'courage-to-be-disliked-ru';
UPDATE public.books SET companion_slug = 'think-again-ru'            WHERE slug = 'think-again';
UPDATE public.books SET companion_slug = 'think-again'               WHERE slug = 'think-again-ru';
UPDATE public.books SET companion_slug = 'four-thousand-weeks-ru'    WHERE slug = 'four-thousand-weeks';
UPDATE public.books SET companion_slug = 'four-thousand-weeks'       WHERE slug = 'four-thousand-weeks-ru';
UPDATE public.books SET companion_slug = 'atomic-habits-ru'          WHERE slug = 'atomic-habits';
UPDATE public.books SET companion_slug = 'atomic-habits'             WHERE slug = 'atomic-habits-ru';
UPDATE public.books SET companion_slug = 'cant-hurt-me-ru'           WHERE slug = 'cant-hurt-me';
UPDATE public.books SET companion_slug = 'cant-hurt-me'              WHERE slug = 'cant-hurt-me-ru';
UPDATE public.books SET companion_slug = 'subtle-art-ru'             WHERE slug = 'subtle-art';
UPDATE public.books SET companion_slug = 'subtle-art'                WHERE slug = 'subtle-art-ru';
UPDATE public.books SET companion_slug = 'deep-work-ru'              WHERE slug = 'deep-work';
UPDATE public.books SET companion_slug = 'deep-work'                 WHERE slug = 'deep-work-ru';
UPDATE public.books SET companion_slug = 'the-5am-club-ru'           WHERE slug = 'the-5am-club';
UPDATE public.books SET companion_slug = 'the-5am-club'              WHERE slug = 'the-5am-club-ru';
UPDATE public.books SET companion_slug = 'zero-to-one-ru'            WHERE slug = 'zero-to-one';
UPDATE public.books SET companion_slug = 'zero-to-one'               WHERE slug = 'zero-to-one-ru';
UPDATE public.books SET companion_slug = 'shoe-dog-ru'               WHERE slug = 'shoe-dog';
UPDATE public.books SET companion_slug = 'shoe-dog'                  WHERE slug = 'shoe-dog-ru';
UPDATE public.books SET companion_slug = 'never-split-the-difference-ru' WHERE slug = 'never-split-the-difference';
UPDATE public.books SET companion_slug = 'never-split-the-difference' WHERE slug = 'never-split-the-difference-ru';
UPDATE public.books SET companion_slug = 'elon-musk-ru'              WHERE slug = 'elon-musk-isaacson';
UPDATE public.books SET companion_slug = 'elon-musk-isaacson'        WHERE slug = 'elon-musk-ru';
UPDATE public.books SET companion_slug = 'sapiens-ru'                WHERE slug = 'sapiens';
UPDATE public.books SET companion_slug = 'sapiens'                   WHERE slug = 'sapiens-ru';
UPDATE public.books SET companion_slug = 'homo-deus-ru'              WHERE slug = 'homo-deus';
UPDATE public.books SET companion_slug = 'homo-deus'                 WHERE slug = 'homo-deus-ru';
UPDATE public.books SET companion_slug = '21-lessons-ru'             WHERE slug = '21-lessons';
UPDATE public.books SET companion_slug = '21-lessons'                WHERE slug = '21-lessons-ru';
UPDATE public.books SET companion_slug = 'the-martian-ru'            WHERE slug = 'the-martian';
UPDATE public.books SET companion_slug = 'the-martian'               WHERE slug = 'the-martian-ru';
UPDATE public.books SET companion_slug = 'astrophysics-ru'           WHERE slug = 'astrophysics-for-people-in-a-hurry';
UPDATE public.books SET companion_slug = 'astrophysics-for-people-in-a-hurry' WHERE slug = 'astrophysics-ru';
UPDATE public.books SET companion_slug = 'the-gene-ru'               WHERE slug = 'the-gene';
UPDATE public.books SET companion_slug = 'the-gene'                  WHERE slug = 'the-gene-ru';
