import Link from "next/link";
import { APPS } from "@/lib/content/sources.mjs";
import { getRoleAppPages } from "@/lib/seo-pages/load";
import { breadcrumbsFor, relatedFor } from "@/lib/seo-pages/links";
import { schemasFor } from "@/lib/seo-pages/schema";
import type { RolePage } from "@/lib/seo-pages/types";
import { LAZUR_CAPABILITIES } from "@/lib/content/lazur-facts.mjs";
import { InlineText } from "../InlineText";
import { NotchScene } from "../NotchScene";
import { PageHero } from "../PageHero";
import { CtaBand, FaqList, SectionHeading, SourcesList, TldrBox, PhotoCredits } from "../Primitives";
import { RelatedGrid } from "../RelatedGrid";
import { SeoBlocks } from "../SeoBlocks";
import { SeoPageFrame } from "../SeoPageFrame";
import { ArticleLayout } from "../ArticleLayout";
import { BarChart, StatStrip } from "../StatStrip";

/** /for/<role>: Lazur for one kind of job. */
export function RoleTemplate({ page }: { page: RolePage }) {
  const crumbs = breadcrumbsFor(page);
  const related = relatedFor(page);
  const roleApps = new Set(getRoleAppPages().filter((r) => r.role === page.role).map((r) => r.app));
  const appName = APPS.find((a) => a.slug === page.apps[0])?.name ?? "your Mac";

  return (
    <SeoPageFrame schema={schemasFor(page, crumbs)}>
      <PageHero
        crumbs={crumbs}
        kicker={`Lazur for ${page.roleName.toLowerCase()}`}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? page.publishedAt}
        visual={<NotchScene demo={page.demo} appName={appName} />}
      />

      <ArticleLayout source={`role-${page.slug}`} related={related}>
      <div className="seo-col mt-12">
        <TldrBox items={page.tldr} />
        {page.stats.length > 0 ? (
          <div className="mt-10">
            <StatStrip stats={page.stats} />
          </div>
        ) : null}

        <section className="seo-section" aria-labelledby="pain">
          <SectionHeading id="pain">{`Where the day goes for ${page.roleName.toLowerCase()}`}</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.painPoints.map((p) => (
              <div key={p.title} className="seo-card">
                <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em] text-[var(--foreground)]">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#3d3834]">
                  <InlineText text={p.text} />
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="seo-section" aria-labelledby="day">
          <SectionHeading id="day" sub="Real things to say. Each one is a single hold of ⌥ ⌘.">{`A ${page.roleSingular}'s day with Lazur`}</SectionHeading>
          <ol className="seo-steps">
            {page.day.map((d) => (
              <li key={d.time + d.say}>
                <span className="pt-1 text-[12px] font-semibold tabular-nums text-[var(--foreground-faint)]">{d.time}</span>
                <div>
                  <p className="seo-asks__say">“{d.say}”</p>
                  <p className="seo-steps__text !mt-1">
                    <InlineText text={d.result} />
                  </p>
                  <p className="seo-label mt-2 !text-[10px]">{LAZUR_CAPABILITIES[d.capability].label}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {page.blocks.length > 0 ? (
          <div className="seo-section">
            <SeoBlocks blocks={page.blocks} page={page} lazurNudge={`Try one of these tomorrow morning. Lazur is free for 3 days.`} />
          </div>
        ) : null}
        {page.chart && !page.blocks.some((b) => b.type === "chart") ? (
          <div className="seo-section">
            <BarChart chart={page.chart} />
          </div>
        ) : null}

        <section className="seo-section" aria-labelledby="apps">
          <SectionHeading id="apps">{`The apps ${page.roleName.toLowerCase()} use it in`}</SectionHeading>
          <ul className="flex flex-wrap gap-2">
            {page.apps.map((slug) => {
              const app = APPS.find((a) => a.slug === slug);
              if (!app) return null;
              const href = roleApps.has(slug) ? `/for/${page.role}/${slug}` : `/apps/${slug}`;
              return (
                <li key={slug}>
                  <Link href={href} className="seo-chip inline-block hover:border-[var(--brand)]">
                    {app.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <FaqList items={page.faq} />
        <SourcesList sources={page.sources} />
      </div>
        <PhotoCredits images={page.images} />
      </ArticleLayout>
      <div className="px-4 sm:px-6">
        <CtaBand source={`role-${page.slug}`} title={`Lazur for ${page.roleName.toLowerCase()}: free for 3 days`} />
      </div>
      <RelatedGrid groups={related} />
    </SeoPageFrame>
  );
}
