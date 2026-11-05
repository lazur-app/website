import { breadcrumbsFor, relatedFor } from "@/lib/seo-pages/links";
import { schemasFor } from "@/lib/seo-pages/schema";
import type { HowToPage } from "@/lib/seo-pages/types";
import { FasterWithLazur } from "../FasterWithLazur";
import { ImageFigure } from "../ImageFigure";
import { PageHero } from "../PageHero";
import { CtaBand, FaqList, LazurCallout, SectionHeading, SourcesList, TldrBox } from "../Primitives";
import { RelatedGrid } from "../RelatedGrid";
import { SeoBlocks } from "../SeoBlocks";
import { SeoPageFrame } from "../SeoPageFrame";
import { BarChart, StatStrip } from "../StatStrip";
import { ShortcutTable, StepList, Troubleshooting } from "../StepList";

/**
 * /how-to/<task>-in-<app>. Order matters: the real answer first (steps), Lazur second.
 */
export function HowToTemplate({ page }: { page: HowToPage }) {
  const crumbs = breadcrumbsFor(page);
  const related = relatedFor(page);
  const hero = page.images[0];
  const usesStatsBlock = page.blocks.some((b) => b.type === "stats");
  const usesChartBlock = page.blocks.some((b) => b.type === "chart");
  const nudge = `Stuck on a step? Hold ⌥ ⌘ and ask Lazur “${page.lazur.spoken}”. It sees your ${page.appName} window and ${
    page.lazur.capability === "point" ? "circles the button you need" : page.lazur.capability === "guide" ? "walks you through it one click at a time" : "answers out loud"
  }.`;

  return (
    <SeoPageFrame schema={schemasFor(page, crumbs)}>
      <PageHero
        crumbs={crumbs}
        kicker={`How-to · ${page.appName} for Mac`}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? page.publishedAt}
        meta={[`Checked against ${page.appliesTo}`, `${page.timeMinutes} min`, page.difficulty]}
        visual={hero ? <ImageFigure image={hero} priority /> : undefined}
      />

      <div className="seo-col mt-12">
        <TldrBox items={page.tldr} />

        {page.requirements.length > 0 ? (
          <div className="mt-8">
            <p className="seo-label">What you need</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[#3d3834]">
              {page.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className="seo-section" aria-labelledby="steps">
          <SectionHeading id="steps">{`How to ${page.task} in ${page.appName} on a Mac`}</SectionHeading>
          <StepList steps={page.steps} images={page.images} />
        </section>

        <div className="mt-8">
          <LazurCallout text={nudge} />
        </div>

        {!usesStatsBlock && page.stats.length > 0 ? (
          <div className="seo-section">
            <StatStrip stats={page.stats} />
          </div>
        ) : null}

        {page.blocks.length > 0 ? (
          <div className="seo-section">
            <SeoBlocks blocks={page.blocks} page={page} />
          </div>
        ) : null}

        {!usesChartBlock && page.chart ? (
          <div className="seo-section">
            <BarChart chart={page.chart} />
          </div>
        ) : null}

        {page.shortcuts.length > 0 ? (
          <section className="seo-section" aria-labelledby="shortcuts">
            <SectionHeading id="shortcuts">{`${page.appName} shortcuts for this on Mac`}</SectionHeading>
            <ShortcutTable rows={page.shortcuts} appName={page.appName} />
          </section>
        ) : null}

        {page.troubleshooting.length > 0 ? (
          <section className="seo-section" aria-labelledby="troubleshooting">
            <SectionHeading id="troubleshooting">If it does not work</SectionHeading>
            <Troubleshooting items={page.troubleshooting} />
          </section>
        ) : null}
      </div>

      <div className="px-4 sm:px-6">
        <FasterWithLazur
          demo={page.lazur}
          appName={page.appName}
          title={`Do it faster: ask Lazur while you are in ${page.appName}`}
        />
      </div>

      <div className="seo-col">
        <FaqList items={page.faq} />
        <SourcesList sources={page.sources} />
      </div>

      <div className="px-4 sm:px-6">
        <CtaBand source={`howto-${page.slug}`} />
      </div>
      <RelatedGrid groups={related} />
    </SeoPageFrame>
  );
}
