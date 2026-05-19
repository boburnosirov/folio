import { HeroSection } from "@/components/home/HeroSection";
import { CounterSection } from "@/components/home/CounterSection";
import { CarouselPlaceholder } from "@/components/home/CarouselPlaceholder";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CounterSection />
      <CarouselPlaceholder />
      <CategoriesSection />
      <QuoteSection />
      <HowItWorksSection />
    </>
  );
}
