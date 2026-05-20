"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(
          error.message.includes("Invalid login")
            ? "Неверный email или пароль"
            : error.message
        );
        return;
      }

      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Добро пожаловать
        </h1>
        <p className="mt-2 text-sm text-foreground/50">
          Войдите, чтобы читать и сохранять прогресс
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-foreground/12 bg-foreground/[0.04] px-4 py-2.5 text-sm text-foreground placeholder-foreground/30 outline-none transition-colors focus:border-[#0071e3] focus:bg-background"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">
            Пароль
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-foreground/12 bg-foreground/[0.04] px-4 py-2.5 pr-10 text-sm text-foreground placeholder-foreground/30 outline-none transition-colors focus:border-[#0071e3] focus:bg-background"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground/60"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 flex h-11 items-center justify-center gap-2 rounded-full bg-[#0071e3] text-sm font-semibold text-white transition-all hover:bg-[#0077ed] disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Войти
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/45">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-[#0071e3] hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm animate-pulse space-y-4"><div className="h-8 rounded bg-foreground/8" /><div className="h-10 rounded-xl bg-foreground/8" /><div className="h-10 rounded-xl bg-foreground/8" /><div className="h-11 rounded-full bg-foreground/8" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
