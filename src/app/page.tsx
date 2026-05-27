"use client";

import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { ProductDemo } from "@/components/ProductDemo";
import { WorksEverywhere } from "@/components/WorksEverywhere";
import { UniversalApps } from "@/components/UniversalApps";
import { BentoFeatures } from "@/components/BentoFeatures";
import { WaitlistCTA } from "@/components/WaitlistCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ReferralCapture />
      <Navbar />
      <main>
        <Hero />
        <ProductDemo />
        <WorksEverywhere />
        <UniversalApps />
        <BentoFeatures />
        <WaitlistCTA />
      </main>
      <Footer />
    </div>
  );
}
