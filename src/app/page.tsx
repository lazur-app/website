import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

export default function Home() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />
      <main>
        <Hero />
        <HowItWorksSection />
        <MetricsStrip />
        <LandingPageSections />
        <FinalCtaSection />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
