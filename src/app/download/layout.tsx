import type { Metadata } from "next";
import { SITE_URL, shareImages } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Download Lazur for macOS",
  description:
    "Download Lazur for Mac. Install your context-aware AI work assistant and start getting things done in any app.",
  openGraph: {
    title: "Get Lazur on your Mac",
    description: "One download. Hold two keys and talk, in any app. Free 3-day Pro trial, no card.",
    type: "website",
    url: `${SITE_URL}/download`,
    images: shareImages("download").openGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Lazur on your Mac",
    description: "One download. Hold two keys and talk, in any app. Free 3-day Pro trial, no card.",
    images: shareImages("download").twitter,
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
