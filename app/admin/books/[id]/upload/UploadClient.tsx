"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload, CheckCircle2, Trash2, FileText, BookOpen,
  ExternalLink, Loader2, AlertCircle,
} from "lucide-react";
import { uploadBookFile, removeBookFile } from "@/app/actions/upload-book";

type FileType = "txt" | "epub" | "pdf";

interface Book {
  id: number;
  slug: string;
  title: string;
  title_ru: string | null;
  language: string;
  txt_url: string | null;
  epub_url: string | null;
  pdf_url: string | null;
}

const FILE_TYPES: { type: FileType; label: string; hint: string; accept: string; icon: React.ReactNode }[] = [
  {
    type: "txt",
    label: "TXT — текст для чтения",
    hint: "Основной формат для онлайн-читалки. UTF-8, без лишней разметки.",
    accept: ".txt,text/plain",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    type: "epub",
    label: "EPUB — электронная книга",
    hint: "Для скачивания. До 50 МБ.",
    accept: ".epub,application/epub+zip",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    type: "pdf",
    label: "PDF — скачивание",
    hint: "PDF версия книги. До 50 МБ.",
    accept: ".pdf,application/pdf",
    icon: <FileText className="h-5 w-5" />,
  },
];

function FileSlot({
  bookId,
  bookSlug,
  type,
  label,
  hint,
  accept,
  icon,
  currentUrl,
}: {
  bookId: number;
  bookSlug: string;
  type: FileType;
  label: string;
  hint: string;
  accept: string;
  icon: React.ReactNode;
  currentUrl: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(currentUrl);

  async function handleFile(file: File) {
    setStatus("uploading");
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadBookFile(bookId, bookSlug, type, fd);
      if (res.success) {
        setUrl(res.url ?? null);
        setStatus("done");
      } else {
        setError(res.error ?? "Ошибка загрузки");
        setStatus("error");
      }
    } catch (e: any) {
      setError(e?.message ?? "Неизвестная ошибка");
      setStatus("error");
    }
  }

  async function handleRemove() {
    if (!confirm("Удалить файл?")) return;
    setStatus("uploading");
    await removeBookFile(bookId, bookSlug, type);
    setUrl(null);
    setStatus("idle");
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-foreground/50">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-foreground/40">{hint}</p>
        </div>
      </div>

      {url ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          <span className="flex-1 truncate text-xs text-emerald-600 dark:text-emerald-400">
            Файл загружен
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-foreground/40 hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            открыть
          </a>
          <button
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs text-rose-500/60 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            удалить
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragging
              ? "border-[#0071e3] bg-[#0071e3]/5"
              : "border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.03]"
          }`}
        >
          {status === "uploading" ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#0071e3]" />
              <p className="text-xs text-foreground/50">Загрузка… это может занять несколько секунд</p>
            </div>
          ) : status === "error" ? (
            <>
              <AlertCircle className="h-6 w-6 text-rose-500" />
              <p className="text-xs text-rose-500">{error}</p>
              <p className="text-xs text-foreground/40">Нажмите чтобы повторить</p>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-foreground/30" />
              <p className="text-sm text-foreground/50">
                Перетащите файл сюда или <span className="text-[#0071e3]">выберите</span>
              </p>
              <p className="text-xs text-foreground/30">Макс. 50 МБ</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function UploadClient({ book }: { book: Book }) {
  return (
    <div className="max-w-2xl space-y-4">
      {/* Instructions */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">TXT формат для читалки</p>
        <ul className="mt-1.5 list-disc pl-4 text-xs text-amber-600/80 dark:text-amber-400/80 space-y-0.5">
          <li>Кодировка UTF-8</li>
          <li>Главы разделены двойным переносом строки (пустая строка)</li>
          <li>Убрать служебные данные (сведения об издании, номера страниц PDF)</li>
          <li>Текст будет разбит на страницы автоматически (~1200 слов/стр.)</li>
        </ul>
      </div>

      {FILE_TYPES.map((ft) => (
        <FileSlot
          key={ft.type}
          bookId={book.id}
          bookSlug={book.slug}
          type={ft.type}
          label={ft.label}
          hint={ft.hint}
          accept={ft.accept}
          icon={ft.icon}
          currentUrl={
            ft.type === "txt" ? book.txt_url :
            ft.type === "epub" ? book.epub_url :
            book.pdf_url
          }
        />
      ))}

      <div className="flex gap-3 pt-2">
        <Link
          href={`/read/${book.slug}`}
          target="_blank"
          className="flex items-center gap-2 rounded-full bg-[#0071e3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0077ed]"
        >
          <ExternalLink className="h-4 w-4" />
          Проверить читалку
        </Link>
        <Link
          href={`/admin/books/${book.id}/edit`}
          className="rounded-full border border-foreground/12 px-5 py-2.5 text-sm text-foreground/60 hover:text-foreground"
        >
          Назад к книге
        </Link>
      </div>
    </div>
  );
}
