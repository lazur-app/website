import type { Metadata } from "next";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { CtaBand } from "@/components/seo-pages/Primitives";
import { getAppPages } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Lazur in your Mac apps: Excel, Figma, Slack, Gmail and more | Lazur",
  description: "What Lazur does in each Mac app: ask about what's on screen, get pointed to the right button, draft replies and type by voice in Excel, Figma, Slack, Gmail, Cursor and more.",
  alternates: { canonical: `${SITE_URL}/apps` },
};

export default function AppsHub() {
  const pages = getAppPages();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/apps", label: "Apps" },
  ];
  const categories = [...new Set(pages.map((p) => p.appCategory))];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader
        crumbs={crumbs}
        kicker="Apps"
        title="Lazur works in the app you already have open"
        intro="Lazur sits in the notch, on top of every Mac app. Pick an app to see what to ask, what Lazur does, and the guides for it."
      />
      <div className="seo-wrap">
        {categories.map((cat) => (
          <HubSection key={cat} title={cat}>
            {pages
              .filter((p) => p.appCategory === cat)
              .map((p) => (
                <HubCard key={p.slug} href={`/apps/${p.slug}`} kicker={p.appName} title={p.title} description={p.description} />
              ))}
          </HubSection>
        ))}
      </div>
      <div className="px-4 sm:px-6">
        <CtaBand source="hub-apps" />
      </div>
    </SeoPageFrame>
  );
}
