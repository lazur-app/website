import { SpeedRace } from "@/components/landing/SpeedRace";
import { CommandModeSection } from "@/components/landing/CommandModeSection";
import { LeaderboardTeaserSection } from "@/components/landing/LeaderboardTeaserSection";
import { SectionDownloadBar } from "@/components/landing/SectionDownloadBar";
import { PRO_FROM_LABEL, TRIAL_LABEL, TRIAL_NOTE } from "@/lib/pricingPlans";

export function LandingPageSections() {
  return (
    <>
      <SpeedRace />
      <SectionDownloadBar
        price={TRIAL_LABEL}
        note={`${TRIAL_NOTE} · Voice writes ~4.9× faster than typing`}
      />

      <CommandModeSection />
      <SectionDownloadBar
        price={PRO_FROM_LABEL}
        note="50 Command Mode uses on Pro · 300 on Power"
      />

      <LeaderboardTeaserSection />
      <SectionDownloadBar
        price={TRIAL_LABEL}
        note="Download, sign in, and start your 7-day Pro trial"
      />
    </>
  );
}
