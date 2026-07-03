"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const TOOLS = [
  { name: "Cursor", icon: "/cursor-ai-48.png" },
  { name: "VS Code", icon: "/vs-code-50.png" },
  { name: "ChatGPT", icon: null },
  { name: "Claude", icon: null },
] as const;

const EXAMPLES = {
  prompt: {
    label: "Agent prompt",
    app: "Cursor",
    icon: "/cursor-ai-48.png",
    spoken:
      "can you uh refactor the auth handler to use zustand instead of react context and add proper error handling for failed logins",
    output:
      "Refactor the auth handler to use Zustand instead of React Context. Add error handling for failed login attempts with user-facing messages.",
  },
  code: {
    label: "Code & commits",
    app: "VS Code",
    icon: "/vs-code-50.png",
    spoken:
      "um so we need to check if all endpoints are working run a smoke test and then push changes to the new repo",
    output:
      "• Verify all API endpoints are responding\n• Run a smoke test on staging\n• Push changes to the new repository",
  },
} as const;

type ExampleId = keyof typeof EXAMPLES;

export function CodingPromptingSection() {
  const [active, setActive] = useState<ExampleId>("prompt");
  const example = EXAMPLES[active];

  return (
    <LandingBand id="coding" variant="dark" className="py-16 md:py-24">
      <LandingBandInner>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
            For builders
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--background)] md:text-[2.75rem]">
            Prompts you actually
            <br />
            meant to write.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            Rambling speech becomes precise prompts and commit messages — pasted
            at your cursor in the IDE you already open.
          </p>

          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
              Designed for
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <li
                  key={tool.name}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
                >
                  {tool.icon ? (
                    <Image
                      src={tool.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                  ) : null}
                  <span className="text-[12px] font-medium text-white/70">
                    {tool.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06, duration: 0.45 }}
        >
          <div
            className="mb-4 inline-flex gap-1 rounded-full border border-white/15 bg-white/5 p-1"
            role="tablist"
            aria-label="Coding examples"
          >
            {(Object.keys(EXAMPLES) as ExampleId[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active === key}
                onClick={() => setActive(key)}
                className={`rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors ${
                  active === key
                    ? "bg-[var(--background)] text-[var(--foreground)]"
                    : "text-white/55 hover:text-white/85"
                }`}
              >
                {EXAMPLES[key].label}
              </button>
            ))}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-2xl border border-white/12 bg-[#141210] text-left"
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
              <Image
                src={example.icon}
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] object-contain"
              />
              <span className="text-[12px] font-medium text-white/65">
                {example.app}
              </span>
              <span className="ml-auto font-mono text-[11px] text-white/30">
                ⌃ Space
              </span>
            </div>

            <div className="space-y-4 p-4 md:p-5">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  You speak
                </p>
                <p className="flex items-start gap-2 text-[13px] leading-relaxed text-white/50">
                  <Mic
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand)]"
                    strokeWidth={2}
                  />
                  <span>&ldquo;{example.spoken}&rdquo;</span>
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  Lazur pastes
                </p>
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-white/88">
                  {example.output}
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </LandingBandInner>
    </LandingBand>
  );
}
