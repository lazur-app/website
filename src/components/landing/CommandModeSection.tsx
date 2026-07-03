"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const INCOMING_EMAIL =
  "Hey — quick update on the launch. We pushed the beta to about forty users last week and feedback has been mostly positive, but a few people are confused about onboarding. Can you review when you get a chance?";

const EXAMPLES = {
  with_context: {
    label: "With context",
    command: "Reply to this — keep it brief and professional",
    output:
      "Thanks for the update — I'll review the onboarding feedback and mockups today. Let's sync tomorrow on the Friday timeline.",
    showIncoming: true,
  },
  without_context: {
    label: "Without context",
    command: "Draft a two-line follow-up asking to confirm the Friday deadline",
    output:
      "Hi Alex — just following up on the launch timeline. Can you confirm we're still targeting Friday for the lock-in?",
    showIncoming: false,
  },
} as const;

type ExampleMode = keyof typeof EXAMPLES;

export function CommandModeSection() {
  const [mode, setMode] = useState<ExampleMode>("with_context");
  const example = EXAMPLES[mode];

  return (
    <LandingBand id="command-mode" variant="tint" className="py-16 md:py-24">
      <LandingBandInner>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <div
              className="mb-4 inline-flex gap-1 rounded-full border border-[var(--border)] bg-white/80 p-1"
              role="tablist"
              aria-label="Command Mode examples"
            >
              {(Object.keys(EXAMPLES) as ExampleMode[]).map((key) => {
                const active = mode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMode(key)}
                    className={`rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {EXAMPLES[key].label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white/90 p-5 text-left shadow-sm md:p-6">
              {example.showIncoming ? (
                <p className="rounded-lg bg-[var(--brand-soft)]/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                  {INCOMING_EMAIL}
                </p>
              ) : (
                <p className="text-[13px] italic text-[var(--foreground-faint)]">
                  No selection — your command carries the intent.
                </p>
              )}

              <div className="mt-4 flex items-start gap-2.5 text-[13px] text-[var(--foreground-muted)]">
                <Mic
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand)]"
                  strokeWidth={2}
                />
                <span>&ldquo;{example.command}&rdquo;</span>
              </div>

              <p className="mt-4 border-t border-[var(--border)] pt-4 text-[14px] leading-relaxed text-[var(--foreground)]">
                {example.output}
              </p>
            </div>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
              Beyond dictation
            </p>
            <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
              Speak to write.
              <br />
              Speak to edit.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)] lg:mx-0 mx-auto">
              Select any text, say what you need, and Lazur pastes the result —
              reply to a thread, refactor a paragraph, or tighten a message.
            </p>
          </div>
        </div>
      </LandingBandInner>
    </LandingBand>
  );
}
