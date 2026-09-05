import { CommandModeSection } from "@/components/landing/CommandModeSection";
import { PrivateSection } from "@/components/landing/PrivateSection";
import { HoursBackSection } from "@/components/landing/HoursBackSection";
import { SeeItWorkSection } from "@/components/landing/SeeItWorkSection";
import { WorksAnywhereSection } from "@/components/landing/WorksAnywhereSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CompetitorComparison } from "@/components/landing/CompetitorComparison";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { LandingLowerFlow } from "@/components/landing/LandingLowerFlow";

/**
 * Order is the visitor's question order: what is this → prove it → is it safe →
 * when would I use it → does it work where I work → do others stay → why not
 * the incumbent → what does it cost.
 */
export function LandingPageSections() {
  return (
    <LandingLowerFlow>
      <CommandModeSection />
      <PrivateSection />
      <HoursBackSection />
      <SeeItWorkSection />
      <WorksAnywhereSection />
      <TestimonialsSection />
      <CompetitorComparison />
      <LandingPricingSection />
      <FaqSection />
      <FinalCtaSection />
    </LandingLowerFlow>
  );
}
