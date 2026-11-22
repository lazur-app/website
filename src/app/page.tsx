import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { PuzzleHero } from "@/components/lab/puzzle/PuzzleHero";
import { PlainPageStyle } from "@/components/lab/puzzle/PlainPageStyle";
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
    <MarketingPageShell scrollIndicator={false}>
      <HomePageStructuredData />
      <PlainPageStyle />
      <ReferralCapture />
      <Navbar />
      <main className="overflow-x-clip">
        {/* The plain puzzle hero (also at /lab/3). The earlier ribbon hero is BuddyHero; the other designs are at /lab/1, /lab/2 and /lab/5. */}
        <PuzzleHero flat />
        <LandingPageSections />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
