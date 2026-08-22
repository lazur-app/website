"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

type UseCaseId = "chatgpt" | "slack" | "email" | "cursor";
type Mode = "dictation" | "command";

type UseCase = {
  id: UseCaseId;
  label: string;
  icon: string | null;
  mode: Mode;
  spoken: string;
  caption: string;
  output: string;
  app: string;
  context?: string;
};

const CASES: UseCase[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    icon: null,
    mode: "dictation",
    spoken:
      "okay so I need a competitive teardown of Wispr Flow, Aqua Voice, and us, a table of what's actually different, not marketing fluff, plus a rec for a founder who lives in Slack and Cursor",
    caption:
      "You talk through the messy brief. Dictation Mode writes the prompt you'd paste.",
    output:
      "Compare Wispr Flow, Aqua Voice, and Lazur for a founder who works all day in Slack and Cursor. Give me a table of what actually differs (speed, rewrite, Command Mode, privacy, pricing), skip marketing claims. End with one recommendation and why.",
    app: "New chat",
  },
  {
    id: "slack",
    label: "Slack",
    icon: "/slack-new-50.png",
    mode: "dictation",
    spoken:
      "standup update we shipped the invite flow last night two bugs in the share modal I'll pair with Priya after lunch otherwise on track for Thursday",
    caption:
      "Rambling standup notes become a message you can send without editing.",
    output:
      "Standup:\n• Shipped the invite flow last night\n• Two bugs in the share modal, pairing with Priya after lunch\n• Still on track for Thursday",
    app: "#eng-standup",
  },
  {
    id: "email",
    label: "Email",
    icon: "/gmail-50.png",
    mode: "command",
    context:
      "Hey, can you review the onboarding feedback by Friday? A few people are getting stuck.",
    spoken:
      "reply, yes I'll have notes by Thursday, keep it warm",
    caption:
      "You don't dictate the email. Command Mode writes the reply from what you meant.",
    output:
      "Hi Alex, yes, I'll have notes on the onboarding feedback by Thursday. Talk soon.",
    app: "Gmail",
  },
  {
    id: "cursor",
    label: "Cursor",
    icon: "/cursor-ai-48.png",
    mode: "command",
    context: "auth-handler.ts  ·  React Context",
    spoken:
      "refactor this to use zustand instead of context and add error handling for failed logins",
    caption:
      "Speak the change. Command Mode writes the instruction your agent can actually run.",
    output:
      "Refactor the auth handler to use Zustand instead of React Context. Add error handling for failed login attempts with user-facing messages.",
    app: "Cursor",
  },
];

function ModeBadge({ mode }: { mode: Mode }) {
  return (
    <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground)]/45">
      {mode === "command" ? "Command Mode" : "Dictation Mode"}
    </p>
  );
}

function YouSayCard({ spoken }: { spoken: string }) {
  return (
    <div className="rounded-[1.35rem] bg-[#1c1917] px-4 py-4 shadow-[0_18px_44px_rgba(28,25,23,0.2)] sm:px-5">
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="h-3 w-5 rounded-full bg-[rgba(250,204,21,0.9)]"
          aria-hidden
        />
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          You say
        </p>
      </div>
      <p className="font-mono text-[13px] leading-relaxed text-white/85">
        &ldquo;{spoken}&rdquo;
      </p>
    </div>
  );
}

function MacDots() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]/90" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]/90" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]/90" />
    </div>
  );
}

function OutputWindow({ useCase }: { useCase: UseCase }) {
  if (useCase.id === "slack") {
    return (
      <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_16px_40px_rgba(28,25,23,0.1)]">
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
          <span className="text-[12px] font-semibold text-[var(--foreground)]">
            {useCase.app}
          </span>
        </div>
        <div className="px-4 py-4">
          <div className="flex gap-2.5">
            <span className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-[#4a154b]" />
            <div>
              <p className="text-[12px] font-semibold text-[var(--foreground)]">
                Alex
              </p>
              <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-[var(--foreground)]">
                {useCase.output}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (useCase.id === "email") {
    return (
      <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_16px_40px_rgba(28,25,23,0.1)]">
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[#f7f8fa] px-4 py-2.5">
          <MacDots />
          <span className="ml-1 text-[11px] text-[var(--foreground-faint)]">
            {useCase.app}
          </span>
        </div>
        <div className="space-y-2 border-b border-[var(--border)] px-4 py-3 text-[13px]">
          <p>
            <span className="text-[var(--foreground-faint)]">To </span>
            <span className="text-[#1a73e8]">Alex Rivera</span>
          </p>
        </div>
        <p className="px-4 py-4 text-[13px] leading-relaxed text-[var(--foreground)]">
          {useCase.output}
        </p>
        <div className="flex items-center justify-between px-4 pb-4">
          <span className="rounded-full bg-[#1a73e8] px-4 py-1.5 text-[11px] font-medium text-white">
            Send
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
            Command Mode
          </span>
        </div>
      </div>
    );
  }

  if (useCase.id === "cursor") {
    return (
      <div className="overflow-hidden rounded-[1.25rem] bg-[#1e1e1e] shadow-[0_16px_40px_rgba(28,25,23,0.18)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <MacDots />
          <span className="ml-1 text-[11px] text-white/40">{useCase.app}</span>
        </div>
        <div className="grid sm:grid-cols-[1fr_1.1fr]">
          <div className="hidden border-r border-white/10 p-4 sm:block">
            <div className="space-y-2">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full bg-white/10"
                  style={{ width: `${40 + ((i * 17) % 45)}%` }}
                />
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
              Agent
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/90">
              {useCase.output}
            </p>
            <span className="mt-4 inline-flex rounded-full bg-[#3b82f6] px-3 py-1.5 text-[11px] font-medium text-white">
              Send to agent ↵
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_16px_40px_rgba(28,25,23,0.1)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <MacDots />
        <span className="ml-1 text-[11px] uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
          {useCase.app}
        </span>
      </div>
      <p className="px-4 py-5 text-[13px] leading-relaxed text-[var(--foreground)]">
        {useCase.output}
      </p>
      <div className="flex items-center justify-end gap-2 px-4 pb-4">
        <span className="text-[10px] text-[var(--foreground-faint)]">GPT-4</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--foreground)] text-[11px] text-white">
          ↑
        </span>
      </div>
    </div>
  );
}

export function SeeItWorkSection() {
  const [active, setActive] = useState<UseCaseId>("chatgpt");
  const useCase = CASES.find((c) => c.id === active) ?? CASES[0];

  return (
    <LandingBand id="see-it-work" variant="light" className="py-12 md:py-20">
      <LandingBandInner>
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            See it work
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            The finished thing.
          </h2>
        </div>

        <div
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Use cases"
        >
          {CASES.map((item) => {
            const selected = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  selected
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--border-strong)]"
                }`}
              >
                {item.icon ? (
                  <Image
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className={`h-4 w-4 object-contain ${selected ? "brightness-0 invert" : ""}`}
                  />
                ) : null}
                {item.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={useCase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28 }}
            className="aura-stage px-4 py-7 sm:px-6 md:px-10 md:py-12"
          >
            <ModeBadge mode={useCase.mode} />
            <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-12">
              <div>
                {useCase.context ? (
                  <div className="mb-3 rounded-[1.1rem] border border-[var(--border)] bg-white/70 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                      Looking at
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                      {useCase.context}
                    </p>
                  </div>
                ) : null}
                <YouSayCard spoken={useCase.spoken} />
                <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[var(--foreground)]/75">
                  {useCase.caption}
                </p>
              </div>
              <OutputWindow useCase={useCase} />
            </div>
          </motion.div>
        </AnimatePresence>
      </LandingBandInner>
    </LandingBand>
  );
}
