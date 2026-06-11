"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SoftCard } from "../SoftCard";

const raw =
  "So umm yeah I was talking to Cheyene earlier and the reception was like really bad, and I think they're gonna handle the first part of the project but I'm not totally sure? And also I told the team the new timeline should be ready by Friday but it's probably gonna slip.";

const polished =
  "Hope your week is off to a good start. I spoke with Cheyene earlier — reception was poor. They'll likely handle the first part of the project, though I'm not entirely sure yet. I also let the team know the new timeline should be ready by Friday, though it may slip.";

const RAW_WORDS = raw.split(" ");
const POLISHED_WORDS = polished.split(" ");

const MS_PER_RAW_WORD = 78;
const PAUSE_AFTER_RAW_MS = 350;
const FLOW_MS = 1600;

type Phase = "listening" | "flow" | "polished";

function StatusCapsule({ label, pulse = false }: { label: string; pulse?: boolean }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)] shadow-sm"
    >
      {pulse && (
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]"
          animate={{ opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {label}
    </motion.span>
  );
}

function WordReveal({
  words,
  visibleCount,
  italic = false,
  dimmed = false,
  runKey,
  prefix,
}: {
  words: string[];
  visibleCount: number;
  italic?: boolean;
  dimmed?: boolean;
  runKey: number;
  prefix: string;
}) {
  return (
    <>
      {words.slice(0, visibleCount).map((word, i) => (
        <motion.span
          key={`${runKey}-${prefix}-${i}-${word}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{
            opacity: dimmed ? 0.32 : 1,
            y: dimmed ? -6 : 0,
            filter: dimmed ? "blur(5px)" : "blur(0px)",
          }}
          transition={{
            duration: dimmed ? 0.55 : 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`mr-[0.28em] inline-block ${italic ? "italic" : ""}`}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

export function FluidTransform() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [phase, setPhase] = useState<Phase>("listening");
  const [visibleRawWords, setVisibleRawWords] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback(
    (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    },
    [],
  );

  const startSequence = useCallback(() => {
    clearTimers();
    setPhase("listening");
    setVisibleRawWords(0);

    RAW_WORDS.forEach((_, i) => {
      schedule(() => setVisibleRawWords(i + 1), (i + 1) * MS_PER_RAW_WORD);
    });

    const flowAt = RAW_WORDS.length * MS_PER_RAW_WORD + PAUSE_AFTER_RAW_MS;
    schedule(() => setPhase("flow"), flowAt);
    schedule(() => setPhase("polished"), flowAt + FLOW_MS);
  }, [clearTimers, schedule]);

  useEffect(() => {
    if (!inView) return;
    startSequence();
    return clearTimers;
  }, [inView, runKey, startSequence, clearTimers]);

  useEffect(() => {
    if (!inView) return;

    const cycleMs =
      RAW_WORDS.length * MS_PER_RAW_WORD +
      PAUSE_AFTER_RAW_MS +
      FLOW_MS +
      POLISHED_WORDS.length * 25 +
      2200;

    const loop = window.setInterval(() => {
      setRunKey((k) => k + 1);
    }, cycleMs);

    return () => window.clearInterval(loop);
  }, [inView]);

  const replayTransform = () => {
    setRunKey((k) => k + 1);
  };

  const statusLabel =
    phase === "listening"
      ? "Listening"
      : phase === "flow"
        ? "Reading intent"
        : null;

  const cardLabel = phase === "polished" ? "What you meant" : "What you said";

  return (
    <section id="transform" ref={ref} className="landing-section landing-section--transform px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14">
        <motion.div whileHover={{ scale: 1.008 }} transition={{ duration: 0.35 }}>
          <SoftCard
            interactive
            hover
            onHoverStart={replayTransform}
            className="relative min-h-[340px] cursor-default overflow-hidden p-0 md:min-h-[380px]"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[#f3f1ec] via-[#faf9f7] to-[#ebe8e2]"
            />

            <AnimatePresence>
              {phase === "flow" && (
                <motion.div
                  initial={{ y: "-100%", opacity: 0.6 }}
                  animate={{ y: "100%", opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: [0.45, 0, 0.15, 1] }}
                  className="fluid-sweep pointer-events-none absolute inset-x-0 top-0 z-20 h-[55%]"
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 flex h-full flex-col p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className={`text-[11px] font-medium tracking-[0.02em] ${
                    phase === "polished"
                      ? "text-[var(--brand)]"
                      : "text-[var(--foreground-faint)]"
                  }`}
                >
                  {cardLabel}
                </span>
                <AnimatePresence mode="wait">
                  {statusLabel && (
                    <StatusCapsule
                      key={statusLabel}
                      label={statusLabel}
                      pulse={phase === "listening"}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="relative min-h-[180px] flex-1 md:min-h-[200px]">
                <AnimatePresence mode="wait">
                  {phase !== "polished" ? (
                    <motion.p
                      key={`raw-${runKey}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, filter: "blur(10px)", y: -12 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[15px] leading-[1.75] text-[var(--foreground-muted)]"
                    >
                      <WordReveal
                        words={RAW_WORDS}
                        visibleCount={visibleRawWords}
                        italic
                        dimmed={phase === "flow"}
                        runKey={runKey}
                        prefix="raw"
                      />
                      {phase === "listening" &&
                        visibleRawWords > 0 &&
                        visibleRawWords < RAW_WORDS.length && (
                          <motion.span
                            aria-hidden
                            className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[2px] bg-[var(--foreground-muted)]/70"
                            animate={{ opacity: [1, 0.15, 1] }}
                            transition={{ duration: 0.75, repeat: Infinity }}
                          />
                        )}
                    </motion.p>
                  ) : (
                    <motion.p
                      key={`polished-${runKey}`}
                      initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-[15px] font-medium leading-[1.75] text-[var(--foreground)]"
                    >
                      {POLISHED_WORDS.map((word, i) => (
                        <motion.span
                          key={`${runKey}-polished-${i}-${word}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: i * 0.025,
                            duration: 0.35,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="mr-[0.28em] inline-block"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SoftCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
            What you said.
            <br />
            What you meant.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-[var(--foreground-muted)]">
            Lazur reads your intent — strips filler, fixes grammar, shapes tone
            — while you keep talking. Not a transcript. Writing you&apos;d
            actually hit send on.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
