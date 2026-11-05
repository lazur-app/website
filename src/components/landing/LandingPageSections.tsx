import { EverydayThings, ShowMeHow, TalkItTypes, WorksWhileYouWork, YoureInCharge } from "@/components/buddy/BuddySections";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

/**
 * After the hero film, one short loop per idea: step-by-step guiding, everyday commands (by
 * persona), dictation, background jobs and privacy, then proof and price. The dictation
 * comparisons live on /compare, off the homepage.
 */
export function LandingPageSections() {
  return (
    <>
      <ShowMeHow />
      <EverydayThings />
      <TalkItTypes />
      <WorksWhileYouWork />
      <YoureInCharge />
      <TestimonialsSection />
      <LandingPricingSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
