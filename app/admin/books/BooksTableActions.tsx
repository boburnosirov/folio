"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteBook, toggleBookVisibility } from "../actions";

interface Props {
  bookId: number;
  isPublic: boolean;
}

export default function BooksTableActions({ bookId, isPublic }: Props) {
  const [deleting, startDelete] = useTransition();
  const [toggling, startToggle] = useTransition();

  const handleDelete = () => {
    if (!confirm("Удалить книгу? Это действие нельзя отменить.")) return;
    startDelete(async () => {
      await deleteBook(bookId);
    });
  };

  const handleToggle = () => {
    startToggle(async () => {
      await toggleBookVisibility(bookId, !isPublic);
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={isPublic ? "Скрыть" : "Опубликовать"}
        className="rounded-lg p-1.5 text-foreground/35 hover:bg-foreground/[0.06] hover:text-foreground disabled:opacity-40"
      >
        {isPublic ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </button>
      <Link
        href={`/admin/books/${bookId}/edit`}
        className="rounded-lg p-1.5 text-foreground/35 hover:bg-foreground/[0.06] hover:text-foreground"
        title="Редактировать"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Удалить"
        className="rounded-lg p-1.5 text-foreground/35 hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
