import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { RealExamplesSection } from "@/components/landing/RealExamplesSection";
import { PersonaSection } from "@/components/landing/PersonaSection";
import { FaqSection } from "@/components/landing/FaqSection";
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
        <RealExamplesSection />
        <PersonaSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
