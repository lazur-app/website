import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { ChangelogFeed } from "@/components/changelog/ChangelogFeed";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Changelog | Lazur",
  description: "Every Lazur release for Mac, in plain words: what's new, what got better and what we fixed.",
  alternates: { canonical: `${SITE_URL}/changelog` },
};

export default function ChangelogPage() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <ChangelogFeed />
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
