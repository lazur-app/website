import { getProblemPage } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A problem and how to fix it";

export default async function Og({ params }: { params: Promise<{ role: string; slug: string }> }) {
  const { role, slug } = await params;
  const page = getProblemPage(role, slug);
  return renderSeoOg({ kicker: page ? `${page.roleName} · problem and fix` : "Problems", title: page?.title ?? "Lazur" });
}
