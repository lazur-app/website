import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemTemplate } from "@/components/seo-pages/templates";
import { getProblemPage, getProblemPages, prerenderLimit } from "@/lib/seo-pages/load";
import { seoMetadata } from "@/lib/seo-pages/metadata";

type Props = { params: Promise<{ role: string; slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return getProblemPages()
    .slice(0, prerenderLimit())
    .map((p) => ({ role: p.role, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role, slug } = await params;
  const page = getProblemPage(role, slug);
  return page ? seoMetadata(page) : { title: "Not found | Lazur" };
}

export default async function Page({ params }: Props) {
  const { role, slug } = await params;
  const page = getProblemPage(role, slug);
  if (!page) notFound();
  return <ProblemTemplate page={page} />;
}
