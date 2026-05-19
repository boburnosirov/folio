import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      {/* Placeholder — replaced in Stage 4 with full hero + 3D carousel */}
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-2 ring-primary/20">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1
            className="text-5xl font-semibold tracking-wide text-foreground sm:text-6xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Folio
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Бесплатная библиотека книг из общественного достояния.
            Читайте онлайн или скачивайте — легально и бесплатно.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalog"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-px transition-all shadow-md hover:shadow-primary/30"
            )}
          >
            Перейти в каталог <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-border hover:bg-muted/60 transition-all"
            )}
          >
            Создать аккаунт
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Этап 2 из 9 — базовый layout готов. Следующий шаг: база данных и импорт книг.
        </p>
      </div>
    </div>
  );
}
