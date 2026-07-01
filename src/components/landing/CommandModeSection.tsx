"use client";

import { useState } from "react";
import { Mic, Sparkles, MousePointer2, TextSelect } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";

const STEPS = [
  {
    icon: MousePointer2,
    label: "Select or speak",
    detail: "Highlight text for context, or just say what you need.",
  },
  {
    icon: Mic,
    label: "Speak a command",
    detail: '"Reply to this" or "Draft a two-line follow-up."',
  },
  {
    icon: Sparkles,
    label: "Paste the result",
    detail: "Lazur writes at your cursor — no copy-paste gymnastics.",
  },
] as const;

const INCOMING_EMAIL =
  "Hey — quick update on the launch. We pushed the beta to about forty users last week and feedback has been mostly positive, but a few people are confused about onboarding. Can you review when you get a chance? We need to lock the timeline by Friday.";

const EXAMPLES = {
  with_context: {
    label: "With context",
    windowTitle: "Gmail · reply to Alex",
    showIncoming: true,
    command: "Reply to this — keep it brief and professional",
    output:
      "Thanks for the update — I'll review the onboarding feedback and mockups today. Let's sync tomorrow on the Friday timeline.",
  },
  without_context: {
    label: "Without context",
    windowTitle: "Gmail · new message",
    showIncoming: false,
    command: "Draft a two-line follow-up asking to confirm the Friday deadline",
    output:
      "Hi Alex — just following up on the launch timeline. Can you confirm we're still targeting Friday for the lock-in?",
  },
} as const;

type ExampleMode = keyof typeof EXAMPLES;

export function CommandModeSection() {
  const [mode, setMode] = useState<ExampleMode>("with_context");
  const example = EXAMPLES[mode];

  return (
    <section id="command-mode" className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Command Mode
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            Dictation writes.
            <br />
            Commands edit.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Reply to a thread, rewrite a paragraph, or draft from scratch — with
            or without selected text as context.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="space-y-5">
            {STEPS.map((step) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white">
                  <step.icon
                    className="h-[18px] w-[18px] text-[var(--brand)]"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--foreground)]">
                    {step.label}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="inline-flex w-fit gap-1 self-center rounded-full border border-[var(--border)] bg-white/70 p-1 lg:self-start"
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

            <SoftCard hover={false} className="overflow-hidden p-0">
              <div className="border-b border-[var(--border)] bg-[var(--background-deep)]/50 px-4 py-2.5">
                <p className="text-[11px] font-medium text-[var(--foreground-faint)]">
                  {example.windowTitle}
                </p>
              </div>
              <div className="space-y-4 p-5">
                {example.showIncoming ? (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--brand-ink)]">
                      <TextSelect className="h-3 w-3" strokeWidth={2} />
                      Selected · reply to this
                    </p>
                    <p className="rounded-lg border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--foreground)]">
                      {INCOMING_EMAIL}
                    </p>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--background-deep)]/60 px-3 py-2.5 text-[12px] text-[var(--foreground-faint)]">
                    No text selected — command carries the full intent.
                  </p>
                )}

                <div className="flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-3 py-2">
                  <Mic
                    className="h-3.5 w-3.5 text-[var(--brand)]"
                    strokeWidth={2}
                  />
                  <span className="text-[12px] font-medium text-[var(--brand-ink)]">
                    &ldquo;{example.command}&rdquo;
                  </span>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                    Lazur pastes
                  </p>
                  <p className="rounded-lg border border-[var(--brand)]/14 bg-white px-3 py-2.5 text-[13px] leading-relaxed text-[var(--foreground)]">
                    {example.output}
                  </p>
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </div>
    </section>
  );
}
