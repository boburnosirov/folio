"use client";

import { cn } from "@/lib/utils";

export type CoverVariant =
  | "anna"
  | "crime"
  | "babur"
  | "austen"
  | "sherlock"
  | "navai"
  | "verne"
  | "franklin"
  | "gogol"
  | "chekhov"
  | "hugo"
  | "marcus";

type BookCoverProps = {
  title: string;
  author: string;
  variant: CoverVariant;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  back?: boolean;
  className?: string;
};

const COVER_STYLES: Record<
  CoverVariant,
  { base: string; accent: string; motif: "rails" | "moon" | "garden" | "portrait" | "ship" | "stars" | "arch" | "laurel" }
> = {
  anna: { base: "from-[#7d1f22] via-[#a83a32] to-[#221014]", accent: "#f0c36a", motif: "rails" },
  crime: { base: "from-[#182339] via-[#273c62] to-[#0b1020]", accent: "#d7b56d", motif: "moon" },
  babur: { base: "from-[#175347] via-[#2b806d] to-[#10241f]", accent: "#edc15e", motif: "garden" },
  austen: { base: "from-[#efe1d2] via-[#d8bba3] to-[#7b4b44]", accent: "#7b2f3b", motif: "portrait" },
  sherlock: { base: "from-[#243127] via-[#4c6345] to-[#121a14]", accent: "#d9bd73", motif: "moon" },
  navai: { base: "from-[#1c4870] via-[#256b98] to-[#10253a]", accent: "#f0c15f", motif: "arch" },
  verne: { base: "from-[#14334d] via-[#246480] to-[#071722]", accent: "#dbb66e", motif: "ship" },
  franklin: { base: "from-[#6a3c18] via-[#a06126] to-[#241207]", accent: "#f0c36a", motif: "laurel" },
  gogol: { base: "from-[#33233f] via-[#604278] to-[#150d1e]", accent: "#d5b36e", motif: "moon" },
  chekhov: { base: "from-[#75412d] via-[#b66b45] to-[#25120c]", accent: "#efd0a1", motif: "portrait" },
  hugo: { base: "from-[#1b273f] via-[#566179] to-[#0d1018]", accent: "#e5c278", motif: "stars" },
  marcus: { base: "from-[#312d2a] via-[#6b6256] to-[#141311]", accent: "#e2c178", motif: "laurel" },
};

const SIZES = {
  xs: "h-20 w-14 rounded-[6px]",
  sm: "h-28 w-20 rounded-[8px]",
  md: "h-40 w-28 rounded-[10px]",
  lg: "h-52 w-36 rounded-[12px]",
  xl: "h-64 w-44 rounded-[14px]",
};

function CoverMotif({
  motif,
  accent,
}: {
  motif: BookCoverProps["variant"] extends infer _ ? (typeof COVER_STYLES)[CoverVariant]["motif"] : never;
  accent: string;
}) {
  if (motif === "rails") {
    return (
      <div className="absolute inset-x-5 bottom-8 h-20 opacity-70">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/45" />
        <div className="absolute left-[35%] top-0 h-full w-px -rotate-12 bg-white/35" />
        <div className="absolute right-[35%] top-0 h-full w-px rotate-12 bg-white/35" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute h-px bg-white/35" style={{ left: 8 + i * 3, right: 8 + i * 3, top: 12 + i * 14 }} />
        ))}
      </div>
    );
  }

  if (motif === "moon") {
    return (
      <div className="absolute right-5 top-7 h-10 w-10 rounded-full bg-white/80 shadow-[0_0_28px_rgba(255,255,255,0.45)]">
        <div className="absolute -right-1 -top-1 h-10 w-10 rounded-full bg-black/20" />
      </div>
    );
  }

  if (motif === "garden" || motif === "arch") {
    return (
      <div className="absolute inset-x-5 bottom-7 h-24 opacity-75">
        <div className="absolute inset-x-1 bottom-0 h-20 rounded-t-full border-2" style={{ borderColor: accent }} />
        <div className="absolute left-1/2 bottom-0 h-20 w-px -translate-x-1/2" style={{ background: accent }} />
        <div className="absolute bottom-8 left-2 right-2 h-px" style={{ background: accent }} />
      </div>
    );
  }

  if (motif === "ship") {
    return (
      <div className="absolute inset-x-4 bottom-9 h-20 opacity-75">
        <div className="absolute bottom-2 left-2 right-2 h-5 rounded-b-full bg-white/45" />
        <div className="absolute bottom-7 left-1/2 h-12 w-px -translate-x-1/2 bg-white/70" />
        <div className="absolute bottom-9 left-1/2 h-9 w-9 -translate-x-[2px] border-l-[28px] border-y-[16px] border-y-transparent border-l-white/55" />
      </div>
    );
  }

  if (motif === "portrait") {
    return (
      <div className="absolute left-1/2 top-[32%] h-20 w-14 -translate-x-1/2 rounded-full border bg-white/25" style={{ borderColor: accent }}>
        <div className="absolute left-1/2 top-5 h-8 w-8 -translate-x-1/2 rounded-full bg-black/25" />
        <div className="absolute bottom-2 left-1/2 h-8 w-11 -translate-x-1/2 rounded-t-full bg-black/20" />
      </div>
    );
  }

  if (motif === "stars") {
    return (
      <div className="absolute inset-4 opacity-80">
        {[12, 34, 55, 74, 88].map((top, i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-white/80" style={{ top: `${top}%`, left: `${18 + i * 16}%` }} />
        ))}
        <div className="absolute bottom-8 left-1/2 h-16 w-px -rotate-12 bg-white/50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-x-5 bottom-8 flex justify-center gap-5 opacity-70">
      <div className="h-20 w-8 rounded-full border-l-2" style={{ borderColor: accent }} />
      <div className="h-20 w-8 rounded-full border-r-2" style={{ borderColor: accent }} />
    </div>
  );
}

export function BookCover({
  title,
  author,
  variant,
  size = "md",
  back = false,
  className,
}: BookCoverProps) {
  const style = COVER_STYLES[variant];

  if (back) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border border-black/10 bg-gradient-to-br from-[#d9c8a4] via-[#b99b68] to-[#6f5633] shadow-2xl shadow-black/20 dark:border-white/10",
          SIZES[size],
          className
        )}
      >
        <div className="absolute inset-y-0 left-0 w-[12%] bg-black/18" />
        <div className="absolute inset-x-4 top-5 h-px bg-black/20" />
        <div className="absolute inset-x-4 bottom-5 h-px bg-black/20" />
        <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/25" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-black/10 bg-gradient-to-br shadow-2xl shadow-black/25 ring-1 ring-white/20 dark:border-white/10",
        style.base,
        SIZES[size],
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 w-[12%] bg-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_18%,rgba(255,255,255,.32),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,.18),transparent_34%,rgba(0,0,0,.28))]" />
      <CoverMotif motif={style.motif} accent={style.accent} />
      <div className="absolute inset-x-3 top-4 text-center">
        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/60">{author}</p>
      </div>
      <div className="absolute inset-x-3 bottom-4 text-center">
        <p className="font-heading text-[13px] font-semibold leading-[1.05] text-white drop-shadow-sm">{title}</p>
      </div>
      <div className="absolute inset-x-4 top-[24%] h-px" style={{ background: style.accent, opacity: 0.65 }} />
    </div>
  );
}
