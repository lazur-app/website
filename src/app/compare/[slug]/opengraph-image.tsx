import { getComparePage } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Comparison";

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const page = getComparePage((await params).slug);
  return renderSeoOg({ kicker: page?.kind === "x-vs-y" ? "Head to head" : "Comparison", title: page?.title ?? "Lazur" });
}
