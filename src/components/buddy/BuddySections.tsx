"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  BellRing,
  CalendarPlus,
  Check,
  Eye,
  FileText,
  Hand,
  Link2,
  Lock,
  MousePointerClick,
  Music,
  Search,
  StickyNote,
  Timer,
  Volume2,
  Workflow,
  Zap,
} from "lucide-react";
import { AppMarquee } from "@/components/AppMarquee";

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

/** A black notch pill, as it looks on a Mac. */
function MiniPill({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="mx-auto flex h-9 w-full max-w-[17rem] items-center justify-between rounded-b-[14px] rounded-t-[4px] bg-black px-4 text-[12.5px] font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
      <span className="flex items-center gap-1.5 truncate">{left}</span>
      {right}
    </div>
  );
}

// --- Sees · Points · Does ------------------------------------------------------------------

export function SeesPointsDoes() {
  return (
    <Section
      eyebrow="Not a chat box"
      title={<>It sees. It points.<br />It does it for you.</>}
      intro="Other assistants wait in a window for you to explain everything. Lazur is already looking at what you're looking at."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <Eye className="h-6 w-6 text-[var(--brand)]" />
          <h3 className="mt-4 text-[19px] font-semibold text-[var(--foreground)]">It sees your screen</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Ask about whatever is in front of you: an error, a chart, a long thread. Lazur looks the
            moment you ask, and only then.
          </p>
          <p className="mt-5 rounded-xl bg-[var(--background-deep)] px-4 py-3 text-[14px] text-[var(--foreground)]">
            &ldquo;What does this error mean?&rdquo;
          </p>
        </Card>
        <Card>
          <MousePointerClick className="h-6 w-6" style={{ color: CORAL }} />
          <h3 className="mt-4 text-[19px] font-semibold text-[var(--foreground)]">It points at things</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Can&apos;t find a button? Ask where it is. Lazur draws a circle around it, right on your
            screen.
          </p>
          <p className="mt-5 rounded-xl bg-[var(--background-deep)] px-4 py-3 text-[14px] text-[var(--foreground)]">
            &ldquo;Where do I export this as PDF?&rdquo;
          </p>
        </Card>
        <Card>
          <Zap className="h-6 w-6 text-amber-500" />
          <h3 className="mt-4 text-[19px] font-semibold text-[var(--foreground)]">It gets it done</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Reminders, timers, calendar, music, apps and links happen as you say them. Bigger jobs run
            in the background.
          </p>
          <p className="mt-5 rounded-xl bg-[var(--background-deep)] px-4 py-3 text-[14px] text-[var(--foreground)]">
            &ldquo;Remind me to send the invoice at 5.&rdquo;
          </p>
        </Card>
      </div>
    </Section>
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
      title="Stuck in an app? It walks you through it."
      intro={<>Say &ldquo;how do I turn on dark mode?&rdquo; Lazur circles the first thing to click, waits for you, then shows the next one, until you&apos;re there.</>}
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

// --- Background jobs -----------------------------------------------------------------------

const JOBS = [
  { title: "Standing desk research", status: "Reading 8 pages", progress: 0.62 },
  { title: "Tidy my Downloads folder", status: "34 files sorted", progress: 1 },
  { title: "Sum up my unread newsletters", status: "Done", progress: 1, report: true },
];

export function BackgroundJobs() {
  return (
    <Section
      eyebrow="Jobs"
      title="Hand off the long stuff."
      intro="Research, reading, sorting files. Lazur works on it in its own Chrome tabs and on your Mac while you keep going, and lets you know when it's done or needs you."
    >
      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <MiniPill left="2 jobs working" right={<span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white" />} />
          <div className="rounded-[20px] bg-[#111] p-3">
            {JOBS.map((job) => (
              <div key={job.title} className="rounded-xl px-3 py-3 text-left">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[14px] font-medium text-white">{job.title}</p>
                  {job.report ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-semibold text-black">
                      <FileText className="h-3 w-3" /> Full report
                    </span>
                  ) : (
                    <span className="shrink-0 text-[12px] text-white/50">{job.status}</span>
                  )}
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: job.progress === 1 ? "#34d399" : CORAL }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${job.progress * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <ul className="space-y-5 text-left">
          {[
            ["Say it once", "\"Find the best standing desks under $300 and compare them.\" That's the whole brief."],
            ["Keep working", "The job runs on its own. The notch shows it's working; hover to see where it's at."],
            ["Get the result", "A short summary out loud, and a full report when there's more to read."],
          ].map(([title, body]) => (
            <li key={title}>
              <p className="text-[17px] font-semibold text-[var(--foreground)]">{title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--foreground-muted)]">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// --- Everyday ------------------------------------------------------------------------------

const EVERYDAY: Array<{ icon: typeof Timer; say: string }> = [
  { icon: Timer, say: "Set a timer for 10 minutes" },
  { icon: BellRing, say: "Remind me to call Mom at 6" },
  { icon: CalendarPlus, say: "Lunch with Sam on Friday at 1" },
  { icon: Music, say: "Play something calm" },
  { icon: Volume2, say: "Turn it down a bit" },
  { icon: AppWindow, say: "Open Figma" },
  { icon: Link2, say: "Open my Linear inbox" },
  { icon: Search, say: "Search flights to Goa" },
  { icon: StickyNote, say: "Note: try the new onboarding copy" },
  { icon: Workflow, say: "Run my Morning shortcut" },
];

export function EverydayThings() {
  return (
    <Section
      tint
      eyebrow="Everyday"
      title="The little things, out loud."
      intro="No app switching, no clicking through menus. Say it, and it's done before you'd have found the window."
    >
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
        {EVERYDAY.map(({ icon: Icon, say }, i) => (
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
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-[17rem]">
        <MiniPill left={<><Timer className="h-3.5 w-3.5" style={{ color: "#ff8a80" }} /> Timer</>} right={<span className="font-semibold tabular-nums">9:58</span>} />
        <p className="mt-3 text-center text-[13px] text-[var(--foreground-faint)]">Timers tick right in the notch.</p>
      </div>
    </Section>
  );
}

// --- Typing --------------------------------------------------------------------------------

const TYPED = [
  { said: "um lets meet on friday no actually thursday at 3", wrote: "Let's meet on Thursday at 3." },
  { said: "things to buy first milk second eggs third bread", wrote: "Things to buy:\n1. Milk\n2. Eggs\n3. Bread" },
];

export function TypesForYou() {
  return (
    <Section
      eyebrow="Dictation"
      title="And yes, it types for you."
      intro="Hold fn and talk in any app. Lazur drops the ums, keeps your corrections and formats lists, right where your cursor is."
    >
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        {TYPED.map(({ said, wrote }) => (
          <Card key={said}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">You say</p>
            <p className="mt-2 text-[15px] italic text-[var(--foreground-muted)]">&ldquo;{said}&rdquo;</p>
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">Lazur types</p>
            <p className="mt-2 whitespace-pre-line text-[16px] font-medium text-[var(--foreground)]">{wrote}</p>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-5 grid max-w-5xl gap-5 md:grid-cols-3">
        {[
          ["Snippets", "Say “my email” and your full address appears. Same for links, sign-offs, anything you type a lot."],
          ["Words", "Teach it names and terms once. They're spelled right every time after."],
          ["Clipboard slots", "⌃⇧1 saves what you copied, ⌃1 pastes it anywhere. Up to 9 slots."],
        ].map(([title, body]) => (
          <Card key={title} className="!p-5">
            <p className="text-[16px] font-semibold text-[var(--foreground)]">{title}</p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--foreground-muted)]">{body}</p>
          </Card>
        ))}
      </div>
      <div className="mx-auto mt-14 max-w-4xl">
        <p className="mb-4 text-center text-[13px] text-[var(--foreground-faint)]">Works in every Mac app</p>
        <AppMarquee iconSize={22} iconClassName="h-[22px] w-[22px] shrink-0 object-contain opacity-55 grayscale" groupClassName="gap-8 pr-8" />
      </div>
    </Section>
  );
}

// --- Control -------------------------------------------------------------------------------

export function YoureInCharge() {
  return (
    <Section
      tint
      eyebrow="Privacy"
      title="You're in charge."
      intro="Lazur is a buddy, not a spy."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { icon: Hand, title: "Only when you hold the key", body: "It listens and looks at your screen only while you hold the shortcut. Nothing runs in the background." },
          { icon: Lock, title: "Nothing is kept", body: "Your audio and screenshots are used for your request and not stored. Your content is never used to train AI models." },
          { icon: Check, title: "Asks before the big stuff", body: "Background jobs stop and ask you before anything they can't undo, and every job can be stopped from the notch." },
        ].map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <Icon className="h-6 w-6 text-[var(--brand)]" />
            <h3 className="mt-4 text-[18px] font-semibold text-[var(--foreground)]">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">{body}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-[14px] text-[var(--foreground-muted)]">
        Exactly what is sent where is spelled out in our <a href="/privacy" className="font-medium text-[var(--foreground)] underline underline-offset-4">privacy policy</a>.
      </p>
    </Section>
  );
}
