# Folio

Бесплатная онлайн-библиотека книг из общественного достояния. Читайте и скачивайте легально.

## Запуск локально

### 1. Установи зависимости

```bash
npm install
```

### 2. Настрой переменные окружения

```bash
cp .env.local.example .env.local
```

Открой `.env.local` и заполни:
- `NEXT_PUBLIC_SUPABASE_URL` — URL проекта на supabase.com
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key из Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (только сервер!)
- `ADMIN_EMAIL` — email с доступом к `/admin`

### 3. Примени миграции БД

Через Supabase Dashboard → SQL Editor, выполни:
```
supabase/migrations/0001_initial.sql
```

### 4. Запусти dev-сервер

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Стек

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui**
- **Framer Motion** — анимации
- **React Three Fiber** — 3D-эффекты на обложках
- **Supabase** — БД, авторизация, хранилище файлов
- **Vercel** — деплой

## Источники книг (все public domain)

- [Project Gutenberg](https://gutenberg.org) — зарубежная классика
- [Az.lib.ru](https://az.lib.ru) — русская классика
- [Wikisource](https://ru.wikisource.org) — верифицированные тексты
- [Ziyouz.uz](https://ziyouz.uz) — узбекская классика
- [Internet Archive](https://archive.org) — научпоп, саморазвитие
