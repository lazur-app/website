import type { Metadata } from "next";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { getAlternativesPages } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Alternatives to popular Mac dictation and AI apps | Lazur",
  description: "Looking for an alternative to Wispr Flow, Superwhisper or another Mac voice app? Side-by-side options with prices from each company's own site.",
  alternates: { canonical: `${SITE_URL}/alternatives` },
};

export default function AlternativesHub() {
  const pages = getAlternativesPages();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/alternatives", label: "Alternatives" },
  ];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader crumbs={crumbs} kicker="Alternatives" title="Alternatives, compared honestly" intro="Each page lists the real options, what they cost on their own site, and who each one suits. Lazur is one of the options, not the only one." />
      <div className="seo-wrap">
        <HubSection title="All alternatives pages" more={{ href: "/compare", label: "Head-to-head comparisons" }}>
          {pages.map((p) => (
            <HubCard key={p.slug} image={p.images?.[0]} href={`/alternatives/${p.slug}`} kicker="Alternatives" title={p.title} description={p.description} />
          ))}
        </HubSection>
      </div>
    </SeoPageFrame>
  );
}
