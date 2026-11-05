import type { Metadata } from "next";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { CtaBand } from "@/components/seo-pages/Primitives";
import { APPS } from "@/lib/content/sources.mjs";
import { getHowTos } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "How-to guides for Mac apps | Lazur",
  description: "Step-by-step guides for Excel, Figma, Notion, Slack and other Mac apps. Real menu paths and shortcuts, checked against current versions.",
  alternates: { canonical: `${SITE_URL}/how-to` },
};

const PER_APP = 9;

export default function HowToHub() {
  const all = getHowTos();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/how-to", label: "How-to" },
  ];
  const groups = APPS.map((app) => ({ app, pages: all.filter((p) => p.app === app.slug) })).filter((g) => g.pages.length > 0);
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader
        crumbs={crumbs}
        kicker="How-to guides"
        title="How to do it on a Mac, step by step"
        intro="Plain instructions for the Mac apps you use every day, with the real menu paths and shortcuts. Stuck anyway? Hold ⌥ ⌘ and ask Lazur, and it points at the button on your screen."
      />
      <div className="seo-wrap">
        {groups.map(({ app, pages }) => (
          <HubSection
            key={app.slug}
            id={app.slug}
            title={`${app.name} guides`}
            more={pages.length > PER_APP ? { href: `/how-to/app/${app.slug}`, label: `All ${pages.length}` } : { href: `/apps/${app.slug}`, label: `Lazur in ${app.name}` }}
          >
            {pages.slice(0, PER_APP).map((p) => (
              <HubCard key={p.slug} image={p.images?.[0]} href={`/how-to/${p.slug}`} kicker={`${p.appName} · ${p.timeMinutes} min`} title={p.title} description={p.description} />
            ))}
          </HubSection>
        ))}
        {groups.length === 0 ? <p className="mt-10 text-[var(--foreground-muted)]">Guides are on their way.</p> : null}
      </div>
      <div className="px-4 sm:px-6">
        <CtaBand source="hub-howto" />
      </div>
    </SeoPageFrame>
  );
}
