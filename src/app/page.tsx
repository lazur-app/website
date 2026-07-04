import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { HomePageStructuredData } from "@/components/seo/HomePageStructuredData";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_URL,
} from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Home() {
  return (
    <MarketingPageShell>
      <HomePageStructuredData />
      <ReferralCapture />
      <Navbar />
      <main>
        <Hero />
        <HowItWorksSection />
        <TestimonialsSection />
        <LandingPageSections />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
