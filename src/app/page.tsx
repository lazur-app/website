import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";

const LandingAtmosphere = dynamic(() =>
  import("@/components/landing/LandingAtmosphere").then((m) => m.LandingAtmosphere),
);
const SpeedRace = dynamic(() =>
  import("@/components/landing/SpeedRace").then((m) => m.SpeedRace),
);
const TypingTaxSection = dynamic(() =>
  import("@/components/landing/TypingTaxSection").then((m) => m.TypingTaxSection),
);
const FluidTransform = dynamic(() =>
  import("@/components/landing/FluidTransform").then((m) => m.FluidTransform),
);
const PersonaSection = dynamic(() =>
  import("@/components/landing/PersonaSection").then((m) => m.PersonaSection),
);
const TestimonialWall = dynamic(() =>
  import("@/components/landing/TestimonialWall").then((m) => m.TestimonialWall),
);
const AppsStrip = dynamic(() =>
  import("@/components/landing/AppsStrip").then((m) => m.AppsStrip),
);
const DownloadCTA = dynamic(() =>
  import("@/components/DownloadCTA").then((m) => m.DownloadCTA),
);

export default function Home() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />
      <main className="relative">
        <LandingAtmosphere />
        <Hero />
        <SpeedRace />
        <TypingTaxSection />
        <FluidTransform />
        <PersonaSection />
        <TestimonialWall />
        <AppsStrip />
        <DownloadCTA />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
