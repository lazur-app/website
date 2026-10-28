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

const CORAL = "#ef5350";

function Section({ id, eyebrow, title, intro, children, tint = false }: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  tint?: boolean;
}) {
  return (
    <section
      id={id}
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

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className={`rounded-[22px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-7 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// --- Show me how ---------------------------------------------------------------------------

const GUIDE_STEPS = [
  { label: "Click Appearance", items: ["General", "Appearance", "Displays", "Wallpaper"], target: 1 },
  { label: "Choose Dark", items: ["Light", "Dark", "Auto"], target: 1, row: true },
  { label: "That's it", items: ["Light", "Dark", "Auto"], target: 1, row: true, done: true },
];

export function ShowMeHow() {
  return (
    <Section
      tint
      eyebrow="Show me how"
      title="Stuck? It walks you through."
      intro={<>Ask &ldquo;how do I turn on dark mode?&rdquo; It circles each click.</>}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {GUIDE_STEPS.map((step, i) => (
          <Card key={step.label} className="flex flex-col !p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">Step {i + 1}</p>
            <div className="mt-3 rounded-2xl bg-[var(--background-deep)] p-4">
              <div className={step.row ? "flex gap-2" : "space-y-1.5"}>
                {step.items.map((item, j) => {
                  const hit = j === step.target;
                  return (
                    <div
                      key={item}
                      className={`relative rounded-lg px-3 py-2 text-[13px] ${step.row ? "flex-1 text-center" : ""} ${
                        hit && step.done ? "bg-[#1c1917] text-white" : "bg-white text-[var(--foreground-muted)]"
                      }`}
                    >
                      {item}
                      {hit && !step.done ? (
                        <motion.span
                          className="pointer-events-none absolute -inset-1.5 rounded-xl border-2 border-dashed"
                          style={{ borderColor: CORAL }}
                          initial={{ opacity: 0, scale: 1.08 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: 0.2 + i * 0.3 }}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-auto flex items-center gap-2 pt-4 text-[15px] font-medium text-[var(--foreground)]">
              {step.done ? <Check className="h-4 w-4 text-emerald-500" /> : <Hand className="h-4 w-4" style={{ color: CORAL }} />}
              {step.label}
            </p>
          </Card>
        ))}
      </div>
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
  return (
    <Section
      tint
      eyebrow="Everyday"
      title="The little things, out loud."
      intro="Say it. Done."
    >
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
        {persona.everyday.map((say, i) => {
          const Icon = iconFor(say);
          return (
          <motion.span
            key={say}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-[15px] text-[var(--foreground)] shadow-[var(--shadow-card)]"
          >
            <Icon className="h-4 w-4 text-[var(--brand)]" />
            &ldquo;{say}&rdquo;
          </motion.span>
          );
        })}
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
    <section className="py-10 md:py-14">
      <div className="landing-container">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-x-10 gap-y-4 rounded-[22px] border border-[var(--border)] bg-white/70 px-6 py-5 text-[15px] text-[var(--foreground)] shadow-[var(--shadow-card)] md:flex-row">
          {[
            { icon: Hand, text: "Only while you hold the key" },
            { icon: Lock, text: "Nothing stored" },
            { icon: Check, text: "Asks before the big stuff" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 font-medium">
              <Icon className="h-4 w-4 text-[var(--brand)]" /> {text}
            </span>
          ))}
          <a href="/privacy" className="text-[13px] text-[var(--foreground-muted)] underline underline-offset-4 hover:text-[var(--foreground)]">Privacy</a>
        </div>
      </div>
    </section>
  );
}
