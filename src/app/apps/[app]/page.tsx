import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppTemplate } from "@/components/seo-pages/templates";
import { getAppPage, getAppPages, prerenderLimit } from "@/lib/seo-pages/load";
import { seoMetadata } from "@/lib/seo-pages/metadata";

type Props = { params: Promise<{ app: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAppPages()
    .slice(0, prerenderLimit())
    .map((p) => ({ app: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getAppPage((await params).app);
  return page ? seoMetadata(page) : { title: "App not found | Lazur" };
}

export default async function Page({ params }: Props) {
  const page = getAppPage((await params).app);
  if (!page) notFound();
  return <AppTemplate page={page} />;
}
