"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FilmSlot } from "@/components/landing/FilmSlot";
import { FeatureFilm } from "@/components/landing/FeatureFilm";
import { Sticker, type StickerName } from "@/components/landing/Sticker";
import { FounderSticker, type Pose, type Who } from "@/components/landing/FounderSticker";
import { useTrackInView } from "@/hooks/useTrackInView";

/**
 * The homepage sections under the hero, in the hero's own language: what you say in grey, as it
 * comes out of your mouth; what Lazur hands back on a black ribbon; one serif word per heading.
 * The films are empty frames for now.
 */

/** The serif used for the one accented word in a heading. */
const SERIF = "font-[family-name:var(--font-garamond)] font-normal italic tracking-[-0.02em]";

/** A section heading in the display sans, with room for one serif word (wrap it in <Accent>). */
function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(2.3rem,4.6vw,4rem)] font-medium lowercase leading-[1] tracking-[-0.04em] text-[var(--foreground)] ${className}`}>
      {children}
    </h2>
  );
}

function Accent({ children }: { children: ReactNode }) {
  return <span className={`${SERIF} text-[1.12em]`}>{children}</span>;
}

// --- The three jobs: dictates, does, teaches -------------------------------------------------

type Job = {
  /** Analytics section name (section_viewed). */
  name: string;
  verb: string;
  /** What you say, as it would come out of your mouth. */
  say: string;
  /** What Lazur hands back. */
  result: string;
  film: string;
  /** The sticker stuck on the corner of its film. */
  sticker: StickerName;
  /** The clip in /public/films (name without extension), when there is one. */
  clip?: string;
  /** One of us, hanging around the film. */
  founder?: { who: Who; pose: Pose; className: string; size: number; label?: string };
};

const JOBS: Job[] = [
  {
    name: "dictation",
    verb: "transcribes and corrects",
    say: "um reply to him, say it'll be ready by wednesday and uh sorry for the delay",
    result: "Hi Veer, the pitch deck will be ready by Wednesday. Sorry for the delay.",
    film: "Dictation: a casual spoken reply comes out as a clean email",
    clip: "feature-transcribes",
    sticker: "key",
    founder: { who: "veer", pose: "laptop", size: 120, className: "-bottom-10 -left-6 md:-left-12" },
  },
  {
    name: "background_jobs",
    verb: "does",
    say: "draft an email for these two guys about our first user",
    result: "✓ Done. The email is in the compose window.",
    film: "Lazur drafts an email and pastes a summary of the week's finance emails",
    clip: "feature-does",
    sticker: "check",
  },
  {
    name: "show_me_how",
    verb: "teaches",
    say: "how do i change the theme?",
    result: "Settings › Theme › View all › Save",
    film: "Lazur guides a Gmail theme change, one click at a time",
    clip: "feature-teaches",
    sticker: "cursor",
    founder: { who: "vaidik", pose: "yay", size: 130, className: "-bottom-12 -left-4 md:-left-10", label: "yay!" },
  },
];

/**
 * Lazur's answer typing itself out once it scrolls into view, with a blinking caret while it types.
 * The full text is in the page from the start (for readers and search); only its reveal is animated.
 */
function TypeOut({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(text.length);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    // Hide the text on the next frame (after hydration), then type it once it scrolls into view.
    const hide = requestAnimationFrame(() => setN(0));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setTyping(true);
        let i = 0;
        const step = () => {
          i += 1;
          setN(i);
          if (i < text.length) timer = window.setTimeout(step, 38 + Math.random() * 50);
          else window.setTimeout(() => setTyping(false), 900);
        };
        timer = window.setTimeout(step, 450);
      },
      { threshold: 0.8 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(hide);
      window.clearTimeout(timer);
    };
  }, [text]);
  return (
    <span ref={ref} className="relative inline-block">
      <span aria-hidden className="invisible">{text}</span>
      <span className="absolute inset-0" aria-label={text}>
        {text.slice(0, n)}
        {typing ? <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-white align-baseline" /> : null}
      </span>
    </span>
  );
}

/** One job: the exchange on one side, the film frame on the other. */
function JobRow({ job, flip }: { job: Job; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useTrackInView(ref, "section_viewed", { section: job.name });
  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <div className={`mx-auto w-full max-w-xl lg:mx-0 ${flip ? "lg:order-2" : ""}`}>
        <Heading>
          it <Accent>{job.verb}</Accent>.
        </Heading>
        <p className="mt-8 text-[17px] lowercase leading-snug text-[var(--foreground-faint)] md:text-[19px]">&ldquo;{job.say}&rdquo;</p>
        {/* The result, on the same black ribbon the hero uses. */}
        <p className="mt-4 inline-block max-w-full -rotate-[1.2deg] rounded-[22px] bg-[#0c0b0a] px-5 py-2.5 text-[15px] font-semibold leading-snug text-white md:text-[17px]">
          <TypeOut text={job.result} />
        </p>
      </div>
      <div className={`relative ${flip ? "lg:order-1" : ""}`}>
        {job.clip ? (
          <FeatureFilm src={`/films/${job.clip}.mp4`} poster={`/films/${job.clip}-poster.jpg`} label={job.film} bare />
        ) : (
          <FilmSlot label={job.film} className="aspect-[4/3]" />
        )}
        <Sticker name={job.sticker} size={96} rotate={flip ? -10 : 12} className={`absolute -top-9 ${flip ? "-left-5 md:-left-9" : "-right-5 md:-right-9"}`} />
        {job.founder ? (
          <FounderSticker who={job.founder.who} pose={job.founder.pose} size={job.founder.size} label={job.founder.label} className={`!absolute z-10 hidden sm:block ${job.founder.className}`} />
        ) : null}
      </div>
    </div>
  );
}

/** Dictates, does, teaches: the three ribbons from the hero, one at a time. */
export function ThreeJobs() {
  return (
    <section id="features" className="scroll-mt-28 py-20 md:py-32" aria-label="What Lazur does">
      <div className="landing-container">
        <div className="mx-auto flex max-w-6xl flex-col gap-24 md:gap-36">
          {JOBS.map((job, i) => (
            <JobRow key={job.name} job={job} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Privacy: three short promises -----------------------------------------------------------

/** GIFs chosen for the privacy cards, streamed from GIPHY's own media servers (as their terms ask), credited below. */
const giphy = (id: string) => ({ src: `https://media.giphy.com/media/${id}/giphy.mp4`, poster: `https://media.giphy.com/media/${id}/giphy_s.gif` });

const PRIVACY = [
  { text: "Only while you hold the key", guide: "privacy-key", ...giphy("7NoNw4pMNTvgc"), film: "A cat typing away: Lazur only listens while you hold the key" },
  { text: "Asks before the big stuff", guide: "privacy-ask", ...giphy("WOZ1mXCxiNjCQaLanL"), film: "Gulabo Sitabo: asking before going ahead" },
  { text: "Nothing stored", guide: "privacy-stored", ...giphy("R7m04yMaGWVeE"), film: "Men in Black memory flash: nothing is kept" },
];

export function YoureInCharge() {
  const ref = useRef<HTMLElement>(null);
  useTrackInView(ref, "section_viewed", { section: "privacy" });
  return (
    <section ref={ref} data-guide-section="privacy" className="pb-20 md:pb-32">
      <div className="landing-container">
        <Heading className="text-center">
          you&apos;re{" "}
          <span className="relative inline-block">
            <Accent>in charge</Accent>.
            <Sticker name="lock" size={70} rotate={14} className="absolute -right-16 -top-7 hidden sm:block" />
          </span>
        </Heading>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-5 md:mt-16">
          {PRIVACY.map((p) => (
            <div key={p.guide} className="relative flex flex-col gap-4">
              <FeatureFilm src={p.src} poster={p.poster} label={p.film} className="aspect-square" />
              <p data-guide={p.guide} className="text-center text-[16px] font-medium text-[var(--foreground)]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] tracking-wide text-[var(--foreground-faint)]">gifs powered by giphy</p>
      </div>
    </section>
  );
}
