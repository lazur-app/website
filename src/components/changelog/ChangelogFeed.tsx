"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { RELEASES, type Release } from "@/lib/changelog";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { AppleIcon } from "@/components/icons/AppleIcon";

const INK = "#2563eb";

const SECTION_DOT: Record<string, string> = {
  New: "#2563eb",
  Improved: "#16a34a",
  Fixed: "#ef5350",
  "Still here": "#a8a29e",
  Gone: "#a8a29e",
  Removed: "#a8a29e",
};

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Entry({ release, latest, onSeen }: { release: Release; latest: boolean; onSeen: (v: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px -40% 0px" });
  const current = useInView(ref, { margin: "-45% 0px -50% 0px" });
  useEffect(() => {
    if (current) onSeen(release.version);
  }, [current, onSeen, release.version]);

  return (
    <motion.article
      ref={ref}
      id={`v${release.version}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-28 border-b border-[var(--border)] pb-16 pt-2 last:border-b-0"
    >
      <p className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--foreground-faint)]">
        <span className="rounded-full bg-[var(--foreground)] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-white">v{release.version}</span>
        <span>{formatDate(release.date)}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><AppleIcon className="h-3 w-3" /> macOS</span>
        {latest ? <span className="rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-white" style={{ background: INK }}>Latest</span> : null}
      </p>

      <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">
        <span className="relative inline">
          {release.title}
          <HandUnderline show={seen} color={INK} delay={0.25} duration={0.8} offset={1} />
        </span>
      </h2>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[var(--foreground-muted)]">{release.summary}</p>

      {release.note ? (
        <p className="mt-5 max-w-2xl rounded-2xl border border-[#2563eb]/20 bg-[#2563eb]/[0.05] px-4 py-3 text-[14.5px] leading-relaxed text-[var(--foreground)]">
          {release.note}{" "}
          <Link href="/download" className="font-semibold underline underline-offset-4" style={{ color: INK }}>Download the latest</Link>
        </p>
      ) : null}

      <div className="mt-8 space-y-8">
        {release.sections.map((section) => (
          <section key={section.label}>
            <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              <span className="h-2 w-2 rounded-full" style={{ background: SECTION_DOT[section.label] ?? "#a8a29e" }} />
              {section.label}
            </h3>
            <ul className="mt-4 space-y-4">
              {section.items.map((item) => (
                <li key={item.name} className="grid gap-1 md:grid-cols-[13rem_1fr] md:gap-6">
                  <span className="text-[15.5px] font-semibold text-[var(--foreground)]">{item.name}</span>
                  <span className="text-[15.5px] leading-relaxed text-[var(--foreground-muted)]">{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {latest ? (
        <Link
          href="/download"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <AppleIcon className="h-4 w-4" /> Get v{release.version}
        </Link>
      ) : null}
    </motion.article>
  );
}

export function ChangelogFeed() {
  const [active, setActive] = useState(RELEASES[0].version);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mx-auto max-w-3xl text-center lg:mx-0 lg:ml-[14rem] lg:max-w-none lg:text-left">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: INK }}>Changelog</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.04em] text-[var(--foreground)]">
          What&apos;s new in Lazur
        </h1>
        <p className="mt-4 text-[18px] text-[var(--foreground-muted)]">
          Every release, in plain words. Lazur updates itself, so you&apos;re always on the latest.
        </p>
      </header>

      <div className="mt-16 grid gap-10 lg:grid-cols-[10rem_1fr] lg:gap-16">
        {/* Version index */}
        <nav aria-label="Versions" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-[var(--border)]">
            {RELEASES.map((r) => {
              const on = r.version === active;
              return (
                <li key={r.version} className="relative">
                  {on ? (
                    <motion.span
                      layoutId="changelog-active"
                      className="absolute -left-[1.5px] top-1 h-[calc(100%-0.5rem)] w-[2px] rounded-full"
                      style={{ background: INK }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                  ) : null}
                  <a
                    href={`#v${r.version}`}
                    className={`block py-1.5 pl-4 text-[14px] transition-colors ${on ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground-faint)] hover:text-[var(--foreground-muted)]"}`}
                  >
                    v{r.version}
                    <span className="block text-[12px] font-normal text-[var(--foreground-faint)]">{formatDate(r.date).replace(/, \d{4}$/, "")}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="space-y-16">
          {RELEASES.map((r, i) => (
            <Entry key={r.version} release={r} latest={i === 0} onSeen={setActive} />
          ))}
        </div>
      </div>
    </div>
  );
}
