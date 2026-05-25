export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 animate-pulse space-y-3">
          <div className="h-4 w-24 rounded-full bg-foreground/8" />
          <div className="h-12 w-72 rounded-xl bg-foreground/8" />
          <div className="h-4 w-32 rounded-full bg-foreground/6" />
        </div>
        <div className="mb-8 h-12 max-w-xl animate-pulse rounded-full bg-foreground/6" />
        <div className="mb-8 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-foreground/6" />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[2/3] animate-pulse rounded-[10px] bg-foreground/8" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-foreground/6" />
              <div className="h-2 w-1/2 animate-pulse rounded bg-foreground/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
