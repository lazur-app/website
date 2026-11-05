import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareTemplate } from "@/components/seo-pages/templates";
import { getComparePage, getComparePages, prerenderLimit } from "@/lib/seo-pages/load";
import { seoMetadata } from "@/lib/seo-pages/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return getComparePages()
    .slice(0, prerenderLimit())
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getComparePage((await params).slug);
  return page ? seoMetadata(page) : { title: "Comparison not found | Lazur" };
}

export default async function Page({ params }: Props) {
  const page = getComparePage((await params).slug);
  if (!page) notFound();
  return <CompareTemplate page={page} />;
}
