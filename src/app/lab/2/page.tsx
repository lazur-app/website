import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
import { FlockHero } from "@/components/lab/flock/FlockHero";

/** Experimental homepage variant: the "cursor flock" hero. Not linked from anywhere. */
export const metadata: Metadata = {
  title: "Lab 2: cursor flock",
  robots: { index: false, follow: false },
};

export default function LabCursorFlockPage() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />
      <main className="overflow-x-clip">
        <FlockHero />
        <LandingPageSections />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
