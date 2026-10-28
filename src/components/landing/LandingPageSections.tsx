import {
  BackgroundJobs,
  EverydayThings,
  SeesPointsDoes,
  ShowMeHow,
  TypesForYou,
  YoureInCharge,
} from "@/components/buddy/BuddySections";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

/**
 * The AI buddy story, in the visitor's question order: what is it (hero demo) → what can it do
 * (see, point, do; guide; jobs; everyday; typing) → can I trust it → do others like it → what does
 * it cost. The dictation comparisons live on /compare, off the homepage.
 */
export function LandingPageSections() {
  return (
    <>
      <SeesPointsDoes />
      <ShowMeHow />
      <BackgroundJobs />
      <EverydayThings />
      <TypesForYou />
      <YoureInCharge />
      <TestimonialsSection />
      <LandingPricingSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
