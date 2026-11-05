import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleAppTemplate } from "@/components/seo-pages/templates";
import { getRoleAppPage, getRoleAppPages, prerenderLimit } from "@/lib/seo-pages/load";
import { seoMetadata } from "@/lib/seo-pages/metadata";

type Props = { params: Promise<{ role: string; app: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return getRoleAppPages()
    .slice(0, prerenderLimit())
    .map((p) => ({ role: p.role, app: p.app }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role, app } = await params;
  const page = getRoleAppPage(role, app);
  return page ? seoMetadata(page) : { title: "Not found | Lazur" };
}

export default async function Page({ params }: Props) {
  const { role, app } = await params;
  const page = getRoleAppPage(role, app);
  if (!page) notFound();
  return <RoleAppTemplate page={page} />;
}
