export const revalidate = 300; // Revalidate stats every 5 minutes

import { CarouselPlaceholder } from "@/components/home/CarouselPlaceholder";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { CounterSection } from "@/components/home/CounterSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { MostReadSection } from "@/components/home/MostReadSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { getLibraryStats, getBooks } from "@/lib/books";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Folio",
  url: "https://folio-ten-ashy.vercel.app",
  description: "Бесплатная онлайн-библиотека книг из общественного достояния",
  inLanguage: "ru",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://folio-ten-ashy.vercel.app/catalog?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  const [stats, popularBooks] = await Promise.all([
    getLibraryStats(),
    getBooks({ limit: 16 }), // is_featured + best-rated + most-read
  ]);

  const heroBooks = popularBooks
    .filter((b) => !!b.cover_url)
    .slice(0, 8)
    .map((b) => ({
      slug: b.slug,
      title: b.title_ru ?? b.title,
      author: b.authors ? (b.authors.name_ru ?? b.authors.name) : "",
      cover_url: b.cover_url,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="relative bg-background text-foreground">
      <HeroSection books={heroBooks} />

      <div aria-hidden className="pointer-events-none relative z-10 -mt-28 h-28 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 bg-background">
        <CounterSection bookCount={stats.bookCount} authorCount={stats.authorCount} />
      </div>

      <div aria-hidden className="pointer-events-none relative z-10 h-10 bg-gradient-to-b from-background to-transparent" />

      <div className="relative z-10 bg-background">
        <CarouselPlaceholder />
      </div>

      <div className="relative z-10 bg-background">
        <CategoriesSection />
      </div>

      <div aria-hidden className="pointer-events-none relative z-10 h-16 bg-gradient-to-b from-background to-transparent" />

      <div className="relative z-10">
        <QuoteSection />
      </div>

      <div aria-hidden className="pointer-events-none relative z-10 h-16 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 bg-background">
        <MostReadSection />
      </div>

      <div className="relative z-10 bg-background">
        <HowItWorksSection />
      </div>
    </div>
    </>
  );
}
