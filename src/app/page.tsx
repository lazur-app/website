"use client";

import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Hero } from "@/components/Hero";
import { SpeedRace } from "@/components/landing/SpeedRace";
import { TypingTaxSection } from "@/components/landing/TypingTaxSection";
import { FluidTransform } from "@/components/landing/FluidTransform";
import { PersonaSection } from "@/components/landing/PersonaSection";
import { TestimonialWall } from "@/components/landing/TestimonialWall";
import { AppsStrip } from "@/components/landing/AppsStrip";
import { DownloadCTA } from "@/components/DownloadCTA";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export default function Home() {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />
      <main className="relative">
        <Hero />
        <SpeedRace />
        <TypingTaxSection />
        <FluidTransform />
        <PersonaSection />
        <TestimonialWall />
        <AppsStrip />
        <DownloadCTA />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
