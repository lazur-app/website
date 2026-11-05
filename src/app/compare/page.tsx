import type { Metadata } from "next";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { CtaBand } from "@/components/seo-pages/Primitives";
import { getAlternativesPages, getComparePages } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Compare Lazur with dictation apps and AI assistants for Mac | Lazur",
  description: "Honest comparisons of Lazur with Wispr Flow, Superwhisper, Apple Dictation, MacWhisper and other Mac voice and AI apps. Prices from each company's own site.",
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default function CompareHub() {
  const pages = getComparePages();
  const alts = getAlternativesPages();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/compare", label: "Compare" },
  ];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader
        crumbs={crumbs}
        kicker="Comparisons"
        title="How Lazur compares"
        intro="Straight comparisons with the apps people weigh Lazur against. Where another app is the better pick, we say so. Prices come from each company's own site, with the date we checked."
      />
      <div className="seo-wrap">
        <HubSection title="Lazur vs">
          {pages
            .filter((p) => p.kind === "lazur-vs")
            .map((p) => (
              <HubCard key={p.slug} href={`/compare/${p.slug}`} kicker="Comparison" title={p.title} description={p.description} />
            ))}
        </HubSection>
        {pages.some((p) => p.kind === "x-vs-y") ? (
          <HubSection title="Head to head">
            {pages
              .filter((p) => p.kind === "x-vs-y")
              .map((p) => (
                <HubCard key={p.slug} href={`/compare/${p.slug}`} kicker="Head to head" title={p.title} description={p.description} />
              ))}
          </HubSection>
        ) : null}
        {alts.length > 0 ? (
          <HubSection title="Alternatives" more={{ href: "/alternatives", label: "All alternatives" }}>
            {alts.map((p) => (
              <HubCard key={p.slug} href={`/alternatives/${p.slug}`} kicker="Alternatives" title={p.title} description={p.description} />
            ))}
          </HubSection>
        ) : null}
      </div>
      <div className="px-4 sm:px-6">
        <CtaBand source="hub-compare" />
      </div>
    </SeoPageFrame>
  );
}
