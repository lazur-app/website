import { CodingPromptingSection } from "@/components/landing/CodingPromptingSection";
import { HoursBackSection } from "@/components/landing/HoursBackSection";
import { CommandModeSection } from "@/components/landing/CommandModeSection";
import { WorksEverywhereSection } from "@/components/landing/WorksEverywhereSection";
import { PrivateSection } from "@/components/landing/PrivateSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";

export function LandingPageSections() {
  return (
    <>
      <CodingPromptingSection />
      <HoursBackSection />
      <CommandModeSection />
      <WorksEverywhereSection />
      <PrivateSection />
      <LandingPricingSection />
    </>
  );
}
