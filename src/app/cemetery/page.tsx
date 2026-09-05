import type { Metadata } from "next";
import { CemeteryPage } from "@/components/cemetery/CemeteryPage";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Keyboard Cemetery | Lazur",
  description:
    "People who stopped typing and started speaking. See retired keyboards, word counts, and how much they write by voice.",
  alternates: {
    canonical: `${SITE_URL}/cemetery`,
  },
  openGraph: {
    title: "Keyboard Cemetery | Lazur",
    description:
      "These people stopped typing. The words kept going. Retire your keyboard after you speak enough with Lazur.",
    url: `${SITE_URL}/cemetery`,
  },
};

export default function CemeteryRoute() {
  return <CemeteryPage />;
}
