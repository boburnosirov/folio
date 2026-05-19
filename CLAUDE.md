# Folio — CLAUDE.md

Читай этот файл в начале каждой сессии. Здесь всё, что нужно знать о проекте.

## Что это

**Folio** — бесплатная онлайн-библиотека книг общественного достояния.
Аудитория: русскоязычные пользователи СНГ, в первую очередь Узбекистан.
Только легальный контент (строго public domain). Полные тексты, никаких саммари.

## Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 16 (App Router), TypeScript |
| Стили | Tailwind CSS v4 + shadcn/ui |
| Анимации | Framer Motion |
| 3D-эффекты | React Three Fiber + @react-three/drei |
| БД / Auth | Supabase (Postgres + Auth + Storage) |
| Деплой | Vercel |
| Шрифт UI | Inter (`--font-inter`) |
| Шрифт книг | Cormorant Garamond (`--font-cormorant`) |

## Структура

```
app/
  (main)/           — страницы с Header + Footer
  (auth)/           — login, register, verify-email
  account/          — личный кабинет (требует auth)
  admin/            — статистика (требует ADMIN_EMAIL)
  api/              — Route Handlers
components/
  layout/           — Header, Footer, ThemeToggle
  providers/        — ThemeProvider
  ui/               — shadcn/ui компоненты
lib/
  supabase/         — client.ts, server.ts, middleware.ts
scripts/            — импорт книг из внешних источников
supabase/
  migrations/       — SQL-миграции
```

## Дизайн

- Тёмная тема по умолчанию (`defaultTheme="dark"`)
- Фон: глубокий тёмно-синий `oklch(0.07 0.012 268)`
- Акцент: тёплый золотой `oklch(0.72 0.13 78)` — CSS-переменная `--gold` / `--primary`
- Tailwind-класс `.text-gold`, `.bg-gold`
- Заголовки и тексты книг: `font-family: var(--font-cormorant), serif`
- Sepia-тема — только для читалки (Этап 5)

## Принятые решения

### Прогресс анонимных пользователей в читалке
- Сохраняем в `localStorage`
- Показываем **ненавязчивый баннер** (тонкая полоска сверху читалки) — закрывается на сессию
- При входе/регистрации — авто-миграция прогресса из localStorage в Supabase
- Никаких popup на весь экран

### 3D-карусель (Этап 4)
- Делаем ОБА варианта: `/demo/css` и `/demo/r3f`
- Показываем метрики FPS + время загрузки на каждом
- Пользователь выбирает основной вариант после сравнения

## Переменные окружения

```
NEXT_PUBLIC_SUPABASE_URL=       # из supabase.com Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # из supabase.com Settings → API
SUPABASE_SERVICE_ROLE_KEY=      # только серверная сторона!
ADMIN_EMAIL=                    # email-адрес администратора (/admin)
NEXT_PUBLIC_SITE_URL=           # боевой URL (Этап 9, Vercel)
```

## Правила работы

1. После каждого этапа — остановиться и показать результат
2. Git-коммит после каждого завершённого блока
3. Перед `npm install` любых пакетов — спрашивать пользователя
4. При архитектурных развилках — спрашивать, не выбирать самому
5. Все книги строго public domain; при сомнениях — пропустить или спросить
6. Не добавлять фичи и абстракции за пределами текущей задачи
7. Не коммитить `.env.local` и секретные ключи

## Этапы

- [x] Этап 1 — план
- [x] Этап 2 — инициализация + layout
- [ ] Этап 3 — БД + импорт 30 книг
- [ ] Этап 4 — главная страница + 3D-карусель
- [ ] Этап 5 — каталог + страница книги + читалка
- [ ] Этап 6 — аутентификация + личный кабинет
- [ ] Этап 7 — админ-панель (нужен admin email)
- [ ] Этап 8 — полировка анимаций
- [ ] Этап 9 — деплой на Vercel

## Запуск

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
