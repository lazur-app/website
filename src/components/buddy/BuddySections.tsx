"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  BellRing,
  CalendarPlus,
  Check,
  Hand,
  Link2,
  Lock,
  MessageCircle,
  Music,
  Search,
  StickyNote,
  Timer,
  Volume2,
  Workflow,
} from "lucide-react";
import { AppMarquee } from "@/components/AppMarquee";
import { usePersona } from "@/lib/personas";
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

export function EverydayThings() {
  const persona = usePersona();
  const lit = useGuideStep("everyday");
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
        guide="everyday-video"
        className="aspect-[4/3] max-w-xl"
        src={`${VIDEOS}/lazur-timer.mp4`}
        poster={`${VIDEOS}/lazur-timer-poster.jpg`}
        label="You say “set a pasta timer for 10 minutes”. The notch becomes a ticking timer, then rings when the pasta is done."
      />
      </div>
      <div className="mx-auto mt-14 max-w-4xl">
        <p className="mb-4 text-center text-[13px] text-[var(--foreground-faint)]">Works in every Mac app</p>
        <AppMarquee iconSize={22} iconClassName="h-[22px] w-[22px] shrink-0 object-contain opacity-55 grayscale" groupClassName="gap-8 pr-8" />
      </div>
    </Section>
  );
}

// --- Privacy, in one row ------------------------------------------------------------------

export function YoureInCharge() {
  return (
    <section data-guide-section="privacy" className="py-10 md:py-14">
      <div className="landing-container">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-x-10 gap-y-4 rounded-[22px] border border-[var(--border)] bg-white/70 px-6 py-5 text-[15px] text-[var(--foreground)] shadow-[var(--shadow-card)] md:flex-row">
          {[
            { icon: Hand, text: "Only while you hold the key", guide: "privacy-key" },
            { icon: Lock, text: "Nothing stored", guide: "privacy-stored" },
            { icon: Check, text: "Asks before the big stuff" },
          ].map(({ icon: Icon, text, guide }) => (
            <span key={text} data-guide={guide} className="flex items-center gap-2 font-medium">
              <Icon className="h-4 w-4 text-[var(--brand)]" /> {text}
            </span>
          ))}
          <a href="/privacy" className="text-[13px] text-[var(--foreground-muted)] underline underline-offset-4 hover:text-[var(--foreground)]">Privacy</a>
        </div>
      </div>
    </section>
  );
}
