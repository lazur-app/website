import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono } from "next/font/google";
import { DataFast } from "@/components/analytics/DataFast";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleAnalyticsRouteTracker } from "@/components/analytics/GoogleAnalyticsRouteTracker";
import { Providers } from "@/components/Providers";
import { clashDisplay, caveat, openSauceOne } from "@/lib/fonts";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_DESCRIPTION,
  OG_IMAGE,
  SITE_URL,
} from "@/lib/seo/constants";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  openGraph: {
    title: DEFAULT_TITLE,
    description: OG_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
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
        className={`${openSauceOne.variable} ${clashDisplay.variable} ${caveat.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <GoogleAnalyticsRouteTracker />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
