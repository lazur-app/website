import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";
import { ToolFrame, toolJsonLd } from "../ToolFrame";

type Props = { params: Promise<{ tool: string; page: string }> };

const find = async (params: Props["params"]) => {
  const { tool: sub, page: slug } = await params;
  const tool = freeToolBySubdomain(sub);
  const page = tool?.pages.find((p) => p.slug === slug);
  return tool && page ? { tool, page } : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await find(params);
  if (!found) return {};
  const url = `${toolOrigin(found.tool.subdomain)}/${found.page.slug}`;
  return {
    title: found.page.title,
    description: found.page.intro,
    alternates: { canonical: url },
    openGraph: { title: found.page.title, description: found.page.intro, url },
  };
}

export default async function ToolSubPage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  const { tool, page } = found;
  const url = `${toolOrigin(tool.subdomain)}/${page.slug}`;
  return <ToolFrame tool={tool} h1={page.h1} intro={page.intro} showFaq={false} jsonLd={toolJsonLd(tool, url, page.title, false)} page={page.slug} />;
}
