import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { DataFast } from "@/components/analytics/DataFast";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleAnalyticsRouteTracker } from "@/components/analytics/GoogleAnalyticsRouteTracker";
import { Providers } from "@/components/Providers";
import { clashDisplay, caveat, garamond, openSauceOne } from "@/lib/fonts";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_DESCRIPTION,
  shareImages,
  SITE_URL,
} from "@/lib/seo/constants";
import "./globals.css";

// Self-hosted (see src/fonts/google/README.md).
const geistMono = localFont({
  src: [{ path: "../fonts/google/geist-mono/geist-mono-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: OG_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: shareImages("home").openGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: OG_DESCRIPTION,
    images: shareImages("home").twitter,
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdfb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <DataFast />
      </head>
      <body
        className={`${openSauceOne.variable} ${clashDisplay.variable} ${caveat.variable} ${garamond.variable} ${geistMono.variable} site-lowercase font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <GoogleAnalyticsRouteTracker />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
