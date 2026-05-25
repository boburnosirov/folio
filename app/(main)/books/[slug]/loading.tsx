export default function BookLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-[260px_1fr]">
        <div className="aspect-[2/3] animate-pulse rounded-2xl bg-foreground/8" />
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-foreground/6" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-foreground/8" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-foreground/6" />
          <div className="space-y-2 pt-6">
            <div className="h-3 w-full animate-pulse rounded bg-foreground/5" />
            <div className="h-3 w-full animate-pulse rounded bg-foreground/5" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-foreground/5" />
          </div>
          <div className="flex gap-3 pt-6">
            <div className="h-11 w-32 animate-pulse rounded-full bg-foreground/8" />
            <div className="h-11 w-32 animate-pulse rounded-full bg-foreground/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
