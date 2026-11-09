"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  BellRing,
  CalendarPlus,
  Check,
  Link2,
  MessageCircle,
  Music,
  Search,
  StickyNote,
  Timer,
  Volume2,
  Workflow,
} from "lucide-react";
import { AppMarquee } from "@/components/AppMarquee";
import { usePersona, type PersonaId } from "@/lib/personas";
import { useGuideStep } from "@/lib/guide";
import { LoopVideo } from "./LoopVideo";


function Section({ id, guide, eyebrow, title, intro, children, tint = false }: {
  id?: string;
  /** This section is a stop for the page guide (components/buddy/Guide.tsx). */
  guide?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  tint?: boolean;
}) {
  return (
    <section
      id={id}
      data-guide-section={guide}
      className="relative py-20 md:py-28"
      // Tinted sections fade in and out, so the page reads as one flow instead of stacked bands.
      style={tint ? { background: "linear-gradient(to bottom, transparent 0%, var(--background-deep) 18%, var(--background-deep) 82%, transparent 100%)" } : undefined}
    >
      <div className="landing-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">{eyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]">
            {title}
          </h2>
          {intro ? <p className="mt-4 text-[17px] leading-relaxed text-[var(--foreground-muted)]">{intro}</p> : null}
        </motion.div>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}

// --- Show me how ---------------------------------------------------------------------------

const VIDEOS = "https://releases.lazur.app/videos";

/** A short loop: you ask how to turn on dark mode and Lazur circles each click until it's on. */
export function ShowMeHow() {
  return (
    <Section
      tint
      guide="guide"
      eyebrow="Show me how"
      title="Stuck? It walks you through."
      intro={<>Ask &ldquo;how do I turn on dark mode?&rdquo; It circles each click.</>}
    >
      <LoopVideo
        guide="guide-video"
        className="aspect-video max-w-4xl"
        src={`${VIDEOS}/lazur-dark.mp4`}
        poster={`${VIDEOS}/lazur-dark-poster.jpg`}
        label="You ask how to turn on dark mode. Lazur circles Appearance, then Dark, and the Mac switches to dark mode."
      />
    </Section>
  );
}

// --- Everyday ------------------------------------------------------------------------------

/** A fitting icon for an everyday command, from its words. */
function iconFor(say: string): typeof Timer {
  const t = say.toLowerCase();
  if (t.includes("timer")) return Timer;
  if (t.includes("remind")) return BellRing;
  if (/(lunch|call with|meeting|friday at|thursday at)/.test(t)) return CalendarPlus;
  if (t.includes("play")) return Music;
  if (t.includes("turn it")) return Volume2;
  if (t.startsWith("note")) return StickyNote;
  if (t.includes("search") || t.includes("research")) return Search;
  if (t.includes("shortcut")) return Workflow;
  if (t.includes("open")) return t.includes("my ") ? Link2 : AppWindow;
  return MessageCircle;
}

/** The Everyday loop follows the "I am …" picker; everyone sees the pasta timer. */
const PERSONA_LOOPS: Record<PersonaId, { file: string; label: string }> = {
  everyone: { file: "lazur-timer", label: "You say “set a pasta timer for 10 minutes”. The notch becomes a ticking timer, then rings when the pasta is done." },
  founder: { file: "lazur-persona-founder", label: "An investor asks for a follow-up. You say “reply that Thursday at 3 works and I’ll send the deck tonight”. Lazur drafts it and pastes it after you approve." },
  developer: { file: "lazur-persona-developer", label: "You ask why the code is failing. Lazur circles line 18 and says user can be null, then you dictate the commit message." },
  student: { file: "lazur-persona-student", label: "On a cell diagram you ask “what’s this part?”. Lazur circles it, labels it mitochondrion and explains what it does." },
  lawyer: { file: "lazur-persona-lawyer", label: "In a 40-page agreement you ask where the termination clause is. Lazur circles section 12.2 and sums it up." },
};

export function EverydayThings() {
  const persona = usePersona();
  const lit = useGuideStep("everyday");
  const loop = PERSONA_LOOPS[persona.id] ?? PERSONA_LOOPS.everyone;
  return (
    <Section
      tint
      guide="everyday"
      eyebrow="Everyday"
      title="The little things, out loud."
      intro="Say it. Done."
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
      <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
        {persona.everyday.map((say, i) => {
          const Icon = iconFor(say);
          return (
          <motion.span
            key={say}
            data-guide={`chip-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className={`inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-[15px] text-[var(--foreground)] shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-300 ${
              lit === i ? "border-[#2563eb] shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" : "border-[var(--border)]"
            }`}
          >
            <Icon className="h-4 w-4 text-[var(--brand)]" />
            &ldquo;{say}&rdquo;
          </motion.span>
          );
        })}
      </div>
      <LoopVideo
        key={loop.file}
        guide="everyday-video"
        className="aspect-[4/3] max-w-xl"
        src={`${VIDEOS}/${loop.file}.mp4`}
        poster={`${VIDEOS}/${loop.file}-poster.jpg`}
        label={loop.label}
      />
      </div>
      <div className="mx-auto mt-14 max-w-4xl">
        <p className="mb-4 text-center text-[13px] text-[var(--foreground-faint)]">Works in every Mac app</p>
        <AppMarquee iconSize={22} iconClassName="h-[22px] w-[22px] shrink-0 object-contain opacity-55 grayscale" groupClassName="gap-8 pr-8" />
      </div>
    </Section>
  );
}

// --- Split sections: copy on one side, a loop on the other -----------------------------------

function SplitSection({ guide, eyebrow, title, intro, points, video, flip = false }: {
  guide?: string;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  points: string[];
  video: ReactNode;
  /** Put the video on the left. */
  flip?: boolean;
}) {
  return (
    <section data-guide-section={guide} className="relative py-20 md:py-28">
      <div className="landing-container">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className={`text-center lg:text-left ${flip ? "lg:order-2" : ""}`}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">{eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]">
              {title}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--foreground-muted)]">{intro}</p>
            <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 text-left text-[15px] text-[var(--foreground)] lg:mx-0">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
          <div className={flip ? "lg:order-1" : ""}>{video}</div>
        </div>
      </div>
    </section>
  );
}

/** Dictation: say it messy, it lands clean in whatever app you're in. */
export function TalkItTypes() {
  return (
    <SplitSection
      guide="dictation"
      eyebrow="Dictation"
      title={<>Speak messy.<br />It writes clean.</>}
      intro={<>Hold <b className="font-semibold text-[var(--foreground)]">fn</b> and talk. Lazur types it where your cursor is, without the ums.</>}
      points={[
        "Drops fillers and false starts",
        "Catches “no wait, Thursday” and fixes it",
        "Turns spoken lists into real lists",
        "Works in Mail, Slack, Notes and every other app",
      ]}
      video={
        <LoopVideo
          guide="dictation-video"
          className="aspect-[4/3] max-w-xl"
          src={`${VIDEOS}/lazur-dictation.mp4`}
          poster={`${VIDEOS}/lazur-dictation-poster.jpg`}
          label="Three times you speak with ums and corrections, in Mail, Slack and Notes. Each time the clean sentence or list appears where you were typing."
        />
      }
    />
  );
}

/** Background jobs: ask, keep working, get a finished result. */
export function WorksWhileYouWork() {
  return (
    <SplitSection
      flip
      guide="jobs"
      eyebrow="Background jobs"
      title="It works while you work."
      intro="Hand off the research, the comparing, the busywork. Lazur does it in the background and taps you when it's done."
      points={[
        "Keep using your Mac the whole time",
        "Watch progress right in the notch",
        "Get a finished report, not a to-do",
      ]}
      video={
        <LoopVideo
          guide="jobs-video"
          className="aspect-[4/3] max-w-xl"
          src={`${VIDEOS}/lazur-jobs.mp4`}
          poster={`${VIDEOS}/lazur-jobs-poster.jpg`}
          label="You ask for 3 flights to Goa and keep writing your plan. The notch shows Lazur searching and comparing, then 3 flights found. You open the report."
        />
      }
    />
  );
}

// --- Privacy: three short loops ----------------------------------------------------------

const PRIVACY = [
  { file: "lazur-privacy-key", text: "Only while you hold the key", guide: "privacy-key", label: "Holding the keys turns the mic on and the notch listens. Letting go turns it off." },
  { file: "lazur-privacy-ask", text: "Asks before the big stuff", guide: "privacy-ask", label: "Lazur reads back the email it will send and waits. You say yes, then it sends." },
  { file: "lazur-privacy-stored", text: "Nothing stored", guide: "privacy-stored", label: "The screenshot and your voice are used for one answer, then they're gone." },
];

export function YoureInCharge() {
  return (
    <section data-guide-section="privacy" className="py-16 md:py-20">
      <div className="landing-container">
        <h2 className="mx-auto max-w-2xl text-center font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] text-[var(--foreground)]">
          You&apos;re in charge.
        </h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-3">
          {PRIVACY.map((p) => (
            <div key={p.file} className="flex flex-col items-center gap-3">
              <LoopVideo
                className="aspect-square max-w-[320px]"
                src={`${VIDEOS}/${p.file}.mp4`}
                poster={`${VIDEOS}/${p.file}-poster.jpg`}
                label={p.label}
              />
              <p data-guide={p.guide} className="text-[15px] font-medium text-[var(--foreground)]">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <a href="/privacy" className="text-[13px] text-[var(--foreground-muted)] underline underline-offset-4 hover:text-[var(--foreground)]">How Lazur handles your data</a>
        </p>
      </div>
    </section>
  );
}
