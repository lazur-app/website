"use client";

import type { ReactNode } from "react";

export type DemoScenario = {
  id: string;
  spoken: string;
  output: string;
  mono?: boolean;
  emailTo?: string;
  emailSubject?: string;
  channel?: string;
  fileName?: string;
  docTitle?: string;
};

type ShellProps = {
  scenario: DemoScenario;
};

export const DEMO_SHELL_HEIGHT = "h-[340px]";

/** Shared typography — overlay + polished text stay in sync across tabs */
const DEMO_BODY = "text-[12px] leading-[1.55]";
const DEMO_LABEL =
  "text-[9px] font-semibold uppercase tracking-[0.14em]";

function MacWindowDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
    </div>
  );
}

function YouSaidBorderTrace() {
  return (
    <div className="you-said-border-trace rounded-lg" aria-hidden>
      <div className="you-said-border-trace__ring overflow-hidden rounded-lg">
        <div className="you-said-border-trace__spin you-said-border-trace__spin--trail" />
        <div className="you-said-border-trace__spin you-said-border-trace__spin--dot" />
      </div>
    </div>
  );
}

function YouSaidPanel({
  spoken,
  theme = "dark",
  soft = false,
}: {
  spoken: string;
  theme?: "dark" | "light";
  soft?: boolean;
}) {
  const isLight = theme === "light";

  return (
    <div className="group/you-said relative transition-opacity duration-300 hover:opacity-10">
      <YouSaidBorderTrace />
      <div
        className={`relative overflow-hidden rounded-lg border px-4 py-3 ${
          isLight
            ? soft
              ? "border-[#dadce0]/80 bg-white/85 shadow-md backdrop-blur-sm"
              : "border-[#dadce0] bg-white/95 shadow-xl backdrop-blur-md"
            : "border-white/10 bg-[#1c1917]/95 shadow-2xl backdrop-blur-md"
        }`}
      >
        <p
          className={`mb-1.5 ${DEMO_LABEL} ${
            isLight ? "text-[#5f6368]" : "text-white/40"
          }`}
        >
          You said
        </p>
        <p
          className={`${DEMO_BODY} ${
            isLight ? "italic text-[#3c4043]" : "italic text-white/60"
          }`}
        >
          {spoken}
        </p>
      </div>
    </div>
  );
}

/** Centered in open space — keeps polished text visible around the edges */
const OVERLAY_BLANK_CENTER =
  "left-1/2 top-[46%] w-[min(92%,320px)] -translate-x-1/2 -translate-y-1/2 sm:w-[300px]";

function YouSaidOverlay({
  spoken,
  className = "",
  theme = "dark",
  soft = false,
}: {
  spoken: string;
  className?: string;
  theme?: "dark" | "light";
  soft?: boolean;
}) {
  return (
    <div className={`absolute z-20 overflow-visible ${className}`}>
      <YouSaidPanel spoken={spoken} theme={theme} soft={soft} />
    </div>
  );
}

function ShellChrome({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative ${DEMO_SHELL_HEIGHT} w-full overflow-hidden rounded-xl shadow-inner ${className}`}
    >
      {children}
    </div>
  );
}

function AppField({
  output,
  className = "",
}: {
  output: string;
  className?: string;
}) {
  return (
    <p className={`whitespace-pre-line ${DEMO_BODY} ${className}`}>
      {output}
    </p>
  );
}

function DocsAppField({
  output,
  className = "",
}: {
  output: string;
  className?: string;
}) {
  const blocks = output.split("\n\n");

  return (
    <div className={`space-y-3 ${DEMO_BODY} ${className}`}>
      {blocks.map((block, index) => {
        if (block === "Recommendations") {
          return (
            <p key={index} className="font-semibold text-[#37352f]">
              Recommendations
            </p>
          );
        }

        if (blocks[index - 1] === "Recommendations" && block.includes("\n")) {
          const items = block.split("\n").filter(Boolean);
          return (
            <ol
              key={index}
              className="list-decimal space-y-1.5 pl-5 text-[#37352f]"
            >
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="text-[#37352f]">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function SlackDemoShell({ scenario }: ShellProps) {
  const channel = scenario.channel ?? "#product";

  return (
    <ShellChrome className="border border-[#522653]/50 bg-[#1a1d21] text-left">
      <div className="flex h-full">
        <div className="flex w-11 shrink-0 flex-col items-center gap-3 border-r border-[#522653]/40 bg-[#3f0e40] py-3">
          <div className="h-7 w-7 rounded-lg bg-[#522653]" />
          <div className="mt-1 h-5 w-5 rounded bg-white/10" />
          <div className="h-5 w-5 rounded bg-white/10" />
          <div className="h-5 w-5 rounded bg-white/10" />
        </div>

        <div className="hidden w-36 shrink-0 border-r border-[#522653]/30 bg-[#3f0e40]/95 p-3 sm:block">
          <p className="text-[10px] font-bold text-white/90">Lazur</p>
          <p className="mt-3 rounded bg-[#1164a3]/40 px-2 py-1 text-[11px] font-medium text-white">
            {channel}
          </p>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <span className="text-[13px] font-bold text-white">{channel}</span>
            <span className="text-[10px] text-white/40">|</span>
            <span className="truncate text-[10px] text-white/50">team channel</span>
          </div>

          <div className="relative flex-1 bg-[#1a1d21] p-3">
            <div className="flex gap-2 opacity-40">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-[#e8912d]" />
              <div>
                <p className="text-[11px] font-bold text-white">teammate</p>
                <p className="mt-0.5 text-[11px] text-white/60">Sounds good 👍</p>
              </div>
            </div>

            <YouSaidOverlay
              spoken={scenario.spoken}
              theme="light"
              soft
              className="left-[58%] top-[54%] w-[min(92%,300px)] -translate-x-1/2 -translate-y-1/2 sm:w-[280px]"
            />
          </div>

          <div className="border-t border-white/10 p-2.5">
            <div className="min-h-[108px] rounded-lg border border-[#868686]/40 bg-[#222529] px-3 py-2.5">
              <AppField output={scenario.output} className="text-[#d1d2d3]" />
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <div className="flex gap-2 opacity-50">
                <span className="h-3.5 w-3.5 rounded bg-white/20" />
                <span className="h-3.5 w-3.5 rounded bg-white/20" />
                <span className="h-3.5 w-3.5 rounded bg-white/20" />
              </div>
              <span className="rounded bg-[#007a5a] px-2 py-0.5 text-[10px] font-medium text-white">
                Send
              </span>
            </div>
          </div>
        </div>
      </div>
    </ShellChrome>
  );
}

export function GmailDemoShell({ scenario }: ShellProps) {
  return (
    <ShellChrome className="border border-[#dadce0] bg-[#f6f8fc] text-left">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[#dadce0] bg-white px-3">
        <MacWindowDots />
        <span className="ml-2 text-[10px] text-[#5f6368]">Gmail — Compose</span>
      </div>

      <div className="relative flex h-[calc(100%-2rem)]">
        <div className="relative hidden min-w-0 flex-1 sm:block">
          <YouSaidOverlay
            spoken={scenario.spoken}
            theme="light"
            soft
            className={OVERLAY_BLANK_CENTER}
          />
        </div>

        <div className="relative flex min-w-0 flex-1 items-end justify-end p-3 sm:max-w-[58%] sm:p-4">
          <YouSaidOverlay
            spoken={scenario.spoken}
            theme="light"
            soft
            className={`${OVERLAY_BLANK_CENTER} sm:hidden`}
          />

          <div className="flex h-full max-h-[280px] w-full flex-col overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-lg">
            <div className="flex shrink-0 items-center justify-between border-b border-[#edeef0] bg-[#f2f6fc] px-3 py-2">
              <span className={`${DEMO_BODY} font-medium text-[#3c4043]`}>
                New Message
              </span>
              <div className="flex gap-2 text-[#5f6368]">
                <span className="text-[11px]">—</span>
                <span className="text-[11px]">□</span>
                <span className="text-[11px]">×</span>
              </div>
            </div>

            <div className="shrink-0 border-b border-[#edeef0] px-3 py-2">
              <div className={`flex items-center gap-2 ${DEMO_BODY}`}>
                <span className="text-[#5f6368]">To</span>
                <span className="text-[#202124]">
                  {scenario.emailTo ?? "paresh@company.com"}
                </span>
              </div>
            </div>

            <div className="shrink-0 border-b border-[#edeef0] px-3 py-2">
              <div className={`flex items-center gap-2 ${DEMO_BODY}`}>
                <span className="text-[#5f6368]">Subject</span>
                <span className="text-[#202124]">
                  {scenario.emailSubject ?? "Latest staging build"}
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
              <AppField output={scenario.output} className="text-[#202124]" />
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-[#edeef0] px-3 py-2">
              <span className="rounded-full bg-[#0b57d0] px-4 py-1.5 text-[11px] font-medium text-white">
                Send
              </span>
              <div className="flex gap-1.5 opacity-40">
                <span className="h-4 w-4 rounded bg-[#dadce0]" />
                <span className="h-4 w-4 rounded bg-[#dadce0]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShellChrome>
  );
}

const CODE_LINE_COUNT = 6;

export function CodeDemoShell({ scenario }: ShellProps) {
  const fileName = scenario.fileName ?? "handler.ts";

  return (
    <ShellChrome className="border border-[#2b2b2b] bg-[#1e1e1e] text-left">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[#2b2b2b] bg-[#252526] px-3">
        <MacWindowDots />
        <span className="text-[10px] text-[#858585]">Cursor — lazur-app</span>
      </div>

      <div className="relative flex h-[calc(100%-2rem)]">
        <div className="hidden w-10 shrink-0 border-r border-[#2b2b2b] bg-[#252526] sm:block" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 border-b border-[#2b2b2b] bg-[#252526]">
            <span className="border-r border-[#2b2b2b] bg-[#1e1e1e] px-3 py-1.5 text-[11px] text-[#cccccc]">
              {fileName}
            </span>
          </div>
          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <div className="w-8 shrink-0 border-r border-[#2b2b2b] bg-[#1e1e1e] py-3 text-right text-[10px] text-[#858585]">
              {Array.from({ length: CODE_LINE_COUNT }, (_, i) => (
                <div key={i} className="px-1">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="relative min-w-0 flex-1 overflow-y-auto p-3">
              <AppField
                output={scenario.output}
                className="text-[#cccccc]"
              />

              <YouSaidOverlay
                spoken={scenario.spoken}
                theme="light"
                soft
                className="left-[68%] top-[46%] w-[min(88%,300px)] -translate-x-1/2 -translate-y-1/2 sm:w-[280px]"
              />
            </div>
          </div>
        </div>
      </div>
    </ShellChrome>
  );
}

export function NotionDemoShell({ scenario }: ShellProps) {
  const title = scenario.docTitle ?? "Draft";

  return (
    <ShellChrome className="border border-[#e9e9e7] bg-white text-left">
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-[#e9e9e7] bg-[#f7f6f3] px-3">
        <span className="text-[10px] text-[#9b9a97]">Notion</span>
        <span className="text-[10px] text-[#9b9a97]">/</span>
        <span className="text-[10px] font-medium text-[#37352f]">{title}</span>
      </div>

      <div className="relative h-[calc(100%-2rem)] overflow-hidden px-6 py-5 sm:px-8 sm:py-6">
        <h3 className={`${DEMO_BODY} font-display text-[14px] font-semibold text-[#37352f]`}>
          {title}
        </h3>

        <div className="mt-3 max-w-[58%]">
          <DocsAppField output={scenario.output} />
        </div>

        <YouSaidOverlay
          spoken={scenario.spoken}
          theme="light"
          soft
          className="bottom-14 right-14 w-[min(92%,280px)] sm:bottom-16 sm:right-20 sm:w-[260px]"
        />
      </div>
    </ShellChrome>
  );
}

export function AppDemoFrame({
  scenarioId,
  scenario,
}: ShellProps & { scenarioId: string }) {
  switch (scenarioId) {
    case "slack":
      return <SlackDemoShell scenario={scenario} />;
    case "email":
      return <GmailDemoShell scenario={scenario} />;
    case "code":
      return <CodeDemoShell scenario={scenario} />;
    case "docs":
      return <NotionDemoShell scenario={scenario} />;
    default:
      return null;
  }
}
