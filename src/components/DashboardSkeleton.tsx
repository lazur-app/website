"use client";

import { motion } from "framer-motion";
import { Navbar } from "./Navbar";

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-[var(--background-deep)] skeleton-shimmer ${className}`}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)] grain">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Profile */}
          <div className="mb-10 flex items-center gap-4">
            <Bone className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2.5">
              <Bone className="h-6 w-40" />
              <Bone className="h-4 w-52 max-w-full" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.45 }}
                className="glass rounded-2xl p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <Bone className="h-3 w-16" />
                  <Bone className="h-4 w-4 rounded-full" />
                </div>
                <Bone className="mb-2 h-8 w-28" />
                <Bone className="h-4 w-36" />
                {i === 1 && <Bone className="mt-5 h-2 w-full rounded-full" />}
              </motion.section>
            ))}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="glass mt-4 rounded-2xl p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <Bone className="h-3 w-20" />
              <Bone className="h-4 w-4 rounded-full" />
            </div>
            <div className="flex gap-8">
              <div className="space-y-2">
                <Bone className="h-3 w-24" />
                <Bone className="h-7 w-10" />
              </div>
              <div className="space-y-2">
                <Bone className="h-3 w-24" />
                <Bone className="h-7 w-12" />
              </div>
            </div>
            <Bone className="mt-5 h-10 w-full rounded-xl" />
          </motion.section>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.06, duration: 0.45 }}
                className="glass flex items-center gap-3 rounded-2xl p-5"
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
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
            </span>
            Loading your account…
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
