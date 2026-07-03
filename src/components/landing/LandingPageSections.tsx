import { CodingPromptingSection } from "@/components/landing/CodingPromptingSection";
import { HoursBackSection } from "@/components/landing/HoursBackSection";
import { CommandModeSection } from "@/components/landing/CommandModeSection";
import { WorksEverywhereSection } from "@/components/landing/WorksEverywhereSection";
import { PrivateSection } from "@/components/landing/PrivateSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { LandingLowerFlow } from "@/components/landing/LandingLowerFlow";

export function LandingPageSections() {
  return (
    <LandingLowerFlow>
      <CodingPromptingSection />
      <HoursBackSection />
      <CommandModeSection />
      <WorksEverywhereSection />
      <PrivateSection />
      <LandingPricingSection />
    </LandingLowerFlow>
  );
}
