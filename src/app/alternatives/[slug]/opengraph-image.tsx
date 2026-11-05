import { getAlternativesPage } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Alternatives compared";

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const page = getAlternativesPage((await params).slug);
  return renderSeoOg({ kicker: "Alternatives", title: page?.title ?? "Lazur" });
}
