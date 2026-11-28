import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolContent } from "@/lib/free-tools/content";
import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";
import { SCORE_SPECS } from "@/lib/free-tools/stats";
import { ToolFrame, toolJsonLd } from "./ToolFrame";

type Props = { params: Promise<{ tool: string }>; searchParams: Promise<{ score?: string }> };

/** A shared score (?score=9.2), only for tools that have scores and only if it is in range. */
function sharedScore(tool: string, raw?: string) {
  const spec = SCORE_SPECS[tool];
  const n = Number(raw);
  if (!spec || raw === undefined || !Number.isFinite(n) || n < spec.min || n > spec.max) return null;
  return { value: n, shown: `${n}${spec.unit === "%" ? "%" : ` ${spec.unit}`}` };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) return {};
  const url = toolOrigin(tool.subdomain);
  const claim = getToolContent(tool.subdomain)?.main.claim;
  const description = claim && claim.length <= 170 ? claim : tool.description;
  const s = sharedScore(tool.subdomain, (await searchParams).score);
  if (s) {
    const title = `I got ${s.shown} on the ${tool.name}. Can you beat it?`;
    const image = `${url}/score-image?score=${s.value}`;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url: `${url}/?score=${s.value}`, images: [{ url: image, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", title, images: [image] },
    };
  }
  return {
    title: tool.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: tool.title, description, url },
  };
}

export default async function ToolHome({ params, searchParams }: Props) {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) notFound();
  const url = toolOrigin(tool.subdomain);
  const content = getToolContent(tool.subdomain);
  const s = sharedScore(tool.subdomain, (await searchParams).score);
  return (
    <ToolFrame
      challenge={s ? `A friend got ${s.shown}. Can you beat it?` : undefined}
      tool={tool}
      h1={tool.h1}
      intro={tool.tagline}
      claim={content?.main.claim}
      article={content ? { sections: content.main.sections, image: content.main.image } : undefined}
      pageLinks={(content?.pages ?? []).map((p) => ({ slug: p.slug, label: p.h1 }))}
      showFaq
      jsonLd={toolJsonLd(tool, url, tool.title, true)}
    />
  );
}
