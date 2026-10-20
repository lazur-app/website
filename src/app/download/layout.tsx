import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Lazur for macOS",
  description:
    "Download Lazur for Mac. Install your context-aware AI work assistant and start getting things done in any app.",
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
