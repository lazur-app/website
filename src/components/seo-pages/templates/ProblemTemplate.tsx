import { breadcrumbsFor, relatedFor } from "@/lib/seo-pages/links";
import { schemasFor } from "@/lib/seo-pages/schema";
import type { ProblemPage } from "@/lib/seo-pages/types";
import { AskGrid, FasterWithLazur } from "../FasterWithLazur";
import { ImageFigure } from "../ImageFigure";
import { InlineText } from "../InlineText";
import { PageHero } from "../PageHero";
import { CtaBand, FaqList, LazurCallout, SectionHeading, SourcesList, TldrBox, PhotoCredits } from "../Primitives";
import { RelatedGrid } from "../RelatedGrid";
import { SeoBlocks } from "../SeoBlocks";
import { SeoPageFrame } from "../SeoPageFrame";
import { ArticleLayout } from "../ArticleLayout";
import { BarChart, StatStrip } from "../StatStrip";
import { APPS } from "@/lib/content/sources.mjs";

/**
 * /for/<role>/problems/<slug>: one real problem people in a job have. The page earns trust first
 * (what it costs, why it happens, fixes anyone can use), then shows where Lazur helps.
 */
export function ProblemTemplate({ page }: { page: ProblemPage }) {
  const crumbs = breadcrumbsFor(page);
  const related = relatedFor(page);
  const appName = APPS.find((a) => a.slug === page.apps[0])?.name ?? "your Mac";
  const usesStats = page.blocks.some((b) => b.type === "stats");
  const usesChart = page.blocks.some((b) => b.type === "chart");
  const nudge = `Try it on this exact problem: hold ⌥ ⌘ and say “${page.lazurHelps[0]?.say ?? page.demo.spoken}”. Free for 3 days.`;

  return (
    <SeoPageFrame schema={schemasFor(page, crumbs)}>
      <PageHero
        crumbs={crumbs}
        kicker={`${page.roleName} · problem and fix`}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? page.publishedAt}
        meta={[`For ${page.roleName.toLowerCase()}`, `${page.sources.length} sources`]}
        visual={page.images[0] ? <ImageFigure image={page.images[0]} priority /> : undefined}
      />

      <ArticleLayout source={`problem-${page.role}-${page.slug}`} related={related}>
      <div className="seo-col mt-12">
        <TldrBox items={page.tldr} title="The short answer" />

        {!usesStats && page.stats.length > 0 ? (
          <div className="mt-10">
            <StatStrip stats={page.stats} />
          </div>
        ) : null}

        <section className="seo-section" aria-labelledby="costs">
          <SectionHeading id="costs">{`What ${page.problem} costs you`}</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.costs.map((c) => (
              <div key={c.title} className="seo-card">
                <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em]">{c.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#3d3834]">
                  <InlineText text={c.text} />
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="seo-section" aria-labelledby="causes">
          <SectionHeading id="causes">Why it happens</SectionHeading>
          <ol className="seo-steps">
            {page.causes.map((c, i) => (
              <li key={c.title}>
                <span className="seo-steps__n" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <h3 className="seo-steps__name">{c.title}</h3>
                  <p className="seo-steps__text">
                    <InlineText text={c.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {!usesChart && page.chart ? (
          <div className="seo-section">
            <BarChart chart={page.chart} />
          </div>
        ) : null}

        <section className="seo-section" aria-labelledby="fixes">
          <SectionHeading id="fixes" sub="These work with or without any app.">
            How to fix it
          </SectionHeading>
          <ul className="seo-fixes">
            {page.fixes.map((f) => (
              <li key={f.title}>
                <span className="seo-fixes__tick" aria-hidden>
                  ✓
                </span>
                <div>
                  <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em]">{f.title}</h3>
                  <p className="mt-1 text-[16px] leading-[1.7] text-[#3d3834]">
                    <InlineText text={f.text} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8">
          <LazurCallout text={nudge} />
        </div>

        {page.blocks.length > 0 ? (
          <div className="seo-section">
            <SeoBlocks blocks={page.blocks} page={page} />
          </div>
        ) : null}
      </div>

      <div className="px-4 sm:px-6">
        <FasterWithLazur demo={page.demo} appName={appName} title={`Where Lazur helps with ${page.problem}`} asks={page.lazurHelps} />
      </div>

      <div className="seo-col">
        <section className="seo-section" aria-labelledby="asks">
          <SectionHeading id="asks" sub="Each one is a single hold of ⌥ ⌘.">{`What ${page.roleName.toLowerCase()} say to Lazur for this`}</SectionHeading>
          <AskGrid asks={page.lazurHelps} />
        </section>

        {page.plan.length > 0 ? (
          <section className="seo-section" aria-labelledby="plan">
            <SectionHeading id="plan">A plan you can start this week</SectionHeading>
            <ol className="seo-timeline">
              {page.plan.map((s) => (
                <li key={s.label + s.title}>
                  <span className="seo-timeline__label">{s.label}</span>
                  <div>
                    <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em]">{s.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#3d3834]">
                      <InlineText text={s.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <FaqList items={page.faq} />
        <SourcesList sources={page.sources} />
      </div>
        <PhotoCredits images={page.images} />
      </ArticleLayout>
      <div className="px-4 sm:px-6">
        <CtaBand source={`problem-${page.role}-${page.slug}`} title={`Fix ${page.problem} with Lazur, free for 3 days`} />
      </div>
      <RelatedGrid groups={related} />
    </SeoPageFrame>
  );
}
