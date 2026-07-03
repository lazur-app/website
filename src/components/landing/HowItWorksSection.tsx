"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { HowItWorksFlowCapsule } from "./HowItWorksFlowCapsule";

const PHASE_LABELS = ["Hold", "Speak", "Release"] as const;

type DemoPhase = "hold" | "speak" | "release" | "polished";

const RAW =
  "um hey just checking in uh did you get a chance to look at the doc i shared";
const POLISHED =
  "Just checking in — did you get a chance to review the document I shared?";

const WAVE_FILL = "#141210";
const WAVE_RIM_OPACITY = 0.11;

/** Same opacity, distinct paths — large/medium/small amplitude + phase offsets. */
const WAVE_RIMS = {
  top: [
    {
      opacity: WAVE_RIM_OPACITY,
      /** Back: largest amplitude, phase leads left */
      d: "M0,100 C200,15 520,55 760,100 C1010,148 1280,148 1440,95 L1440,330 C1280,255 1010,310 760,330 C520,348 200,272 0,350 Z",
    },
    {
      opacity: WAVE_RIM_OPACITY,
      /** Mid: medium amplitude, centered phase */
      d: "M0,145 C240,85 480,85 720,145 C960,205 1200,205 1440,145 L1440,385 C1200,465 960,410 720,430 C480,450 240,375 0,435 Z",
    },
    {
      opacity: WAVE_RIM_OPACITY,
      /** Front: smallest amplitude, phase lags right */
      d: "M0,178 C280,138 560,138 820,178 C1060,218 1280,218 1440,175 L1440,420 C1280,500 1060,445 820,465 C560,485 280,408 0,470 Z",
    },
  ],
  bottom: [
    {
      opacity: WAVE_RIM_OPACITY,
      /** Back: largest amplitude, phase leads left */
      d: "M0,1205 C200,1265 520,1225 760,1205 C1010,1185 1280,1185 1440,1210 L1440,1295 C1280,1370 1010,1315 760,1335 C520,1353 200,1278 0,1315 Z",
    },
    {
      opacity: WAVE_RIM_OPACITY,
      /** Mid: medium amplitude, centered phase */
      d: "M0,1230 C240,1290 480,1290 720,1230 C960,1170 1200,1170 1440,1230 L1440,1320 C1200,1260 960,1260 720,1320 C480,1380 240,1380 0,1320 Z",
    },
    {
      opacity: WAVE_RIM_OPACITY,
      /** Front: smallest amplitude, phase lags right */
      d: "M0,1252 C280,1292 560,1292 820,1252 C1060,1212 1280,1212 1440,1255 L1440,1348 C1280,1308 1060,1308 820,1348 C560,1388 280,1388 0,1348 Z",
    },
  ],
} as const;

/** Dominant dark body — asymmetric top, bottom hugs front rim. */
const WAVE_MAIN =
  "M0,180 C180,90 420,260 720,220 C980,190 1180,300 1440,140 L1440,1252 C1280,1212 1060,1212 820,1252 C560,1292 280,1292 0,1252 Z";

const TIMING = {
  hold: 210,
  speak: 2400,
  release: 580,
  polishedHold: 2400,
  reset: 650,
} as const;

function delay(ms: number, signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if (!signal.cancelled) resolve();
    }, ms);
  });
}

function phaseLabelActive(
  label: (typeof PHASE_LABELS)[number],
  phase: DemoPhase,
): boolean {
  if (label === "Hold") return phase === "hold";
  if (label === "Speak") return phase === "speak";
  return phase === "release";
}

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  const [demoPhase, setDemoPhase] = useState<DemoPhase>("hold");
  const [showCapsule, setShowCapsule] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [isPolished, setIsPolished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const speakWords = useCallback(
    (signal: { cancelled: boolean }, durationMs: number) =>
      new Promise<void>((resolve) => {
        const words = RAW.split(" ");
        const count = words.length;
        setDisplayText("");

        if (count === 0) {
          delay(durationMs, signal).then(resolve);
          return;
        }

        const start = performance.now();

        const step = () => {
          if (signal.cancelled) {
            resolve();
            return;
          }

          const elapsed = performance.now() - start;
          const nextIndex = Math.min(
            count,
            Math.max(1, Math.ceil((elapsed / durationMs) * count)),
          );
          setDisplayText(words.slice(0, nextIndex).join(" "));

          if (elapsed >= durationMs) {
            setDisplayText(words.join(" "));
            resolve();
            return;
          }

          requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      }),
    [],
  );

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setShowCapsule(false);
      setDisplayText(POLISHED);
      setIsPolished(true);
      setIsSpeaking(false);
      setIsProcessing(false);
      setDemoPhase("polished");
      return;
    }

    const signal = { cancelled: false };

    const runCycle = async () => {
      while (!signal.cancelled) {
        setShowCapsule(true);
        setDisplayText("");
        setIsPolished(false);
        setIsSpeaking(false);
        setIsProcessing(false);
        setDemoPhase("hold");

        await delay(TIMING.hold, signal);
        if (signal.cancelled) break;

        setDemoPhase("speak");
        setIsSpeaking(true);
        await speakWords(signal, TIMING.speak);
        if (signal.cancelled) break;

        setIsSpeaking(false);
        setDemoPhase("release");
        setIsProcessing(true);
        await delay(TIMING.release, signal);
        if (signal.cancelled) break;

        setIsProcessing(false);
        setShowCapsule(false);
        setIsPolished(true);
        setDisplayText(POLISHED);
        setDemoPhase("polished");

        await delay(TIMING.polishedHold, signal);
        if (signal.cancelled) break;

        await delay(TIMING.reset, signal);
      }
    };

    runCycle();

    return () => {
      signal.cancelled = true;
    };
  }, [inView, reduceMotion, speakWords]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative -mt-[195px] overflow-hidden pb-32 pt-[188px] text-[var(--background)] md:pb-36 md:pt-[222px]"
    >
      {/* Layered wave rims + main dark body (single SVG, back → front paint order) */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <svg
          viewBox="0 0 1440 1400"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden
        >
          {WAVE_RIMS.top.map((layer, index) => (
            <path
              key={`rim-top-${index}`}
              fill={WAVE_FILL}
              fillOpacity={layer.opacity}
              d={layer.d}
            />
          ))}
          {WAVE_RIMS.bottom.map((layer, index) => (
            <path
              key={`rim-bottom-${index}`}
              fill={WAVE_FILL}
              fillOpacity={layer.opacity}
              d={layer.d}
            />
          ))}
          <path fill={WAVE_FILL} d={WAVE_MAIN} />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(107, 75, 252, 0.22), transparent 72%)",
        }}
      />

      <div className="relative z-10 landing-container -mt-8 md:-mt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            How it works
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-white md:text-[2.5rem]">
            Three beats to flow state.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/55">
            No plugins. No app switching. One hotkey everywhere you type.
          </p>

          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium tracking-[0.04em]">
            {PHASE_LABELS.map((label, i) => {
              const on = phaseLabelActive(label, demoPhase);
              return (
                <span key={label} className="inline-flex items-center gap-2">
                  {i > 0 ? (
                    <span className="text-white/18" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <span
                    className={`transition-colors duration-200 ${
                      on ? "text-white/88" : "text-white/28"
                    }`}
                  >
                    {label}
                  </span>
                </span>
              );
            })}
          </p>
        </motion.div>

        <div className="mx-auto mt-9 max-w-xl md:mt-10">
          <div className="relative pt-5">
            <AnimatePresence>
              {showCapsule ? (
                <motion.div
                  key="capsule"
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 left-1/2 z-10 -translate-x-1/2"
                >
                  <HowItWorksFlowCapsule
                    listening={isSpeaking}
                    processing={isProcessing}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 pt-7 backdrop-blur-sm sm:p-5 sm:pt-8">
              <div className="min-h-[5.5rem] text-left">
                <AnimatePresence mode="wait">
                  {displayText ? (
                    isPolished ? (
                      <motion.p
                        key="polished"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="text-[14px] leading-relaxed font-medium text-white/95 sm:text-[15px]"
                      >
                        {displayText}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="raw"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[14px] leading-relaxed text-white/45 sm:text-[15px]"
                      >
                        {displayText.split(" ").map((word, i, arr) => (
                          <motion.span
                            key={`w-${i}`}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="inline"
                          >
                            {word}
                            {i < arr.length - 1 ? " " : ""}
                          </motion.span>
                        ))}
                      </motion.p>
                    )
                  ) : (
                    <motion.span
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-block h-[1.35rem] w-0.5 animate-pulse rounded-full bg-white/35"
                      aria-hidden
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
