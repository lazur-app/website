import Link from "next/link";
import { ROLES } from "@/lib/content/sources.mjs";
import { getRoleAppPages } from "@/lib/seo-pages/load";
import { breadcrumbsFor, relatedFor } from "@/lib/seo-pages/links";
import { schemasFor } from "@/lib/seo-pages/schema";
import type { AppPage } from "@/lib/seo-pages/types";
import { AskGrid, FasterWithLazur } from "../FasterWithLazur";
import { NotchScene } from "../NotchScene";
import { PageHero } from "../PageHero";
import { CtaBand, FaqList, SectionHeading, SourcesList, TldrBox, PhotoCredits } from "../Primitives";
import { RelatedGrid } from "../RelatedGrid";
import { SeoBlocks } from "../SeoBlocks";
import { SeoPageFrame } from "../SeoPageFrame";
import { ArticleLayout } from "../ArticleLayout";
import { BarChart, StatStrip } from "../StatStrip";

/** /apps/<app>: what Lazur does while you work in one Mac app. */
export function AppTemplate({ page }: { page: AppPage }) {
  const crumbs = breadcrumbsFor(page);
  const related = relatedFor(page);
  const [first, second] = page.demos;
  const roleApps = getRoleAppPages().filter((r) => r.app === page.app);
  const nudge = `Try it in ${page.appName}: hold ⌥ ⌘ and say “${page.asks[0]?.say ?? first.spoken}”.`;

  return (
    <SeoPageFrame schema={schemasFor(page, crumbs)}>
      <PageHero
        crumbs={crumbs}
        kicker={`Lazur in ${page.appName} · ${page.appCategory}`}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? page.publishedAt}
        meta={["Works with the Mac app and the web app", "macOS"]}
        visual={<NotchScene demo={first} appName={page.appName} />}
      />

      <ArticleLayout source={`app-${page.slug}`} related={related}>
      <div className="seo-col mt-12">
        <TldrBox items={page.tldr} />
        {page.stats.length > 0 ? (
          <div className="mt-10">
            <StatStrip stats={page.stats} />
          </div>
        ) : null}

        <section className="seo-section" aria-labelledby="asks">
          <SectionHeading id="asks" sub={`Hold ⌥ ⌘ in ${page.appName} and say any of these.`}>
            {`What you can ask Lazur in ${page.appName}`}
          </SectionHeading>
          <AskGrid asks={page.asks} appName={page.appName} />
        </section>

        {page.blocks.length > 0 ? (
          <div className="seo-section">
            <SeoBlocks blocks={page.blocks} page={page} lazurNudge={nudge} />
          </div>
        ) : null}

        {page.chart && !page.blocks.some((b) => b.type === "chart") ? (
          <div className="seo-section">
            <BarChart chart={page.chart} />
          </div>
        ) : null}

        {roleApps.length > 0 ? (
          <section className="seo-section" aria-labelledby="by-role">
            <SectionHeading id="by-role">{`${page.appName} with Lazur, by job`}</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {roleApps.map((r) => (
                <li key={r.role}>
                  <Link href={`/for/${r.role}/${r.app}`} className="seo-chip inline-block hover:border-[var(--brand)]">
                    {ROLES.find((x) => x.slug === r.role)?.name ?? r.roleName}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {second ? (
        <div className="px-4 sm:px-6">
          <FasterWithLazur demo={second} appName={page.appName} asks={page.asks.slice(4)} title={`Another way to use Lazur in ${page.appName}`} />
        </div>
      ) : null}

      <div className="seo-col">
        <FaqList items={page.faq} />
        <SourcesList sources={page.sources} />
      </div>
        <PhotoCredits images={page.images} />
      </ArticleLayout>
      <div className="px-4 sm:px-6">
        <CtaBand source={`app-${page.slug}`} title={`Try Lazur in ${page.appName}, free for 3 days`} />
      </div>
      <RelatedGrid groups={related} />
    </SeoPageFrame>
  );
}
