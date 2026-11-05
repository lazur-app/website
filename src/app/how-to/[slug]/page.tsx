import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HowToTemplate } from "@/components/seo-pages/templates";
import { getHowTo, getHowTos, prerenderLimit } from "@/lib/seo-pages/load";
import { seoMetadata } from "@/lib/seo-pages/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return getHowTos()
    .slice(0, prerenderLimit())
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getHowTo((await params).slug);
  return page ? seoMetadata(page) : { title: "Guide not found | Lazur" };
}

export default async function Page({ params }: Props) {
  const page = getHowTo((await params).slug);
  if (!page) notFound();
  return <HowToTemplate page={page} />;
}
