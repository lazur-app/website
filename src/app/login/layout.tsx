import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo/noindex";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Log in | Lazur",
  description: "Sign in to your Lazur account.",
  robots: noindexMetadata.robots,
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
