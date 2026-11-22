import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
import { PuzzleHero } from "@/components/lab/puzzle/PuzzleHero";
import { PlainPageStyle } from "@/components/lab/puzzle/PlainPageStyle";

/** Lab variant 3: the "Puzzle" hero in plain colours (no metal on the pieces or the button). Not linked from anywhere, not indexed. */
export const metadata: Metadata = {
  title: "Lab 3: puzzle hero, plain colours",
  robots: { index: false, follow: false },
};

export default function LabPuzzlePlainPage() {
  return (
    <MarketingPageShell scrollIndicator={false}>
      <PlainPageStyle />
      <ReferralCapture />
      <Navbar />
      <main className="overflow-x-clip">
        <PuzzleHero flat />
        <LandingPageSections />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
