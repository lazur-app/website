"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { RELEASES, type Release } from "@/lib/changelog";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { track } from "@/lib/productAnalytics";

const INK = "#1c1917";
const UNDERLINE = "#e11d48";
const CARD_SHADOW = "shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]";

/** Section chips, in the puzzle pieces' colours. */
const SECTION_CHIP: Record<string, string> = {
  New: "#d6246e",
  Improved: "#14917a",
  Fixed: "#e0621c",
  "Still here": "#5b4bd6",
  Gone: "#6b6560",
  Removed: "#6b6560",
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
  useEffect(() => {
    if (seen) track("section_viewed", { location: "changelog", section: `v${release.version}`, latest });
  }, [seen, release.version, latest]);

  return (
    <motion.article
      ref={ref}
      id={`v${release.version}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`scroll-mt-32 rounded-[28px] border-[1.5px] border-[#1c1917] bg-white p-4 sm:p-6 md:p-8 ${CARD_SHADOW}`}
    >
      <p className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--foreground-muted)]">
        <span className="rounded-full bg-[#1c1917] px-3 py-1 text-[12px] font-bold text-white">v{release.version}</span>
        <span>{formatDate(release.date)}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><AppleIcon className="h-3 w-3" /> macOS</span>
        {latest ? <span className="rounded-full bg-[#14917a] px-3 py-1 text-[12px] font-bold text-white">Latest</span> : null}
      </p>

      <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)]">
        {release.title}
      </h2>
      <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed text-[var(--foreground-muted)]">{release.summary}</p>

      {release.note ? (
        <p className="mt-6 max-w-[680px] rounded-[12px] border-[1.5px] border-[#1c1917] bg-[var(--background)] px-4 py-3 text-[15px] leading-relaxed text-[var(--foreground)]">
          {release.note}{" "}
          <Link
            href="/download"
            className="font-bold underline decoration-[#1c1917]/25 underline-offset-4 hover:decoration-[#1c1917]"
            onClick={() => track("content_cta_clicked", { content_type: "changelog", slug: "changelog", location: "release_note", label: "Download the latest", version: release.version })}
          >
            Download the latest
          </Link>
        </p>
      ) : null}

      <div className="mt-8 space-y-8 border-t border-dashed border-black/15 pt-8">
        {release.sections.map((section) => (
          <section key={section.label}>
            <h3>
              <span
                className="inline-flex rounded-full px-3 py-1 text-[12px] font-bold text-white"
                style={{ background: SECTION_CHIP[section.label] ?? "#6b6560" }}
              >
                {section.label}
              </span>
            </h3>
            <ul className="mt-4 space-y-4">
              {section.items.map((item) => (
                <li key={item.name} className="grid gap-1 md:grid-cols-[12rem_1fr] md:gap-6">
                  <span className="text-[16px] font-bold tracking-[-0.01em] text-[var(--foreground)]">{item.name}</span>
                  <span className="text-[16px] leading-relaxed text-[var(--foreground-muted)]">{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {latest ? (
        <Link
          href="/download"
          onClick={() => track("content_cta_clicked", { content_type: "changelog", slug: "changelog", location: "latest_release", label: `Get v${release.version}`, version: release.version })}
          className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-6 text-[15px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9)]"
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
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">Changelog</p>
        <h1 className="mt-4 font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
          What&apos;s{" "}
          <span className="relative inline-block whitespace-nowrap">
            new
            <HandUnderline show color={UNDERLINE} delay={0.4} duration={0.9} offset={2} />
          </span>{" "}
          in Lazur
        </h1>
        <p className="mx-auto mt-6 max-w-[34rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
          Every release, in plain words. Lazur updates itself, so you&apos;re always on the latest.
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[10rem_1fr] lg:gap-16">
        {/* Version index */}
        <nav aria-label="Versions" className="hidden lg:block">
          <ol className="sticky top-32 space-y-1 border-l-[1.5px] border-black/15">
            {RELEASES.map((r) => {
              const on = r.version === active;
              return (
                <li key={r.version} className="relative">
                  {on ? (
                    <motion.span
                      layoutId="changelog-active"
                      className="absolute -left-[2px] top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full"
                      style={{ background: INK }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                  ) : null}
                  <a
                    href={`#v${r.version}`}
                    onClick={() => track("toc_link_clicked", { content_type: "changelog", slug: "changelog", heading: `v${r.version}` })}
                    className={`block py-2 pl-4 text-[14px] transition-colors ${on ? "font-bold text-[var(--foreground)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
                  >
                    v{r.version}
                    <span className="block text-[12px] font-normal text-[var(--foreground-muted)]">{formatDate(r.date).replace(/, \d{4}$/, "")}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="space-y-8">
          {RELEASES.map((r, i) => (
            <Entry key={r.version} release={r} latest={i === 0} onSeen={setActive} />
          ))}
        </div>
      </div>
    </div>
  );
}
