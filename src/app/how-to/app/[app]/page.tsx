import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { APPS } from "@/lib/content/sources.mjs";
import { getHowTos } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

type Props = { params: Promise<{ app: string }> };

export function generateStaticParams() {
  const used = new Set(getHowTos().map((p) => p.app));
  return APPS.filter((a) => used.has(a.slug)).map((a) => ({ app: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).app;
  const app = APPS.find((a) => a.slug === slug);
  if (!app) return { title: "Not found | Lazur" };
  return {
    title: `${app.name} for Mac: how-to guides | Lazur`,
    description: `Step-by-step ${app.name} guides for Mac, with menu paths and keyboard shortcuts checked against the current version.`,
    alternates: { canonical: `${SITE_URL}/how-to/app/${app.slug}` },
  };
}

export default async function AppHowToHub({ params }: Props) {
  const slug = (await params).app;
  const app = APPS.find((a) => a.slug === slug);
  if (!app) notFound();
  const pages = getHowTos().filter((p) => p.app === app.slug);
  if (pages.length === 0) notFound();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/how-to", label: "How-to" },
    { href: `/how-to/app/${app.slug}`, label: app.name },
  ];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader crumbs={crumbs} kicker={`${app.name} for Mac`} title={`${app.name} how-to guides`} intro={`Every ${app.name} guide we have, newest first. Each one lists the menu path, the shortcut and what to do when it does not work.`} />
      <div className="seo-wrap">
        <HubSection title={`${pages.length} guides`} more={{ href: `/apps/${app.slug}`, label: `Lazur in ${app.name}` }}>
          {pages.map((p) => (
            <HubCard key={p.slug} image={p.images?.[0]} href={`/how-to/${p.slug}`} kicker={`${p.difficulty} · ${p.timeMinutes} min`} title={p.title} description={p.description} />
          ))}
        </HubSection>
      </div>
    </SeoPageFrame>
  );
}
