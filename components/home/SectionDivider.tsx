/**
 * Invisible gradient bridge between sections —
 * blends the background of one section into the next.
 */
export function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none h-32 -mt-32 relative z-10"
      style={{
        background: flip
          ? "linear-gradient(to top, var(--background) 0%, transparent 100%)"
          : "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
      }}
    />
  );
}
