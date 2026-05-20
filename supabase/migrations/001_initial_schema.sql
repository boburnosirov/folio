-- ═══════════════════════════════════════════════════════════
--  Folio — initial schema
--  Run once in Supabase SQL Editor or via supabase db push
-- ═══════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- ── Enums ────────────────────────────────────────────────────
create type book_language as enum ('ru', 'en', 'uz', 'fr', 'de', 'other');

-- ── Categories ───────────────────────────────────────────────
create table public.categories (
  slug         text primary key,
  name         text not null,
  description  text,
  icon_name    text not null default 'BookOpen',
  display_order smallint not null default 0
);

insert into public.categories (slug, name, description, icon_name, display_order) values
  ('russian-classics',  'Художественная литература', 'Толстой, Достоевский, Чехов, Гоголь', 'BookOpen',   1),
  ('world-classics',    'Зарубежная классика',       'Гюго, Остин, Диккенс, Конан Дойл',   'Globe',       2),
  ('romance',           'Романтика',                 'Ася, Первая любовь, Джейн Остин',     'Heart',       3),
  ('philosophy',        'Философия и характер',      'Марк Аврелий, Сенека, Монтень',       'Brain',       4),
  ('self-development',  'Саморазвитие',              'Смайлс, Уоттлз, Хилл, Марден',        'TrendingUp',  5),
  ('business-success',  'Бизнес и успех',            'Франклин, Карнеги и классика дела',   'Briefcase',   6),
  ('science',           'Космос и наука',            'Фламмарион, Верн, Эйнштейн',          'Telescope',   7),
  ('uzbek-classics',    'Узбекская классика',        'Навои, Бабур, Чулпан, Мукими',        'Star',        8);

-- ── Authors ──────────────────────────────────────────────────
create table public.authors (
  id           bigint generated always as identity primary key,
  name         text not null,
  name_ru      text,
  born_year    smallint,
  died_year    smallint,
  nationality  text,
  bio          text,
  created_at   timestamptz not null default now()
);

create index authors_name_trgm on public.authors using gin (name gin_trgm_ops);

-- ── Books ────────────────────────────────────────────────────
create table public.books (
  id             bigint generated always as identity primary key,
  slug           text not null unique,
  title          text not null,
  title_ru       text,
  author_id      bigint references public.authors (id) on delete set null,
  category_slug  text references public.categories (slug) on delete set null,
  language       book_language not null default 'ru',
  year_published smallint,
  description    text,
  cover_url      text,
  epub_url       text,
  pdf_url        text,
  txt_url        text,
  gutenberg_id   int,
  is_featured    boolean not null default false,
  is_public      boolean not null default true,
  read_count     bigint not null default 0,
  download_count bigint not null default 0,
  created_at     timestamptz not null default now()
);

create index books_category on public.books (category_slug);
create index books_author   on public.books (author_id);
create index books_featured on public.books (is_featured) where is_featured = true;
create index books_title_trgm on public.books using gin (
  (coalesce(title_ru, title)) gin_trgm_ops
);

-- ── Reading progress (Stage 6) ───────────────────────────────
create table public.reading_progress (
  user_id     uuid references auth.users (id) on delete cascade,
  book_id     bigint references public.books (id) on delete cascade,
  position    text not null default '0',
  updated_at  timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- ── Bookmarks (Stage 6) ──────────────────────────────────────
create table public.user_bookmarks (
  user_id     uuid references auth.users (id) on delete cascade,
  book_id     bigint references public.books (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- ── Row-Level Security ───────────────────────────────────────
alter table public.categories       enable row level security;
alter table public.authors          enable row level security;
alter table public.books            enable row level security;
alter table public.reading_progress enable row level security;
alter table public.user_bookmarks   enable row level security;

-- Public reads
create policy "categories: public read"
  on public.categories for select using (true);

create policy "authors: public read"
  on public.authors for select using (true);

create policy "books: public read"
  on public.books for select using (is_public = true);

-- Authenticated users manage own progress / bookmarks
create policy "progress: own rows"
  on public.reading_progress for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "bookmarks: own rows"
  on public.user_bookmarks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service-role writes (used by admin/seed scripts)
create policy "books: service insert"
  on public.books for insert
  with check (true);

create policy "books: service update"
  on public.books for update
  using (true);

create policy "authors: service insert"
  on public.authors for insert
  with check (true);

-- ── Full-text search helper ──────────────────────────────────
create or replace function public.search_books(query text)
returns setof public.books
language sql stable
as $$
  select *
  from public.books
  where is_public = true
    and (
      coalesce(title_ru, title) ilike '%' || query || '%'
      or exists (
        select 1 from public.authors a
        where a.id = books.author_id
          and (a.name ilike '%' || query || '%' or a.name_ru ilike '%' || query || '%')
      )
    )
  order by is_featured desc, read_count desc;
$$;

create or replace function public.increment_read_count(book_id bigint)
returns void
language sql
security definer
as $$
  update public.books set read_count = read_count + 1 where id = book_id;
$$;
