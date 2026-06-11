import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { clashDisplay, openSauceOne } from "@/lib/fonts";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lazur — Your voice, upgraded",
  description:
    "Speak naturally. Lazur reads what you meant and writes it where you're typing — in any app.",
  openGraph: {
    title: "Lazur — Your voice, upgraded",
    description:
      "What you said, what you meant. Lazur turns messy speech into writing you'd actually send.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSauceOne.variable} ${clashDisplay.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
