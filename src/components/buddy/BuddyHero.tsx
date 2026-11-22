"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import { SentenceSplits } from "@/components/landing/SentenceSplits";
import { usePersona } from "@/lib/personas";
import { setGuide } from "@/lib/guide";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { DownloadReassurance } from "@/components/landing/DownloadReassurance";
import { AppDome, AppLine } from "@/components/landing/AppDome";
import { FilmSlot } from "@/components/landing/FilmSlot";

/**
 * The homepage hero: the headline, one line on how Lazur is used, and the flow. Spoken words loop
 * beside the headline and run into the "Get Lazur" pill, which is the button; finished work leaves
 * it as three ribbons. Then the apps it works in, and the frames for the product films.
 */

/** The phrase in the headline that is set in the serif. */
const SERIF_PHRASE = "AI companion";

/** The headline's first line, with "AI companion" in the serif when the line has it. */
function TitleLine({ title }: { title: string }) {
  const i = title.indexOf(SERIF_PHRASE);
  if (i < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">{SERIF_PHRASE}</span>
      {title.slice(i + SERIF_PHRASE.length)}
    </>
  );
}

export function BuddyHero() {
  const persona = usePersona();
  const isMac = useIsMacVisitor();

  // The hero has no intro of its own any more, so the page guide may start straight away.
  useEffect(() => setGuide({ heroDone: true }), []);

  const demo = useRef<HTMLDivElement>(null);
  useTrackInView(demo, "section_viewed", { section: "hero_demo", persona: persona.id });

  return (
    <section className="relative overflow-x-clip">
      <div className="landing-container relative flex flex-col items-center pt-32 text-center md:pt-36">
        {/* Painted straight away with the HTML (no entrance): it is the page's Largest Contentful Paint. */}
        <h1
          key={persona.id}
          className="max-w-4xl font-display text-[clamp(2.2rem,5.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--foreground)]"
        >
          <TitleLine title={persona.title} />
          <br />
          right{" "}
          {/* Kept together so the full stop never wraps onto its own line. */}
          <span className="whitespace-nowrap">by your cursor.</span>
        </h1>
        {/* Same face as the section headings further down ("don't take our word for it."). */}
        <p
          key={`sub-${persona.id}`}
          className="mt-5 max-w-[34rem] font-display text-[clamp(0.98rem,1.4vw,1.12rem)] font-medium leading-snug tracking-[-0.02em] text-[var(--foreground-muted)]"
        >
          {persona.sub}
        </p>
      </div>

      {/* The black pill is the centre of the hero and is the button: spoken words loop beside the
          headline and run into it, finished work leaves it as three ribbons. On narrow screens the
          regular button comes first and the flow follows. */}
      <div className="mt-10 lg:mt-12">
        <SentenceSplits heading={false} variant="hero">
          <div className="mx-auto flex h-full max-w-[1200px] flex-col items-center px-5 text-center lg:relative lg:block lg:px-0">
            {/* Narrow screens: the regular button. */}
            <div className={`relative mb-8 flex w-full justify-center lg:hidden ${isMac === false ? "max-w-md" : "max-w-sm"}`}>
              <HeroDownloadCta align="center" variant="minimal" size="xl" look="classic" label="Succeed with Lazur" location="hero" macLinkLocation="home_hero" className="w-full md:w-auto" />
            </div>
            {isMac === false ? null : <DownloadReassurance className="-mt-5 mb-8 lg:hidden" />}

            {/* Wide screens: the drawn pill itself is the link (an invisible hit area laid over it). */}
            <Link
              href="/download"
              aria-label="Download Lazur for Mac"
              onClick={() => track("cta_clicked", { location: "hero", label: "Get Lazur", destination: "/download" })}
              className="absolute left-1/2 top-[25.5%] hidden h-[31%] w-[19.67%] -translate-x-1/2 rounded-full lg:block"
            />
          </div>
        </SentenceSplits>
      </div>

      {/* The apps it works in, flowing over a dome. */}
      <AppDome />

      {/* The films sit inside the dome: its colour carries on down to a flat edge. */}
      <div className="bg-[var(--dome)] pb-10 md:pb-12">
        <div className="landing-container">
          <div ref={demo} data-guide-section="demo" className="mx-auto w-full max-w-6xl">
            {/* Empty frames for the product films, filled in later: one big film, two small ones beside it. */}
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] md:gap-4">
              <div className="order-2 grid grid-cols-2 gap-3 md:order-1 md:grid-cols-1 md:grid-rows-2 md:gap-4">
                <FilmSlot label="Film 2" className="aspect-video md:aspect-auto md:h-full" size="sm" tone="dark" />
                <FilmSlot label="Film 3" className="aspect-video md:aspect-auto md:h-full" size="sm" tone="dark" />
              </div>
              <div className="relative order-1 md:order-2">
                <FilmSlot label="Main film" size="lg" tone="dark" guide="demo-screen" />
              </div>
            </div>
          </div>
        </div>
        {/* The apps once more, in a straight line along the bottom of the band. */}
        <div className="mt-14 md:mt-20">
          <AppLine />
        </div>
      </div>
    </section>
  );
}
