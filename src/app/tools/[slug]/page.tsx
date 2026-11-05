import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubCard, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { InlineText } from "@/components/seo-pages/InlineText";
import { PageHero } from "@/components/seo-pages/PageHero";
import { CtaBand, FaqList, LazurCallout, SectionHeading, SourcesList } from "@/components/seo-pages/Primitives";
import { StatStrip } from "@/components/seo-pages/StatStrip";
import { AccuracyChecker } from "@/components/tools/AccuracyChecker";
import { SpeakVsType } from "@/components/tools/SpeakVsType";
import { TypingTaxCalculator } from "@/components/tools/TypingTaxCalculator";
import { TypingTest } from "@/components/tools/TypingTest";
import { breadcrumbSchema, faqSchema } from "@/lib/seo-pages/schema";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { TOOLS, toolBySlug } from "@/lib/tools";
import { TOOL_COPY } from "../content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = toolBySlug((await params).slug);
  if (!tool) return {};
  return {
    title: `${tool.title} | Lazur`,
    description: tool.description,
    keywords: [tool.targetKeyword],
    alternates: { canonical: `${SITE_URL}/tools/${tool.slug}` },
  };
}

const WIDGETS: Record<string, () => React.ReactNode> = {
  "typing-speed-test": () => <TypingTest />,
  "speaking-vs-typing-test": () => <SpeakVsType />,
  "typing-tax-calculator": () => <TypingTaxCalculator />,
  "dictation-accuracy-checker": () => <AccuracyChecker />,
};

export default async function ToolPage({ params }: Props) {
  const tool = toolBySlug((await params).slug);
  if (!tool) notFound();
  const copy = TOOL_COPY[tool.slug];
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Free tools" },
    { href: `/tools/${tool.slug}`, label: tool.name },
  ];
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in the browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
  return (
    <SeoPageFrame schema={[app, breadcrumbSchema(crumbs), faqSchema(copy.faq)].filter(Boolean) as Record<string, unknown>[]}>
      <PageHero crumbs={crumbs} kicker={tool.kicker} title={tool.title} intro={copy.intro} updatedAt="2026-11-05" meta={["Free", "Runs in your browser"]} />
      <div className="seo-wrap mt-10">{WIDGETS[tool.slug]()}</div>
      <div className="seo-col">
        <section className="seo-section" aria-labelledby="how">
          <SectionHeading id="how">How it works</SectionHeading>
          <ol className="list-decimal space-y-2 pl-5 text-[16px] leading-[1.75] text-[#3d3834]">
            {copy.how.map((h) => (
              <li key={h}>
                <InlineText text={h} />
              </li>
            ))}
          </ol>
        </section>
        {copy.stats.length > 0 ? (
          <div className="seo-section">
            <StatStrip stats={copy.stats} />
          </div>
        ) : null}
        <div className="mt-10">
          <LazurCallout text={copy.nudge} />
        </div>
        <FaqList items={copy.faq} />
        <SourcesList sources={copy.sources} />
      </div>
      <div className="px-4 sm:px-6">
        <CtaBand source={`tool-${tool.slug}`} title="Talk instead of typing, on any Mac app" text="Hold fn and talk: clean text at your cursor. Hold ⌥ ⌘ and ask: Lazur sees your screen and answers. Free for 3 days, no card." />
      </div>
      <div className="seo-wrap">
        <HubSection title="More free tools">
          {TOOLS.filter((t) => t.slug !== tool.slug).map((t) => (
            <HubCard key={t.slug} href={`/tools/${t.slug}`} kicker="Free tool" title={t.name} description={t.description} />
          ))}
        </HubSection>
      </div>
    </SeoPageFrame>
  );
}
