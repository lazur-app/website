"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Preview = {
  app: string;
  context?: string;
  before: string;
  after: string;
  mono?: boolean;
};

type BulletItem = {
  id: string;
  label: string;
  summary: string;
  preview: Preview;
};

const items: BulletItem[] = [
  {
    id: "rewrite",
    label: "Context-aware rewrites",
    summary: "Terse in code, casual in Slack, formal in email.",
    preview: {
      app: "Slack",
      context: "#product",
      before: "hey team quick update on the thing",
      after: "Quick update for the team on project status.",
    },
  },
  {
    id: "code",
    label: "Speaks developer",
    summary: "Comments and TODOs that match your codebase tone.",
    preview: {
      app: "Cursor",
      context: "api/handler.ts",
      before: "todo fix this later when we have time",
      after: "// TODO: Refactor error handling when bandwidth allows",
      mono: true,
    },
  },
  {
    id: "email",
    label: "Email-ready prose",
    summary: "Follow-ups and replies that sound like you wrote them.",
    preview: {
      app: "Gmail",
      before: "just following up on my last email",
      after:
        "Following up on my previous email — wanted to check if you had a chance to review.",
    },
  },
  {
    id: "speed",
    label: "Instant at cursor",
    summary: "Sub-200ms streaming — words appear as you speak.",
    preview: {
      app: "Any app",
      before: "…",
      after: "Polished text lands exactly where you're typing.",
    },
  },
];

function PreviewCard({ preview }: { preview: Preview }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="text-[12px] font-medium text-[var(--foreground-muted)]">
          {preview.app}
          {preview.context && (
            <span className="text-[var(--foreground-faint)]">
              {" "}
              · {preview.context}
            </span>
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4">
        {preview.before !== "…" && (
          <p
            className={`text-[14px] leading-relaxed text-[var(--foreground-faint)] line-through decoration-[var(--border-strong)] ${
              preview.mono ? "font-mono" : ""
            }`}
          >
            {preview.before}
          </p>
        )}
        <p
          className={`text-[15px] font-medium leading-relaxed text-[var(--foreground)] ${
            preview.mono ? "font-mono" : ""
          }`}
        >
          {preview.after}
        </p>
      </div>
    </div>
  );
}

export function BulletRevealList() {
  const [active, setActive] = useState(items[0].id);
  const activeItem = items.find((i) => i.id === active) ?? items[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:items-start">
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(item.id)}
                onFocus={() => setActive(item.id)}
                onClick={() => setActive(item.id)}
                className={`group flex w-full items-start gap-4 rounded-[20px] px-4 py-4 text-left transition-colors duration-300 ${
                  isActive ? "bg-white/70" : "hover:bg-white/45"
                }`}
              >
                <motion.span
                  animate={{
                    scale: isActive ? 1.35 : 1,
                    backgroundColor: isActive
                      ? "var(--foreground)"
                      : "var(--foreground-faint)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full"
                />
                <div>
                  <p
                    className={`text-[15px] font-medium transition-colors ${
                      isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--foreground-faint)]">
                    {item.summary}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="relative min-h-[260px] lg:min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{
              opacity: 0,
              scale: 0.82,
              y: 16,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.88,
              y: -10,
              filter: "blur(4px)",
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.85,
            }}
            style={{ transformOrigin: "left center" }}
            className="soft-card absolute inset-0 p-6 md:p-7"
          >
            <PreviewCard preview={activeItem.preview} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
