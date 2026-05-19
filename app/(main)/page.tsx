import { HeroSection } from "@/components/home/HeroSection";
import { CounterSection } from "@/components/home/CounterSection";
import { CarouselPlaceholder } from "@/components/home/CarouselPlaceholder";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";

export default function HomePage() {
  return (
    <div className="relative">
      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <HeroSection />

      {/* Soft fade: hero → counter */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 -mt-32 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--background) 100%)",
        }}
      />

      {/* ── 2. Counters ─────────────────────────────────────── */}
      <div className="relative z-10 bg-background">
        <CounterSection />
      </div>

      {/* Fade: counter → carousel */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 h-16"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* ── 3. Carousel placeholder ──────────────────────────── */}
      <div className="relative z-10 bg-background">
        <CarouselPlaceholder />
      </div>

      {/* ── 4. Categories ───────────────────────────────────── */}
      <div className="relative z-10 bg-background">
        <CategoriesSection />
      </div>

      {/* Fade into quote */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 h-20"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* ── 5. Quote ────────────────────────────────────────── */}
      <div className="relative z-10">
        <QuoteSection />
      </div>

      {/* Fade back to background */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 h-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--background) 100%)",
        }}
      />

      {/* ── 6. How it works ─────────────────────────────────── */}
      <div className="relative z-10 bg-background">
        <HowItWorksSection />
      </div>
    </div>
  );
}
