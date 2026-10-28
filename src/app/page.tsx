import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { BuddyHero } from "@/components/buddy/BuddyHero";
import { Guide } from "@/components/buddy/Guide";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
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
      <main className="overflow-x-clip">
        <BuddyHero />
        <LandingPageSections />
      </main>
      <Footer />
      <Guide />
      <div className="h-20" aria-hidden />
    </MarketingPageShell>
  );
}
