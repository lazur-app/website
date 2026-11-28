import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";
import { ToolFrame, toolJsonLd } from "./ToolFrame";

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) return {};
  const url = toolOrigin(tool.subdomain);
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: { title: tool.title, description: tool.description, url },
  };
}

export default async function ToolHome({ params }: Props) {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) notFound();
  const url = toolOrigin(tool.subdomain);
  return <ToolFrame tool={tool} h1={tool.h1} intro={tool.tagline} showFaq jsonLd={toolJsonLd(tool, url, tool.title, true)} />;
}
