"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(
          error.message.includes("already registered")
            ? "Этот email уже зарегистрирован"
            : error.message
        );
        return;
      }

      setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 text-green-500">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-foreground">Проверьте почту</h2>
        <p className="mt-2 text-sm text-foreground/50">
          Мы отправили ссылку для подтверждения на <strong>{email}</strong>.
          После подтверждения вы сможете войти.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-10 items-center rounded-full border border-foreground/12 px-5 text-sm text-foreground/60 hover:text-foreground"
        >
          Перейти ко входу
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Создать аккаунт
        </h1>
        <p className="mt-2 text-sm text-foreground/50">
          Бесплатно. Синхронизация прогресса на всех устройствах.
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
              autoComplete="new-password"
              placeholder="минимум 6 символов"
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">
            Подтвердите пароль
          </label>
          <input
            type={showPw ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="повторите пароль"
            className="w-full rounded-xl border border-foreground/12 bg-foreground/[0.04] px-4 py-2.5 text-sm text-foreground placeholder-foreground/30 outline-none transition-colors focus:border-[#0071e3] focus:bg-background"
          />
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
          Зарегистрироваться
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/45">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-[#0071e3] hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
