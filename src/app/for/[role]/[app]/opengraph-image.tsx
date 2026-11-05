import { getRoleAppPage } from "@/lib/seo-pages/load";
import { OG_SIZE, renderSeoOg } from "@/lib/seo-pages/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lazur for your job, in your app";

export default async function Og({ params }: { params: Promise<{ role: string; app: string }> }) {
  const { role, app } = await params;
  const page = getRoleAppPage(role, app);
  return renderSeoOg({ kicker: page ? `${page.appName} for ${page.roleName.toLowerCase()}` : "Roles", title: page?.title ?? "Lazur" });
}
