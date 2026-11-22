import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { LandingPageSections } from "@/components/landing/LandingPageSections";
import { LiquidHero } from "@/components/lab/liquid/LiquidHero";

/** Lab variant 5: the homepage with a liquid chrome hero. Not for search engines. */
export const metadata: Metadata = {
  title: "Lab 5: liquid chrome hero",
  robots: { index: false, follow: false },
};

export default function LabLiquidChrome() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />
      <main className="overflow-x-clip">
        <LiquidHero />
        <LandingPageSections />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
