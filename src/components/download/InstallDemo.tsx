"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The three install steps, acted out on a tiny Mac by Lazur's blue sparkle: open the file from
 * Downloads, drag Lazur into Applications, then the notch says hi. Loops; the step list beside it
 * follows along.
 */

const INK = "#2563eb";
const EASE = [0.65, 0, 0.35, 1] as const;

export const INSTALL_STEPS = [
  { title: "Open Lazur.dmg", detail: "It's in your Downloads folder" },
  { title: "Drag Lazur into Applications", detail: "Then open it from there" },
  { title: "Say hi", detail: "Hold fn to dictate, ⌥ ⌘ to ask" },
];

const STEP_MS = [3400, 3800, 4200];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** The current install step, looping (still on the last step with reduced motion). */
export function useInstallStep() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STEP_MS.length), STEP_MS[step]);
    return () => window.clearTimeout(t);
  }, [step, reduced]);
  return reduced ? 2 : step;
}

function Sparkle({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: "drop-shadow(0 0 6px rgba(37,99,235,0.55))" }} aria-hidden>
      <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={INK} />
    </svg>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.25 } }}
      className="absolute left-5 top-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_14px_rgba(37,99,235,0.3)]"
      style={{ background: INK }}
    >
      {children}
    </motion.span>
  );
}

function AppIcon({ size = 44 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[22%] bg-[#1c1917] shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} aria-hidden>
        <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill="#fff" />
      </svg>
    </span>
  );
}

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="absolute inset-x-[8%] bottom-[10%] top-[20%] overflow-hidden rounded-xl bg-white shadow-[0_18px_40px_rgba(28,25,23,0.18)] ring-1 ring-black/5">
      <div className="flex h-7 items-center gap-1.5 border-b border-black/5 px-3">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-2 text-[10.5px] font-medium text-black/50">{title}</span>
      </div>
      <div className="relative h-[calc(100%-1.75rem)]">{children}</div>
    </div>
  );
}

/** Step 1: Downloads in Finder; the sparkle double-clicks the file. */
function OpenFile() {
  return (
    <Window title="Downloads">
      <div className="flex h-full items-center justify-center gap-10">
        {["Notes.pdf", "Lazur.dmg", "Photo.jpg"].map((f) => (
          <div key={f} className="flex flex-col items-center gap-1.5">
            <motion.div
              className="relative grid h-12 w-10 place-items-center rounded-md border border-black/10 bg-[#f5f5f7]"
              animate={f === "Lazur.dmg" ? { scale: [1, 1, 0.92, 1, 0.92, 1] } : undefined}
              transition={{ duration: 0.6, delay: 1.5, times: [0, 0.4, 0.55, 0.7, 0.85, 1] }}
            >
              {f === "Lazur.dmg" ? <AppIcon size={24} /> : <span className="h-5 w-4 rounded-sm bg-black/10" />}
            </motion.div>
            <span className={`text-[10px] ${f === "Lazur.dmg" ? "rounded bg-[#2563eb] px-1 text-white" : "text-black/50"}`}>{f}</span>
          </div>
        ))}
      </div>
      <motion.div className="absolute" initial={{ left: "85%", top: "85%" }} animate={{ left: "52%", top: "40%" }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}>
        <Sparkle />
        <Label>Open this</Label>
      </motion.div>
    </Window>
  );
}

/** Step 2: the installer window; the sparkle carries Lazur into Applications. */
function DragToApps() {
  return (
    <Window title="Lazur">
      <div className="absolute left-[22%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5 opacity-30">
        <AppIcon />
        <span className="text-[10px] text-black/60">Lazur</span>
      </div>
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width="70" height="20" viewBox="0 0 70 20" aria-hidden>
        <path d="M4 10 H62 M54 3 L63 10 L54 17" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute right-[22%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5">
        <motion.span
          className="grid h-11 w-11 place-items-center rounded-lg bg-[#5ac8fa]/80"
          animate={{ scale: [1, 1, 1.12, 1] }}
          transition={{ duration: 2.4, times: [0, 0.7, 0.8, 1], delay: 0.6 }}
        >
          <span className="h-5 w-6 rounded-sm bg-white/70" />
        </motion.span>
        <span className="text-[10px] text-black/60">Applications</span>
      </div>
      {/* Lazur's icon travelling with the sparkle */}
      <motion.div
        className="absolute flex flex-col items-center"
        initial={{ left: "22%", top: "50%", x: "-50%", y: "-60%" }}
        animate={{ left: ["22%", "22%", "78%", "78%"], top: ["50%", "50%", "50%", "50%"], opacity: [1, 1, 1, 0] }}
        transition={{ duration: 2.6, delay: 0.6, times: [0, 0.2, 0.85, 1], ease: EASE }}
      >
        <AppIcon />
        <span className="absolute -right-3 -top-3"><Sparkle size={16} /></span>
      </motion.div>
      <motion.div className="absolute" initial={{ left: "26%", top: "24%" }} animate={{ left: ["26%", "26%", "56%"], top: ["24%", "24%", "24%"] }} transition={{ duration: 2.6, delay: 0.6, times: [0, 0.2, 0.85], ease: EASE }}>
        <Label>Drag me here</Label>
      </motion.div>
    </Window>
  );
}

/** Step 3: Lazur is running; the notch opens and says hi. */
function SayHi() {
  return (
    <>
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden rounded-b-[14px] bg-[#3a3a3c] text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
        initial={{ width: "26%", height: 18 }}
        animate={{ width: "62%", height: 52 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.25 }} className="px-3.5">
          <div className="flex h-6 items-center justify-between text-[10px] font-medium text-white/60">
            Speaking
            <span className="flex h-2.5 items-end gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <motion.span key={i} className="w-[2px] rounded-full bg-white" animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1 }} />
              ))}
            </span>
          </div>
          <p className="truncate text-center text-[12px] font-medium">Hi! Hold fn and talk to me.</p>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 gap-2">
        {[["fn", "to dictate"], ["⌥ ⌘", "to ask"]].map(([k, what], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 + i * 0.2, duration: 0.3 }}
            className="flex items-center gap-1.5 rounded-lg bg-white/85 px-2 py-1.5 text-[10.5px] text-black/60 shadow-sm"
          >
            <kbd className="rounded-md border border-black/10 bg-white px-1.5 py-0.5 font-sans text-[11px] font-semibold text-black shadow-[0_2px_0_rgba(0,0,0,0.12)]">{k}</kbd>
            {what}
          </motion.div>
        ))}
      </div>
      <motion.div className="absolute" initial={{ left: "50%", top: "70%" }} animate={{ left: "74%", top: "16%" }} transition={{ duration: 1, ease: EASE, delay: 0.3 }}>
        <Sparkle />
      </motion.div>
    </>
  );
}

export function InstallDemo({ step }: { step: number }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-black/10"
      style={{ background: "linear-gradient(135deg, #c9b8ff 0%, #f3c4dd 45%, #ffd2a8 100%)" }}
      role="img"
      aria-label={`Install step ${step + 1}: ${INSTALL_STEPS[step].title}`}
    >
      <div className="absolute inset-x-0 top-0 h-5 bg-white/45" />
      {step !== 2 ? <div className="absolute left-1/2 top-0 h-[18px] w-[26%] -translate-x-1/2 rounded-b-[12px] bg-[#3a3a3c]" /> : null}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 ? <OpenFile /> : step === 1 ? <DragToApps /> : <SayHi />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
