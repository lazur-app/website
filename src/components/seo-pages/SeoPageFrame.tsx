import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentClickTracker } from "./ContentAnalytics";
import { StickyCta } from "./StickyCta";

/** Navbar, backdrop, footer and JSON-LD around every SEO page and hub. */
export function SeoPageFrame({ children, schema }: { children: ReactNode; schema?: Record<string, unknown>[] }) {
  return (
    <MarketingPageShell>
      {schema && schema.length > 0 ? <JsonLd data={schema} /> : null}
      <ReferralCapture />
      <Navbar />
      <main className="seo-main">
        {children}
        <ContentClickTracker />
        <StickyCta />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
