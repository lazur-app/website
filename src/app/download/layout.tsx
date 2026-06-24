import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Lazur for macOS",
  description:
    "Download Lazur for Mac. Install, sign in, and start dictating in any app.",
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
