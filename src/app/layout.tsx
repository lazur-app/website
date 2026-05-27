import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lazur — Your voice, upgraded",
  description:
    "The fastest way to think in text. Lazur turns messy speech into polished writing — everywhere you type.",
  openGraph: {
    title: "Lazur — Your voice, upgraded",
    description:
      "Speak naturally. Write brilliantly. Lazur transforms your voice into prose you'd actually send.",
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
      <body className={`${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
