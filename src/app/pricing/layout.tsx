import type { Metadata } from "next";
import { SITE_URL, shareImages } from "@/lib/seo/constants";

// The pricing page itself is a client component, so its link preview lives here.
export const metadata: Metadata = {
  openGraph: {
    title: "Lazur pricing: 3 days free, then $18 a month",
    description: "Three simple plans. Every plan starts with a free 3-day Pro trial, no credit card. Cancel anytime.",
    type: "website",
    url: `${SITE_URL}/pricing`,
    images: shareImages("pricing").openGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazur pricing: 3 days free, then $18 a month",
    description: "Three simple plans. Every plan starts with a free 3-day Pro trial, no credit card.",
    images: shareImages("pricing").twitter,
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
