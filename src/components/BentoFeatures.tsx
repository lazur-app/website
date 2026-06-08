"use client";

import { motion } from "framer-motion";

const rewriteExamples = [
  {
    app: "Cursor",
    editor: true,
    filename: "api/handler.ts",
    before: "todo fix this later when we have time",
    after: "// TODO: Refactor error handling when bandwidth allows",
  },
  {
    app: "Slack",
    editor: false,
    before: "hey team quick update on the thing",
    after: "Quick update for the team on project status.",
  },
  {
    app: "Gmail",
    editor: false,
    before: "just following up on my last email",
    after:
      "Following up on my previous email — wanted to check if you had a chance to review.",
  },
];

function EditorRow({
  ex,
  index,
}: {
  ex: (typeof rewriteExamples)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="demo-surface overflow-hidden"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-strong)] bg-[#f8f6f2] px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[11px] text-[var(--foreground-muted)]">
          {ex.filename}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-[var(--foreground)]">
          {ex.app}
        </span>
      </div>
      <div className="grid gap-4 bg-white p-5 md:grid-cols-2 md:gap-6">
        <p className="font-mono text-sm leading-relaxed text-[var(--foreground-faint)] line-through decoration-[var(--border-strong)]">
          {ex.before}
        </p>
        <p className="font-mono text-sm font-medium leading-relaxed text-[var(--foreground)]">
          {ex.after}
        </p>
      </div>
    </motion.div>
  );
}

function StandardRow({
  ex,
  index,
}: {
  ex: (typeof rewriteExamples)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="grid gap-3 border-b border-[var(--border)] pb-5 md:grid-cols-[5.5rem_1fr_1fr] md:items-start md:gap-6"
    >
      <span className="text-[13px] font-semibold text-[var(--foreground)]">
        {ex.app}
      </span>
      <p className="text-[14px] leading-relaxed text-[var(--foreground-faint)] line-through decoration-[var(--border-strong)]">
        {ex.before}
      </p>
      <p className="text-[14px] font-medium leading-relaxed text-[var(--foreground)]">
        {ex.after}
      </p>
    </motion.div>
  );
}

export function BentoFeatures() {
  return (
    <section id="smart-rewrite" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grain opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
            Smart Rewrite
          </p>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            Context-aware rewrites.
            <br />
            Not copy-paste.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Lazur reads what app you&apos;re in and shapes your words to match —
            terse in code, casual in Slack, formal in email.
          </p>
        </div>

        <div className="mt-12 space-y-5">
          {rewriteExamples.map((ex, i) =>
            ex.editor ? (
              <EditorRow key={ex.app} ex={ex} index={i} />
            ) : (
              <StandardRow key={ex.app} ex={ex} index={i} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
