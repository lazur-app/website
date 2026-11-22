"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Navbar } from "./Navbar";
import { MarketingPageShell } from "./MarketingPageShell";

const CARD =
  "rounded-[20px] border-[1.5px] border-[#1c1917] bg-white p-5 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] md:p-6";

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-[#1c1917]/[0.07] skeleton-shimmer ${className}`}
      aria-hidden
    />
  );
}

/** Loading state for the dashboard and billing pages: the same outline as the real page. */
export function DashboardSkeleton() {
  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center">
            <Bone className="h-16 w-16 rounded-full" />
            <Bone className="mt-6 h-12 w-80 max-w-full" />
            <Bone className="mt-4 h-4 w-48 max-w-full" />
            <Bone className="mt-8 h-[52px] w-44 rounded-full" />
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3 md:gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
                className={CARD}
              >
                <div className="flex items-center gap-2">
                  <Bone className="h-6 w-6 rounded-full" />
                  <Bone className="h-3 w-28" />
                </div>
                <Bone className="mt-6 h-8 w-28" />
                <Bone className="mt-2 h-4 w-36" />
                <Bone className="mt-6 h-12 w-full rounded-full" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
            className={`mt-4 md:mt-6 ${CARD}`}
          >
            <div className="flex items-center gap-2">
              <Bone className="h-6 w-6 rounded-full" />
              <Bone className="h-3 w-32" />
            </div>
            <Bone className="mt-4 h-4 w-full max-w-[24rem]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-2 text-[14px] font-medium text-[var(--foreground-muted)]"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your account…
          </motion.p>
        </motion.div>
      </main>
    </MarketingPageShell>
  );
}
