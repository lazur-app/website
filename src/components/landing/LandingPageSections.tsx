import { SeeItWorkSection } from "@/components/landing/SeeItWorkSection";
import { HoursBackSection } from "@/components/landing/HoursBackSection";
import { PrivateSection } from "@/components/landing/PrivateSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { LandingLowerFlow } from "@/components/landing/LandingLowerFlow";

export function LandingPageSections() {
  return (
    <LandingLowerFlow>
      <SeeItWorkSection />
      <HoursBackSection />
      <PrivateSection />
      <LandingPricingSection />
    </LandingLowerFlow>
  );
}
