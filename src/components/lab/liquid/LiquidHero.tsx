"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { usePersona } from "@/lib/personas";
import { setGuide } from "@/lib/guide";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { DownloadReassurance } from "@/components/landing/DownloadReassurance";
import { AppDome, AppLine } from "@/components/landing/AppDome";
import { FilmSlot } from "@/components/landing/FilmSlot";
import { LiquidStage } from "./LiquidStage";
import { instrumentSerif, unbounded } from "./fonts";
import styles from "./liquid.module.css";

/**
 * The /lab/5 hero: the homepage hero (BuddyHero) with the ribbon flow replaced by a stage of liquid
 * chrome, and the headline set in a wide bold face against a thin italic serif. Same words, same
 * button destination and tracking, same dome and film frames below.
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
      <span className={styles.serif}>{SERIF_PHRASE}</span>
      {title.slice(i + SERIF_PHRASE.length)}
    </>
  );
}

export function LiquidHero() {
  const persona = usePersona();
  const isMac = useIsMacVisitor();

  // The hero has no intro of its own, so the page guide may start straight away.
  useEffect(() => setGuide({ heroDone: true }), []);

  const demo = useRef<HTMLDivElement>(null);
  useTrackInView(demo, "section_viewed", { section: "hero_demo", persona: persona.id });

  return (
    <section className={`relative overflow-x-clip ${unbounded.variable} ${instrumentSerif.variable}`}>
      {/* Sized against the height of the window as well as its width, so headline, stage and button share the first screen. */}
      <div className={`landing-container relative flex flex-col items-center text-center ${styles.top}`}>
        {/* Painted straight away with the HTML (no entrance): it is the page's Largest Contentful Paint. */}
        <h1 key={persona.id} className={styles.headline}>
          <TitleLine title={persona.title} />
          <br />
          right{" "}
          {/* Kept together so the full stop never wraps onto its own line. */}
          <span className="whitespace-nowrap">by your cursor.</span>
        </h1>

        {/* Same face as the section headings further down. */}
        <p key={`sub-${persona.id}`} className={`max-w-[34rem] font-display font-medium leading-snug tracking-[-0.02em] text-[var(--foreground-muted)] ${styles.sub}`}>
          {persona.sub}
        </p>
      </div>

      {/* Centre stage: one blob of liquid chrome that is the word, then each thing Lazur does. */}
      <div className="px-4">
        <LiquidStage />
      </div>

      {/* The button, just below the stage. Narrow screens keep the regular one (it also looks after visitors who are not on a Mac). */}
      <div className="relative z-10 flex flex-col items-center px-5 pb-8 text-center md:pb-12 lg:pb-14">
        <div className={`flex w-full justify-center lg:hidden ${isMac === false ? "max-w-md" : "max-w-sm"}`}>
          <HeroDownloadCta align="center" variant="minimal" size="xl" look="classic" label="Succeed with Lazur" location="hero" macLinkLocation="home_hero" className="w-full md:w-auto" />
        </div>
        {isMac === false ? null : <DownloadReassurance className="mt-3 lg:hidden" />}

        <Link
          href="/download"
          aria-label="Download Lazur for Mac"
          onClick={() => track("cta_clicked", { location: "hero", label: "Get Lazur", destination: "/download" })}
          className={`${styles.cta} hidden lg:inline-flex`}
        >
          <span className={styles.ctaFace}>
            <AppleIcon />
            Get Lazur
          </span>
        </Link>
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
