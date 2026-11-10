import { breadcrumbsFor, relatedFor } from "@/lib/seo-pages/links";
import { schemasFor } from "@/lib/seo-pages/schema";
import type { ComparePage } from "@/lib/seo-pages/types";
import { CompareGrid, ProductCards } from "../CompareGrid";
import { PageHero } from "../PageHero";
import { Callout, CtaBand, FaqList, SectionHeading, SourcesList, TldrBox, PhotoCredits } from "../Primitives";
import { RelatedGrid } from "../RelatedGrid";
import { SeoBlocks } from "../SeoBlocks";
import { SeoPageFrame } from "../SeoPageFrame";
import { ArticleLayout } from "../ArticleLayout";
import { BarChart, StatStrip } from "../StatStrip";

/** /compare/lazur-vs-x, /compare/x-vs-y and /alternatives/x. */
export function CompareTemplate({ page }: { page: ComparePage }) {
  const crumbs = breadcrumbsFor(page);
  const related = relatedFor(page);
  const others = page.products.filter((p) => !p.isLazur).map((p) => p.name);
  const kicker = page.kind === "alternatives" ? `${others[0]} alternatives` : page.kind === "x-vs-y" ? "Head to head" : "Comparison";
  const checked = page.products.map((p) => p.pricingCheckedAt).filter(Boolean).sort().at(-1);
  return (
    <SeoPageFrame schema={schemasFor(page, crumbs)}>
      <PageHero
        crumbs={crumbs}
        kicker={kicker}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? page.publishedAt}
        meta={checked ? [`Prices checked ${checked}`] : []}
      />
      <ArticleLayout source={`compare-${page.slug}`} related={related}>
      <div className="seo-col mt-12">
        <TldrBox items={page.tldr} title="The short version" />
        <section className="seo-section" aria-labelledby="table">
          <SectionHeading id="table">Side by side</SectionHeading>
          <CompareGrid products={page.products} rows={page.table} />
        </section>
        <div className="mt-8">
          <Callout tone="note" title="Our take" text={page.verdict} />
        </div>
      </div>
      <div className="seo-wrap seo-section">
        <SectionHeading>{page.kind === "alternatives" ? "The options" : "Who each one is for"}</SectionHeading>
        <ProductCards products={page.products} />
      </div>
      <div className="seo-col">
        {page.stats.length > 0 && !page.blocks.some((b) => b.type === "stats") ? (
          <div className="seo-section">
            <StatStrip stats={page.stats} />
          </div>
        ) : null}
        {page.blocks.length > 0 ? (
          <div className="seo-section">
            <SeoBlocks blocks={page.blocks} page={page} lazurNudge="Want to see the difference on your own screen? Lazur is free for 3 days, no card." />
          </div>
        ) : null}
        {page.chart && !page.blocks.some((b) => b.type === "chart") ? (
          <div className="seo-section">
            <BarChart chart={page.chart} />
          </div>
        ) : null}
        <FaqList items={page.faq} />
        <SourcesList sources={page.sources} />
        <p className="mt-8 text-[13px] leading-relaxed text-[var(--foreground-faint)]">
          Product names belong to their owners. Lazur is not affiliated with {others.join(", ")}. Prices and features come from each company&apos;s own site on the date shown; check there before you buy.
        </p>
      </div>
        <PhotoCredits images={page.images} />
      </ArticleLayout>
      <div className="px-4 sm:px-6">
        <CtaBand source={`compare-${page.slug}`} />
      </div>
      <RelatedGrid groups={related} />
    </SeoPageFrame>
  );
}
