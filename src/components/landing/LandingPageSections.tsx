import { EverydayThings, ShowMeHow, YoureInCharge } from "@/components/buddy/BuddySections";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

/**
 * Short on purpose: the hero demo already shows pointing, timers, jobs and typing. After it, only
 * what it doesn't show (step-by-step guiding, the everyday commands), one line of privacy, then
 * proof and price. The dictation comparisons live on /compare, off the homepage.
 */
export function LandingPageSections() {
  return (
    <>
      <ShowMeHow />
      <EverydayThings />
      <YoureInCharge />
      <TestimonialsSection />
      <LandingPricingSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
