import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lazur | Next-Gen AI Dictation",
  description: "Experience the future of dictation with Lazur.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-black relative`}>
        {/* Consistent z-index wrapper */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
