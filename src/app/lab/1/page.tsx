import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
import { PuzzleHero } from "@/components/lab/puzzle/PuzzleHero";

/** Lab variant 1: the homepage with the "Puzzle" hero. Not linked from anywhere, not indexed. */
export const metadata: Metadata = {
  title: "Lab 1: puzzle hero",
  robots: { index: false, follow: false },
};

export default function LabPuzzlePage() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />
      <main className="overflow-x-clip">
        <PuzzleHero />
        <LandingPageSections />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
