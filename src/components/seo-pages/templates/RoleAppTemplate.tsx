import { breadcrumbsFor, relatedFor } from "@/lib/seo-pages/links";
import { schemasFor } from "@/lib/seo-pages/schema";
import type { RoleAppPage } from "@/lib/seo-pages/types";
import { AskGrid } from "../FasterWithLazur";
import { NotchScene } from "../NotchScene";
import { PageHero } from "../PageHero";
import { CtaBand, FaqList, SectionHeading, SourcesList, TldrBox } from "../Primitives";
import { RelatedGrid } from "../RelatedGrid";
import { SeoBlocks } from "../SeoBlocks";
import { SeoPageFrame } from "../SeoPageFrame";
import { BarChart, StatStrip } from "../StatStrip";

/** /for/<role>/<app>: one job, one app. */
export function RoleAppTemplate({ page }: { page: RoleAppPage }) {
  const crumbs = breadcrumbsFor(page);
  const related = relatedFor(page);
  return (
    <SeoPageFrame schema={schemasFor(page, crumbs)}>
      <PageHero
        crumbs={crumbs}
        kicker={`${page.appName} · for ${page.roleName.toLowerCase()}`}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? page.publishedAt}
        visual={<NotchScene demo={page.demo} appName={page.appName} />}
      />
      <div className="seo-col mt-12">
        <TldrBox items={page.tldr} />
        {page.stats.length > 0 ? (
          <div className="mt-10">
            <StatStrip stats={page.stats} />
          </div>
        ) : null}
        <section className="seo-section" aria-labelledby="tasks">
          <SectionHeading id="tasks" sub={`Hold ⌥ ⌘ in ${page.appName} and say it.`}>
            {`What ${page.roleName.toLowerCase()} ask Lazur in ${page.appName}`}
          </SectionHeading>
          <AskGrid asks={page.tasks} appName={page.appName} />
        </section>
        {page.blocks.length > 0 ? (
          <div className="seo-section">
            <SeoBlocks blocks={page.blocks} page={page} lazurNudge={`Try “${page.tasks[0]?.say ?? page.demo.spoken}” in ${page.appName}. Free for 3 days.`} />
          </div>
        ) : null}
        {page.chart && !page.blocks.some((b) => b.type === "chart") ? (
          <div className="seo-section">
            <BarChart chart={page.chart} />
          </div>
        ) : null}
        <FaqList items={page.faq} />
        <SourcesList sources={page.sources} />
      </div>
      <div className="px-4 sm:px-6">
        <CtaBand source={`role-app-${page.role}-${page.app}`} />
      </div>
      <RelatedGrid groups={related} />
    </SeoPageFrame>
  );
}
