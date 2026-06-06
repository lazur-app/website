import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download Lazur for macOS",
  description:
    "Download Lazur for Mac. Install steps for the unsigned beta build, including Gatekeeper and permissions.",
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
