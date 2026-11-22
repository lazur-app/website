"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePersona } from "@/lib/personas";
import { setGuide } from "@/lib/guide";
import { useTrackInView } from "@/hooks/useTrackInView";
import { AppDome, AppLine } from "@/components/landing/AppDome";
import { FilmSlot } from "@/components/landing/FilmSlot";
import { Sticker } from "@/components/landing/Sticker";
import { PuzzleStage } from "./PuzzleStage";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { PenIntro } from "./PenIntro";
import styles from "./puzzle.module.css";

/**
 * Lab variant 1 of the homepage hero, "Puzzle". Same words and the same pieces below as the
 * homepage hero (BuddyHero): only the headline's face and the animation are new. The headline is
 * set in the live site's faces (Clash Display, "AI companion" in Garamond italic, flat rose), and in place of the ribbons
 * four jigsaw pieces, one per thing Lazur does, lock together into the "Get Lazur" button.
 */

/** The phrase in the headline that is picked out. */
const METAL_PHRASE = "AI companion";

/**
 * The headline's first line with "AI companion" picked out. Normally in the serif italic, in rose.
 * With `marker` it stays in the headline's own face and gets the live site's hand-drawn underline.
 */
function TitleLine({ title, marker, phrase, underlined }: { title: string; marker: boolean; phrase: React.RefObject<HTMLSpanElement | null>; underlined: boolean }) {
  const i = title.indexOf(METAL_PHRASE);
  if (i < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      {marker ? (
        <span ref={phrase} className="relative inline-block whitespace-nowrap">
          {METAL_PHRASE}
          {/* The live site's hand-drawn underline, drawn as Lazur's cursor passes under the words. */}
          <HandUnderline show={underlined} color="#e11d48" delay={0.85} duration={1.1} offset={2} />
        </span>
      ) : (
        <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em] text-[#d6246e]">{METAL_PHRASE}</span>
      )}
      {title.slice(i + METAL_PHRASE.length)}
    </>
  );
}

export function PuzzleHero({ flat = false }: { flat?: boolean }) {
  const persona = usePersona();

  // The hero has no intro of its own, so the page guide may start straight away.
  useEffect(() => setGuide({ heroDone: true }), []);

  // The plain variant opens the way the live site does: Lazur's cursor says hi and underlines "AI companion".
  const hero = useRef<HTMLElement>(null);
  const phrase = useRef<HTMLSpanElement>(null);
  const [underlined, setUnderlined] = useState(false);
  const startUnderline = useCallback(() => setUnderlined(true), []);

  const demo = useRef<HTMLDivElement>(null);
  useTrackInView(demo, "section_viewed", { section: "hero_demo", persona: persona.id });

  return (
    <section ref={hero} className="relative overflow-x-clip">
      {flat ? <PenIntro hero={hero} phrase={phrase} version={persona.id} onUnderline={startUnderline} /> : null}
      <div className="landing-container relative flex flex-col items-center pt-32 text-center md:pt-36">
        {/* Painted straight away with the HTML (no entrance): it is the page's Largest Contentful Paint. */}
        <h1
          key={persona.id}
          className={`${flat ? "font-sans font-bold leading-[1.04] tracking-[-0.05em]" : `${styles.headline} font-medium leading-[0.98] tracking-[-0.04em]`} max-w-5xl text-[clamp(2.2rem,5.4vw,5rem)] text-[var(--foreground)]`}
        >
          <TitleLine title={persona.title} marker={flat} phrase={phrase} underlined={underlined} />
          <br />
          <span className="relative inline-block">
            right{" "}
            {/* Kept together so the full stop never wraps onto its own line. */}
            <span className="whitespace-nowrap">by your cursor.</span>
            {/* Two pink cursors either side of the line, exact mirror images. They stay put. The plain variant has none. */}
            {flat ? null : (
              <>
              <span className={`${styles.cursor} ${styles.cursorLeft}`} aria-hidden>
                <Sticker name="pointer" size={94} />
              </span>
              <span className={`${styles.cursor} ${styles.cursorRight}`} aria-hidden>
                <Sticker name="pointer2" size={94} />
              </span>
              </>
            )}
          </span>
        </h1>
        <p
          key={`sub-${persona.id}`}
          className="mt-5 max-w-[34rem] font-display text-[clamp(0.98rem,1.4vw,1.12rem)] font-medium leading-snug tracking-[-0.02em] text-[var(--foreground-muted)]"
        >
          {persona.sub}
        </p>
      </div>

      {/* The four things Lazur does lock together into one: the "Get Lazur" button, the only one in the hero at every width. */}
      <div className="mt-4 lg:mt-6">
        <PuzzleStage flat={flat} />
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
