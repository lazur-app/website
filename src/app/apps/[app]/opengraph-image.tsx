import { getAppPage } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lazur in your Mac app";

export default async function Og({ params }: { params: Promise<{ app: string }> }) {
  const page = getAppPage((await params).app);
  return renderSeoOg({ kicker: page ? `Lazur in ${page.appName}` : "Apps", title: page?.title ?? "Lazur" });
}
