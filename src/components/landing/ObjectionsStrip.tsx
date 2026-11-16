"use client";

import { useRef } from "react";
import { AppWindow, Lock, Timer } from "lucide-react";
import { useTrackInView } from "@/hooks/useTrackInView";

/**
 * The three questions people have before downloading, answered with what the site already says:
 * privacy (FAQ + "You're in charge"), every app (FAQ), setup time (final CTA's setup film).
 */
const OBJECTIONS = [
  {
    icon: Lock,
    title: "Private by default",
    text: "Listens only while you hold the key. Recordings and screenshots aren't kept or used to train AI.",
  },
  {
    icon: AppWindow,
    title: "Works in any app",
    text: "Mail, Slack, Chrome, Figma, Cursor, VS Code, Notion and the rest.",
  },
  {
    icon: Timer,
    title: "Set up in about a minute",
    text: "Install, sign in, and Lazur shows you around.",
  },
] as const;

export function ObjectionsStrip({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  useTrackInView(ref, "section_viewed", { section: "hero_objections" });

  return (
    <ul
      ref={ref}
      className={`grid w-full max-w-5xl gap-x-8 gap-y-4 text-left sm:grid-cols-3 ${className}`.trim()}
    >
      {OBJECTIONS.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-white/70">
            <Icon className="h-4 w-4 text-[var(--foreground)]" strokeWidth={1.8} aria-hidden />
          </span>
          <span>
            <span className="block text-[14px] font-semibold text-[var(--foreground)]">{title}</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-[var(--foreground-muted)]">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
