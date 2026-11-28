import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolContent } from "@/lib/free-tools/content";
import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";
import { ToolFrame, toolJsonLd } from "../ToolFrame";

/**
 * A keyword page for a tool, e.g. mic-test.lazur.app/iphone. The same working tool, with the
 * written answer for that search (content/free-tools/pages/<tool>.json).
 */
type Props = { params: Promise<{ tool: string; page: string }> };

const find = async (params: Props["params"]) => {
  const { tool: sub, page: slug } = await params;
  const tool = freeToolBySubdomain(sub);
  const content = tool ? getToolContent(tool.subdomain) : null;
  const page = content?.pages.find((p) => p.slug === slug);
  return tool && content && page ? { tool, content, page } : null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await find(params);
  if (!found) return {};
  const url = `${toolOrigin(found.tool.subdomain)}/${found.page.slug}`;
  return {
    title: found.page.title,
    description: found.page.description,
    alternates: { canonical: url },
    openGraph: { title: found.page.title, description: found.page.description, url, images: found.page.image ? [found.page.image.src] : undefined },
  };
}

export default async function ToolSubPage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  const { tool, content, page } = found;
  const home = toolOrigin(tool.subdomain);
  const url = `${home}/${page.slug}`;
  const schema = [
    ...toolJsonLd(tool, url, page.title, false),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: tool.name, item: home },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    },
    ...(page.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];
  const links = [{ slug: "", label: `${tool.name} home` }, ...content.pages.filter((p) => p.slug !== page.slug).map((p) => ({ slug: p.slug, label: p.h1 }))];
  return (
    <ToolFrame
      tool={tool}
      h1={page.h1}
      intro={page.claim}
      claim={page.claim}
      article={{ sections: page.sections, image: page.image }}
      pageLinks={links}
      faqItems={page.faq}
      showFaq
      jsonLd={schema}
      page={page.slug}
    />
  );
}
