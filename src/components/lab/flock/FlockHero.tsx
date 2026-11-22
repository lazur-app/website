"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { usePersona } from "@/lib/personas";
import { setGuide } from "@/lib/guide";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";
import { DownloadReassurance } from "@/components/landing/DownloadReassurance";
import { AppDome, AppLine } from "@/components/landing/AppDome";
import { FilmSlot } from "@/components/landing/FilmSlot";
import { CursorFlock } from "./CursorFlock";
import { bigShoulders, fraunces } from "./font";
import styles from "./flock.module.css";

/**
 * The /lab/2 hero. Same words as the homepage hero, set as a poster: the headline in a soft, slightly wonky
 * serif with "AI companion" as solid chrome letters, then a flock of metal cursors that lands as the
 * word "lazur" and as each of the things Lazur does, then the Get Lazur button. The apps and the
 * film frames follow, as on the homepage.
 */

/** The phrase in the headline that is set in chrome. */
const CHROME_PHRASE = "AI companion";

/** The headline's first line, with "AI companion" as chrome letters when the line has it. */
function TitleLine({ title }: { title: string }) {
  const i = title.indexOf(CHROME_PHRASE);
  if (i < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <span className={styles.chrome}>
        <span aria-hidden className={styles.extrude}>{CHROME_PHRASE}</span>
        <span className={styles.face}>{CHROME_PHRASE}</span>
        <span aria-hidden className={styles.shine}>{CHROME_PHRASE}</span>
      </span>
      {title.slice(i + CHROME_PHRASE.length)}
    </>
  );
}

export function FlockHero() {
  const persona = usePersona();

  // The hero has no intro that the page guide needs to wait for.
  useEffect(() => setGuide({ heroDone: true }), []);

  const demo = useRef<HTMLDivElement>(null);
  useTrackInView(demo, "section_viewed", { section: "hero_demo", persona: persona.id });

  return (
    <section className={`relative overflow-x-clip ${fraunces.variable}`}>
      {/* Lights the chrome letters: a soft dome raised from the letter shapes, with one hard light from the upper left. */}
      <svg aria-hidden focusable="false" width="0" height="0" className="absolute">
        <defs>
          <filter id="flock-bevel" x="-5%" y="-15%" width="110%" height="130%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="dome" />
            <feSpecularLighting in="dome" surfaceScale="4.5" specularConstant="0.95" specularExponent="24" lightingColor="#ffffff" result="key">
              <feDistantLight azimuth="232" elevation="52" />
            </feSpecularLighting>
            <feComposite in="key" in2="SourceAlpha" operator="in" result="keyIn" />
            <feComposite in="SourceGraphic" in2="keyIn" operator="arithmetic" k1="0" k2="1" k3="0.9" k4="0" />
          </filter>
        </defs>
      </svg>

      <div className={`landing-container relative flex flex-col items-center text-center ${styles.top}`}>
        {/* Painted straight away with the HTML (no entrance): it is the page's Largest Contentful Paint. */}
        <h1 key={persona.id} className={styles.headline}>
          <span className={styles.line}>
            <TitleLine title={persona.title} />
          </span>
          <br />
          {/* Kept on one line, so the full stop never wraps by itself. */}
          <span className={styles.line}>right by your cursor.</span>
        </h1>
        <p
          key={`sub-${persona.id}`}
          className={`max-w-[34rem] font-display font-medium leading-snug tracking-[-0.02em] text-[var(--foreground-muted)] ${styles.sub}`}
        >
          {persona.sub}
        </p>
      </div>

      {/* The flock: it lands as "lazur", then as each thing Lazur does, and as "lazur" again. */}
      <CursorFlock fontFamily={bigShoulders.style.fontFamily} className={styles.stageGap} />

      {/* The button, just under the stage, and the line that takes the risk out of clicking it. */}
      <div className={`relative z-20 flex flex-col items-center px-5 text-center ${styles.cta}`}>
        <Link
          href="/download"
          aria-label="Download Lazur for Mac"
          onClick={() => track("cta_clicked", { location: "hero", label: "Get Lazur", destination: "/download" })}
          className={styles.pill}
        >
          <span className={styles.pillInner}>
            <AppleIcon className="h-[1.08em] w-[1.08em] -translate-y-[0.07em]" />
            Get Lazur
          </span>
        </Link>
        <DownloadReassurance className={styles.reassure} />
      </div>

      {/* The apps it works in, flowing over a dome. */}
      <div className="mt-10 md:mt-12">
        <AppDome />
      </div>

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
