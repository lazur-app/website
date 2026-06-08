"use client";

import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { BentoFeatures } from "@/components/BentoFeatures";
import { TrustStrip } from "@/components/TrustStrip";
import { DownloadCTA } from "@/components/DownloadCTA";
import { ReferralCTA } from "@/components/ReferralCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="page-backdrop pointer-events-none fixed inset-0 -z-20" aria-hidden />
      <ReferralCapture />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <BentoFeatures />
        <TrustStrip />
        <DownloadCTA />
        <ReferralCTA />
      </main>
      <Footer />
    </div>
  );
}
