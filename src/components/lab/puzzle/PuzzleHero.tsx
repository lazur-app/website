"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePersona } from "@/lib/personas";
import { setGuide } from "@/lib/guide";
import { useTrackInView } from "@/hooks/useTrackInView";
import { AppDome } from "@/components/landing/AppDome";
import { LaunchFilm } from "@/components/landing/LaunchFilm";
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
      <div className="landing-container relative flex flex-col items-center pt-28 text-center md:pt-32 lg:pt-36">
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

      {/* The launch film right under the button, so it peeks up from the bottom of the first screen. The dark band
          of apps runs behind it, its crown crossing the middle of the film. */}
      <div className="landing-container relative z-10 mt-6 md:mt-10">
        <div ref={demo} data-guide-section="demo" className="relative mx-auto w-full max-w-4xl">
          {/* A soft black shadow behind the film. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-[18px]"
            style={{ boxShadow: "0 0 60px 2px rgba(12,11,10,0.16), 0 22px 90px 4px rgba(12,11,10,0.2)" }}
            aria-hidden
          />
          <LaunchFilm guide="demo-screen" dark={false} label="" />
        </div>
      </div>
      {/* Pulled up by half the film's height (its width is min(56rem, 100vw - gutters), its shape 1480:1080). */}
      <div style={{ marginTop: "calc(-0.365 * min(56rem, 100vw - 2.5rem) - 70px)" }}>
        <AppDome behind />
      </div>
      <div className="bg-[var(--dome)] pb-10 md:pb-12">
        {/* Below the film's bottom edge, which hangs into the band. */}
        <p className="text-center text-[14px] text-white/55" style={{ paddingTop: "max(16px, calc(0.365 * min(56rem, 100vw - 2.5rem) - 260px + 70px + 28px))" }}>
          works in every app on your Mac
        </p>
      </div>
    </section>
  );
}

