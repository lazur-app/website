"use client";

import { motion } from "framer-motion";

const apps = [
  { name: "Slack", tint: "from-violet-100 to-fuchsia-50" },
  { name: "Gmail", tint: "from-rose-100 to-amber-50" },
  { name: "Notion", tint: "from-zinc-100 to-stone-50" },
  { name: "Chrome", tint: "from-sky-100 to-amber-50" },
  { name: "WhatsApp", tint: "from-emerald-100 to-teal-50" },
  { name: "VS Code", tint: "from-blue-100 to-indigo-50" },
  { name: "Linear", tint: "from-indigo-100 to-violet-50" },
  { name: "Discord", tint: "from-violet-100 to-purple-50" },
  { name: "Cursor", tint: "from-slate-100 to-zinc-50" },
];

function AppPill({
  app,
  reverse,
}: {
  app: (typeof apps)[0];
  reverse?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)]/90 px-4 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur-sm"
      style={{ transform: `rotate(${reverse ? 1 : -1}deg)` }}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-[var(--foreground)] ${app.tint}`}
      >
        {app.name[0]}
      </div>
      <span className="text-sm font-semibold text-[var(--foreground-muted)]">
        {app.name}
      </span>
    </div>
  );
}

export function UniversalApps() {
  const rowA = [...apps, ...apps];
  const rowB = [...apps.slice().reverse(), ...apps.slice().reverse()];

  return (
    <section className="relative overflow-hidden border-t border-[var(--border)] py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 grain opacity-60" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,var(--brand-soft)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            Universal
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
            Works in every app you use
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[var(--foreground-muted)]">
            Lazur lives in your menu bar and types wherever your cursor is. No
            plugins, no browser extensions, no setup.
          </p>
        </div>

        <div className="relative space-y-4">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="flex w-max gap-4 pr-4"
            >
              {rowA.map((app, i) => (
                <AppPill key={`a-${app.name}-${i}`} app={app} />
              ))}
            </motion.div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              className="flex w-max gap-4 pr-4"
            >
              {rowB.map((app, i) => (
                <AppPill key={`b-${app.name}-${i}`} app={app} reverse={i % 2 === 1} />
              ))}
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent md:w-24" />
        </div>
      </div>
    </section>
  );
}
