import type { Metadata } from "next";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";
import { Sticker } from "@/components/landing/Sticker";
import { toolOrigin } from "@/lib/free-tools/host";
import { FREE_TOOLS, FREE_TOOL_CATEGORIES } from "@/lib/free-tools/registry";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free typing and dictation tools | Lazur",
  description: "Free online tools: mic test, webcam test, dictation, voice typing, audio to text, teleprompter, word counter and more. No sign-up, runs in your browser.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

export default function ToolsHub() {
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Free tools" },
  ];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader crumbs={crumbs} kicker="Free tools" title="Free tools for people who type all day" accent="type all day" intro="Measure your typing, compare it with speaking, see what it costs you, and check how accurate your dictation app is. No sign-up, nothing leaves your browser." />
      <div className="seo-wrap">
        <HubSection title="Tools">
          {TOOLS.map((t) => (
            <HubCard key={t.slug} href={`/tools/${t.slug}`} kicker="Free tool" title={t.name} description={t.description} />
          ))}
        </HubSection>
        {FREE_TOOL_CATEGORIES.map((category) => (
          <HubSection key={category} title={category}>
            {FREE_TOOLS.filter((t) => t.category === category).map((t) => (
              <HubCard key={t.subdomain} href={toolOrigin(t.subdomain)} kicker="Free tool" aside={<Sticker name={t.sticker} size={44} />} title={t.name} description={t.tagline} />
            ))}
          </HubSection>
        ))}
      </div>
    </SeoPageFrame>
  );
}
