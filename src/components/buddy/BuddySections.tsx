"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
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

const INK = "#2563eb";

/** A hand-drawn loop around the box it sits in, drawn when `show` turns on. */
function Loop({ show }: { show: boolean }) {
  return (
    <svg className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
      <motion.path
        d="M54 4 C82 3 98 16 97 30 C96 47 74 57 48 56 C22 55 3 45 4 29 C5 14 24 5 60 7"
        fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ pathLength: { duration: show ? 0.6 : 0, ease: "easeInOut" }, opacity: { duration: 0.15 } }}
      />
    </svg>
  );
}

/**
 * When this section scrolls into view, the blue sparkle walks through it the way Lazur guides you:
 * circles Appearance, then Dark, then Dark switches on. It plays again each time you come back.
 */
export function ShowMeHow() {
  const box = useRef<HTMLDivElement>(null);
  const targets = useRef<Array<HTMLElement | null>>([]);
  const inView = useInView(box, { amount: 0.5 });
  const [stage, setStage] = useState(0); // 0 waiting, 1 Appearance, 2 Dark, 3 done
  const [spots, setSpots] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    if (!inView) return;
    const times = [700, 2300, 3900, 7600];
    const timers = times.map((t, i) => window.setTimeout(() => setStage(i < 3 ? i + 1 : 0), t));
    const again = window.setInterval(() => {
      times.forEach((t, i) => timers.push(window.setTimeout(() => setStage(i < 3 ? i + 1 : 0), t)));
    }, 8000);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(again);
      setStage(0);
    };
  }, [inView]);

  useEffect(() => {
    const measure = () => {
      const b = box.current?.getBoundingClientRect();
      if (!b) return;
      setSpots(targets.current.map((el) => {
        const r = el?.getBoundingClientRect();
        return r ? [r.right - b.left + 6, r.top - b.top - 6] : [0, 0];
      }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [inView]);

  // Waiting: just above the first card. Then each target in turn.
  const at = stage === 0 ? (spots[0] ? [spots[0][0] - 80, -40] : [0, -40]) : spots[stage - 1] ?? [0, 0];

  return (
    <Section
      tint
      eyebrow="Show me how"
      title="Stuck? It walks you through."
      intro={<>Ask &ldquo;how do I turn on dark mode?&rdquo; It circles each click.</>}
    >
      <div ref={box} className="relative grid gap-5 md:grid-cols-3">
        {GUIDE_STEPS.map((step, i) => {
          const active = stage >= i + 1;
          return (
            <Card key={step.label} className="flex flex-col !p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">Step {i + 1}</p>
              <div className="mt-3 rounded-2xl bg-[var(--background-deep)] p-4">
                <div className={step.row ? "flex gap-2" : "space-y-1.5"}>
                  {step.items.map((item, j) => {
                    const hit = j === step.target;
                    const on = hit && step.done && active;
                    return (
                      <div
                        key={item}
                        ref={hit ? (el) => { targets.current[i] = el; } : undefined}
                        className={`relative rounded-lg px-3 py-2 text-[13px] transition-colors duration-300 ${step.row ? "flex-1 text-center" : ""} ${
                          on ? "bg-[#1c1917] text-white" : "bg-white text-[var(--foreground-muted)]"
                        }`}
                      >
                        {item}
                        {hit && !step.done ? <Loop show={active} /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className={`mt-auto flex items-center gap-2 pt-4 text-[15px] font-medium transition-opacity duration-300 ${active ? "opacity-100" : "opacity-40"} text-[var(--foreground)]`}>
                {step.done ? <Check className="h-4 w-4 text-emerald-500" /> : <Hand className="h-4 w-4" style={{ color: INK }} />}
                {step.label}
              </p>
            </Card>
          );
        })}

        {/* Lazur's sparkle, flying from step to step */}
        <motion.svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-0 top-0 z-10 -ml-3 -mt-3 h-6 w-6"
          style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.55))" }}
          initial={false}
          animate={{ x: at[0], y: at[1], opacity: inView ? 1 : 0, rotate: stage * 30 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          aria-hidden
        >
          <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={INK} />
        </motion.svg>
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
