import { ThreeJobs, YoureInCharge } from "@/components/buddy/BuddySections";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

/**
 * After the hero (the flow, the apps it works in, the films): the three jobs (dictates, does,
 * teaches) and privacy, then proof and price. The dictation comparisons live on /compare.
 */
export function LandingPageSections() {
  return (
    <>
      <ThreeJobs />
      <YoureInCharge />
      <TestimonialsSection />
      <LandingPricingSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
