import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BookNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-6xl">📖</p>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Книга не найдена</h1>
      <p className="max-w-sm text-base text-foreground/55">
        Возможно, она была удалена или адрес указан неверно.
      </p>
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] dark:bg-white dark:text-black"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Вернуться в каталог
      </Link>
    </div>
  );
}
