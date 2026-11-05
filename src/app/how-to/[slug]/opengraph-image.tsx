import { getHowTo } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lazur how-to guide";

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const page = getHowTo((await params).slug);
  return renderSeoOg({ kicker: page ? `How-to · ${page.appName} for Mac` : "How-to", title: page?.title ?? "Lazur" });
}
