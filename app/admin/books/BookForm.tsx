"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Category {
  slug: string;
  name: string;
}

interface DefaultValues {
  title?: string;
  title_ru?: string;
  author_name?: string;
  category_slug?: string | null;
  language?: string;
  year_published?: number | null;
  description?: string | null;
  cover_url?: string | null;
  gutenberg_id?: number | null;
  is_featured?: boolean;
  is_public?: boolean;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  defaultValues?: DefaultValues;
  submitLabel?: string;
}

const LANGUAGES = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
  { value: "uz", label: "Ўзбекча" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "other", label: "Другой" },
];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {children}
      {hint && <p className="text-xs text-foreground/40">{hint}</p>}
    </div>
  );
}

const inputCls =
  "rounded-xl border border-foreground/12 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-[#0071e3]/50 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/10";

export default function BookForm({
  action,
  categories,
  defaultValues: dv = {},
  submitLabel = "Сохранить",
}: Props) {
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Название (оригинал) *">
          <input
            name="title"
            required
            defaultValue={dv.title}
            placeholder="War and Peace"
            className={inputCls}
          />
        </Field>

        <Field label="Название на русском">
          <input
            name="title_ru"
            defaultValue={dv.title_ru ?? ""}
            placeholder="Война и мир"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Автор" hint="Будет создан новый, если не найден">
          <input
            name="author_name"
            defaultValue={dv.author_name ?? ""}
            placeholder="Лев Толстой"
            className={inputCls}
          />
        </Field>

        <Field label="Категория">
          <select
            name="category_slug"
            defaultValue={dv.category_slug ?? ""}
            className={inputCls}
          >
            <option value="">— не выбрана —</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Язык">
          <select
            name="language"
            defaultValue={dv.language ?? "ru"}
            className={inputCls}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Год издания">
          <input
            name="year_published"
            type="number"
            min={0}
            max={2100}
            defaultValue={dv.year_published ?? ""}
            placeholder="1869"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Описание">
        <textarea
          name="description"
          rows={3}
          defaultValue={dv.description ?? ""}
          placeholder="Краткое описание книги..."
          className={`${inputCls} resize-none`}
        />
      </Field>

      <Field label="URL обложки">
        <input
          name="cover_url"
          type="url"
          defaultValue={dv.cover_url ?? ""}
          placeholder="https://upload.wikimedia.org/..."
          className={inputCls}
        />
      </Field>

      <Field label="Gutenberg ID" hint="Числовой ID из Project Gutenberg (для чтения онлайн)">
        <input
          name="gutenberg_id"
          type="number"
          min={1}
          defaultValue={dv.gutenberg_id ?? ""}
          placeholder="2600"
          className={inputCls}
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/70">
          <input
            name="is_public"
            type="checkbox"
            defaultChecked={dv.is_public ?? true}
            className="h-4 w-4 rounded accent-[#0071e3]"
          />
          Опубликовано
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground/70">
          <input
            name="is_featured"
            type="checkbox"
            defaultChecked={dv.is_featured ?? false}
            className="h-4 w-4 rounded accent-[#0071e3]"
          />
          Рекомендуемая (попадёт в «Книги месяца»)
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-foreground/8 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-[#0071e3] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-[#0077ed] disabled:opacity-60"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
        <Link
          href="/admin/books"
          className="rounded-full border border-foreground/12 px-5 py-2.5 text-sm font-semibold text-foreground/60 hover:border-foreground/20 hover:text-foreground"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
