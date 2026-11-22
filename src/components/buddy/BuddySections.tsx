"use client";

import { useRef, type ReactNode } from "react";
import { FilmSlot } from "@/components/landing/FilmSlot";
import { Sticker, type StickerName } from "@/components/landing/Sticker";
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
  copy: ReactNode;
  film: string;
  /** The sticker stuck on the corner of its film. */
  sticker: StickerName;
};

const JOBS: Job[] = [
  {
    name: "dictation",
    verb: "transcribes and corrects",
    say: "um tell sam we should meet thursday, no wait, friday at 3",
    result: "Hi Sam, let's meet Friday at 3.",
    copy: (
      <>
        Hold <b className="font-semibold text-[var(--foreground)]">fn</b> and talk. Lazur types it where your cursor is, minus the ums and the
        take-backs. Mail, Slack, Notes, anywhere you can type.
      </>
    ),
    film: "Dictation",
    sticker: "key",
  },
  {
    name: "background_jobs",
    verb: "does",
    say: "find me 3 flights to goa",
    result: "✓ Found 3 flights to Goa",
    copy: <>Hand off the research, the comparing, the boring stuff. Keep working, watch it cook in the notch, and get a finished report. Not a to-do.</>,
    film: "A background job",
    sticker: "check",
  },
  {
    name: "show_me_how",
    verb: "teaches",
    say: "wait how do i turn on dark mode",
    result: "System Settings › Appearance › Dark",
    copy: <>Stuck in an app? Just ask. Lazur looks at your screen and circles each click until it&apos;s done.</>,
    film: "Step-by-step guiding",
    sticker: "cursor",
  },
];

/** One job: the exchange and a line of copy on one side, the film frame on the other. */
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
        <p className="mt-4 inline-block -rotate-[1.2deg] rounded-full bg-[#0c0b0a] px-5 py-2.5 text-[15px] font-semibold text-white md:text-[17px]">
          {job.result}
        </p>
        <p className="mt-8 max-w-md text-[16px] leading-relaxed text-[var(--foreground-muted)] md:text-[17px]">{job.copy}</p>
      </div>
      <div className={`relative ${flip ? "lg:order-1" : ""}`}>
        <FilmSlot label={job.film} className="aspect-[4/3]" />
        <Sticker name={job.sticker} size={96} rotate={flip ? -10 : 12} className={`absolute -top-9 ${flip ? "-left-5 md:-left-9" : "-right-5 md:-right-9"}`} />
      </div>
    </div>
  );
}

/** Dictates, does, teaches: the three ribbons from the hero, one at a time. */
export function ThreeJobs() {
  return (
    <section className="py-20 md:py-32" aria-label="What Lazur does">
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

const PRIVACY = [
  { text: "Only while you hold the key", guide: "privacy-key", film: "The mic turns on only while the key is held" },
  { text: "Asks before the big stuff", guide: "privacy-ask", film: "Lazur reads an email back and waits for a yes" },
  { text: "Nothing stored", guide: "privacy-stored", film: "The screenshot and your voice are used once, then gone" },
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
            <div key={p.guide} className="flex flex-col gap-4">
              <FilmSlot label={p.film} className="aspect-square" size="sm" />
              <p data-guide={p.guide} className="text-center text-[16px] font-medium text-[var(--foreground)]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
