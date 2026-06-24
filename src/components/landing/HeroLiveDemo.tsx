"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AppDemoFrame } from "./demo/AppDemoShells";

const SCENARIOS = [
  {
    id: "code",
    label: "Code",
    icon: "/cursor-ai-48.png",
    fileName: "handler.ts",
    spoken:
      "um so we want to do few things first is check if all the endpoints are working or not and second thing is test the.. um conduct a smoke test and third thing is push the changes into new repo.",
    output:
      "We want to accomplish a few tasks:\n- Check if the API endpoints are functioning.\n- Conduct a smoke test.\n- Push the changes into the new repository",
  },
  {
    id: "email",
    label: "Email",
    icon: "/gmail-50.png",
    emailTo: "paresh@company.com",
    emailSubject: "Latest staging build",
    spoken:
      "hey paresh um when you get a chance can you send me the latest build from staging and also uh let me know if authentication is working properly on your side and if you saw any issues with the dashboard thanks",
    output:
      "Hi Paresh,\n\nWhen you have a moment, could you send over the latest staging build? I'd also appreciate a quick note on whether authentication is working properly on your end, and if you've noticed any issues with the dashboard.\n\nThanks!",
  },
  {
    id: "docs",
    label: "Docs",
    icon: "/notion.png",
    docTitle: "Improving First-Time User Activation",
    spoken:
      "okay so after talking to a few users i think the biggest issue isn't onboarding itself it's that people don't understand when lazur is actually listening so they try it once get confused and leave maybe we should add some kind of visual indicator and a quick tutorial during the first launch and demonsrate the dictation feature like hold speak release",
    output:
      "After reviewing recent user feedback, the primary issue appears to be clarity rather than onboarding complexity.\n\nMany users are unsure when Lazur is actively listening, which creates uncertainty during their first interaction. As a result, some users abandon the product before experiencing its value.\n\nRecommendations\n\nAdd a clear visual indicator while dictation is active.\nIntroduce a short first-launch walkthrough.\nDemonstrate the hold → speak → release workflow before the user's first dictation.\n\nThese changes should reduce confusion and improve activation rates for new users.",
  },
  {
    id: "slack",
    label: "Slack",
    icon: "/slack-new-50.png",
    channel: "#product",
    spoken:
      "hey everyone so quick update uh from todays sync so we finished the onboarding flow the analytics dashboard is mostly done and we're still waiting on the final designs for billing so assuming nothing changes we should be on track for friday",
    output:
      "Quick update from today's sync:\n\n• Onboarding flow — completed\n• Analytics dashboard — nearly finished\n• Billing designs — waiting on final assets\n\nOn track for Friday, assuming nothing changes.",
  },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]["id"];

export function HeroLiveDemo() {
  const [activeId, setActiveId] = useState<ScenarioId>("code");

  const scenario =
    SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <div className="hero-live-demo w-full text-left">
      <div className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-card)] ring-1 ring-[rgba(28,25,23,0.04)]">
        <div className="border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-4 sm:px-5">
          <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            Same thought · lands in the app you&apos;re in
          </p>
          <div
            className="relative flex gap-1 rounded-full bg-[var(--background-deep)]/80 p-1"
            role="tablist"
            aria-label="Demo scenarios"
          >
            {SCENARIOS.map((s) => {
              const on = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveId(s.id)}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[11px] font-semibold transition-colors duration-300 sm:px-3 sm:text-[12px] ${
                    on
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-faint)] hover:text-[var(--foreground-muted)]"
                  }`}
                >
                  {on ? (
                    <motion.div
                      layoutId="hero-demo-tab-indicator"
                      className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-[var(--border)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 34,
                        mass: 0.85,
                      }}
                      aria-hidden
                    />
                  ) : null}
                  <Image
                    src={s.icon}
                    alt=""
                    width={14}
                    height={14}
                    className={`relative z-10 h-3.5 w-3.5 object-contain transition-all duration-300 ${
                      on ? "opacity-80 grayscale-0" : "opacity-40 grayscale"
                    }`}
                    aria-hidden
                  />
                  <span className="relative z-10 hidden min-[380px]:inline">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[var(--background-deep)]/30 p-3 sm:p-4">
          <div className="h-[340px] w-full">
            <AppDemoFrame
              scenarioId={activeId}
              scenario={scenario}
            />
          </div>

          <p className="mt-3 text-center text-[11px] text-[var(--foreground-faint)]">
            Raw speech in the overlay · polished text in the app
          </p>
        </div>
      </div>
    </div>
  );
}
