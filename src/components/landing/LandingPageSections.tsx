import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { SeeItWorkSection } from "@/components/landing/SeeItWorkSection";
import { WorksAnywhereSection } from "@/components/landing/WorksAnywhereSection";
import { HoursBackSection } from "@/components/landing/HoursBackSection";
import { PrivateSection } from "@/components/landing/PrivateSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { LandingLowerFlow } from "@/components/landing/LandingLowerFlow";

export function LandingPageSections() {
  return (
    <LandingLowerFlow>
      <TestimonialsSection />
      <SeeItWorkSection />
      <HoursBackSection />
      <WorksAnywhereSection />
      <PrivateSection />
      <LandingPricingSection />
      <FaqSection />
      <FinalCtaSection />
    </LandingLowerFlow>
  );
}
