import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoleTemplate } from "@/components/seo-pages/templates";
import { getRolePage, getRolePages, prerenderLimit } from "@/lib/seo-pages/load";
import { seoMetadata } from "@/lib/seo-pages/metadata";

type Props = { params: Promise<{ role: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return getRolePages()
    .slice(0, prerenderLimit())
    .map((p) => ({ role: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getRolePage((await params).role);
  return page ? seoMetadata(page) : { title: "Not found | Lazur" };
}

export default async function Page({ params }: Props) {
  const page = getRolePage((await params).role);
  if (!page) notFound();
  return <RoleTemplate page={page} />;
}
