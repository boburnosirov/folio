"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Trash2 } from "lucide-react";
import { submitRating, deleteRating } from "@/app/actions/ratings";
import type { BookRating } from "@/lib/types/database";

interface Props {
  bookId: number;
  bookTitle: string;
  ratings: BookRating[];
  userRating: BookRating | null;
  avgRating: number;
  ratingCount: number;
  isLoggedIn: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function RatingsSection({ bookId, bookTitle, ratings, userRating, avgRating, ratingCount, isLoggedIn }: Props) {
  const [sliderValue, setSliderValue] = useState<number>(userRating?.rating ?? 7);
  const [comment, setComment] = useState(userRating?.comment ?? "");
  const [localRatings, setLocalRatings] = useState<BookRating[]>(ratings);
  const [localAvg, setLocalAvg] = useState(avgRating);
  const [localCount, setLocalCount] = useState(ratingCount);
  const [localUserRating, setLocalUserRating] = useState<BookRating | null>(userRating);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(!userRating);

  function recalcAvg(list: BookRating[]) {
    if (list.length === 0) return 0;
    return Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10;
  }

  function handleSubmit() {
    startTransition(async () => {
      const res = await submitRating(bookId, sliderValue, comment);
      if (res.success) {
        const fakeRating: BookRating = {
          id: Date.now(),
          user_id: "me",
          book_id: bookId,
          rating: sliderValue,
          comment: comment.trim() || null,
          created_at: new Date().toISOString(),
        };
        const updated = localUserRating
          ? localRatings.map((r) => (r.user_id === "me" || r === localUserRating ? fakeRating : r))
          : [fakeRating, ...localRatings];
        setLocalRatings(updated);
        setLocalUserRating(fakeRating);
        setLocalAvg(recalcAvg(updated));
        setLocalCount(updated.length);
        setShowForm(false);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteRating(bookId);
      const updated = localRatings.filter((r) => r !== localUserRating);
      setLocalRatings(updated);
      setLocalUserRating(null);
      setLocalAvg(recalcAvg(updated));
      setLocalCount(updated.length);
      setSliderValue(7);
      setComment("");
      setShowForm(true);
    });
  }

  const ratingColor = sliderValue >= 8 ? "text-emerald-500" : sliderValue >= 5 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Отзывы и оценки
        </h2>
        {localCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {localAvg.toFixed(1)}
            </span>
            <span className="text-xs text-foreground/45">/ 10 · {localCount} оценок</span>
          </div>
        )}
      </div>

      {/* Rating form */}
      {isLoggedIn && (
        <div className="mb-8 rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-5">
          {localUserRating && !showForm ? (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Ваша оценка: <span className={`${ratingColor} text-lg`}>{localUserRating.rating}/10</span></p>
                {localUserRating.comment && (
                  <p className="mt-1 text-sm text-foreground/60">{localUserRating.comment}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSliderValue(localUserRating.rating); setComment(localUserRating.comment ?? ""); setShowForm(true); }}
                  className="rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground/60 hover:bg-foreground/6 hover:text-foreground transition-colors"
                >
                  Изменить
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="rounded-full border border-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm font-semibold text-foreground">
                {localUserRating ? "Изменить оценку" : `Оцените «${bookTitle}»`}
              </p>

              {/* Slider */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-foreground/45">Оценка</span>
                  <span className={`text-2xl font-bold tabular-nums ${ratingColor}`}>
                    {sliderValue}<span className="text-base font-normal text-foreground/30">/10</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full accent-[#0071e3] cursor-pointer"
                  style={{ height: "6px" }}
                />
                <div className="mt-1 flex justify-between text-[10px] text-foreground/25">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ваш отзыв (необязательно)..."
                rows={3}
                className="w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 text-sm text-foreground placeholder-foreground/30 outline-none focus:border-[#0071e3]/50 resize-none transition-colors"
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-full bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[.98] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isPending ? "Сохранение..." : "Отправить"}
                </button>
                {localUserRating && (
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-full border border-foreground/10 px-4 py-2 text-sm text-foreground/60 hover:bg-foreground/6 transition-colors"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoggedIn && (
        <div className="mb-6 rounded-2xl border border-foreground/8 bg-foreground/[0.03] p-5 text-center">
          <p className="text-sm text-foreground/55">
            <a href="/login" className="font-semibold text-[#0071e3] hover:underline">Войдите</a>, чтобы оставить оценку и отзыв
          </p>
        </div>
      )}

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {localRatings.length === 0 ? (
            <p className="text-sm text-foreground/35 text-center py-8">
              Оценок пока нет. Будьте первым!
            </p>
          ) : (
            localRatings.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0071e3]/30 to-[#0071e3]/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#0071e3]">★</span>
                    </div>
                    <span className={`text-base font-bold tabular-nums ${
                      r.rating >= 8 ? "text-emerald-500" : r.rating >= 5 ? "text-amber-500" : "text-rose-500"
                    }`}>
                      {r.rating}/10
                    </span>
                  </div>
                  <span className="text-[11px] text-foreground/30">{formatDate(r.created_at)}</span>
                </div>
                {r.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{r.comment}</p>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
