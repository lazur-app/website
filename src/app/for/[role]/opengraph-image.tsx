import { getRolePage } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lazur for your job";

export default async function Og({ params }: { params: Promise<{ role: string }> }) {
  const page = getRolePage((await params).role);
  return renderSeoOg({ kicker: page ? `Lazur for ${page.roleName.toLowerCase()}` : "Roles", title: page?.title ?? "Lazur" });
}
