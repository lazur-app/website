"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Navbar } from "./Navbar";
import { MarketingPageShell } from "./MarketingPageShell";

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-[var(--background-deep)] skeleton-shimmer ${className}`}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 space-y-2.5">
            <Bone className="h-3 w-16" />
            <Bone className="h-9 w-56 max-w-full" />
            <Bone className="h-4 w-72 max-w-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
                className="soft-card p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <Bone className="h-3 w-16" />
                  <Bone className="h-4 w-4 rounded-full" />
                </div>
                <Bone className="mb-2 h-8 w-28" />
                <Bone className="h-4 w-36" />
                {i === 1 && <Bone className="mt-5 h-2 w-full rounded-full" />}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="soft-card mt-4 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <Bone className="h-3 w-20" />
              <Bone className="h-4 w-4 rounded-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Bone className="h-3 w-20" />
                  <Bone className="h-7 w-12" />
                </div>
              ))}
            </div>
            <Bone className="mt-5 h-10 w-full rounded-[var(--radius-card)]" />
          </motion.div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.06, duration: 0.45 }}
                className="soft-card flex items-center gap-4 p-5"
              >
                <Bone className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-4 w-24" />
                  <Bone className="h-3 w-full max-w-[10rem]" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-[13px] text-[var(--foreground-faint)]"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your account…
          </motion.p>
        </motion.div>
      </main>
    </MarketingPageShell>
  );
}
