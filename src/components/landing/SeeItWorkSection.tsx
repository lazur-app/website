"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

type UseCaseId = "chatgpt" | "slack" | "email" | "cursor";

type UseCase = {
  id: UseCaseId;
  label: string;
  icon: string | null;
  spoken: string;
  caption: string;
  output: string;
  app: string;
};

const CASES: UseCase[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    icon: null,
    spoken:
      "help me plan customer interviews for the new onboarding flow — goals, questions, and a way to synthesize the calls",
    caption:
      "Talk through the rough idea. Lazur adds the goal, context, and structure that get better answers.",
    output:
      "Act as a senior UX researcher. Create a customer interview plan for our redesigned onboarding flow. Include: 3 learning goals, a 30-minute discussion guide, and a lightweight synthesis framework.",
    app: "New chat",
  },
  {
    id: "slack",
    label: "Slack",
    icon: "/slack-new-50.png",
    spoken:
      "update the team — beta is with about forty users, feedback is good, a few people are stuck on onboarding",
    caption:
      "Rambling standup notes become a message you can actually send.",
    output:
      "Quick launch update:\n• Beta is with ~40 users\n• Feedback has been positive overall\n• A few people are stuck on onboarding — I'll review today",
    app: "#launch-team",
  },
  {
    id: "email",
    label: "Email",
    icon: "/gmail-50.png",
    spoken:
      "tell maya I loved the proposal, one note on the timeline, and let's lock Friday",
    caption:
      "Speak the intent. Lazur writes it in your tone, ready to send.",
    output:
      "Hi Maya — loved the proposal. One note on the timeline: can we still lock Friday? I'll review the rest today.",
    app: "Gmail",
  },
  {
    id: "cursor",
    label: "Cursor",
    icon: "/cursor-ai-48.png",
    spoken:
      "can you uh refactor the auth handler to use zustand instead of react context and add proper error handling for failed logins",
    caption:
      "Speak the change you want. Lazur writes the scoped instruction your agent can execute.",
    output:
      "Refactor the auth handler to use Zustand instead of React Context. Add error handling for failed login attempts with user-facing messages.",
    app: "Cursor",
  },
];

function YouSayCard({ spoken }: { spoken: string }) {
  return (
    <div className="rounded-[1.35rem] bg-[#1c1917] px-5 py-4 shadow-[0_18px_44px_rgba(28,25,23,0.2)]">
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
            <span className="text-[#1a73e8]">Maya Chen</span>
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
            Polished by Lazur
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
    <LandingBand id="see-it-work" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <div className="mb-10 text-center md:mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            See it work
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            The finished thing.
          </h2>
        </div>

        <div
          className="mb-6 flex flex-wrap justify-center gap-2"
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
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
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
            className="aura-stage px-5 py-8 md:px-10 md:py-12"
          >
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-12">
              <div>
                <YouSayCard spoken={useCase.spoken} />
                <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-[var(--foreground)]/75">
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
