"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Btn, Panel, Stat } from "./ui";
import { Sticker } from "@/components/landing/Sticker";

const MODES = [1, 5, 10, 30, 60];

function defaultSeconds(page?: string) {
  const m = page?.match(/^(\d+)-seconds?$/);
  const n = m ? Number(m[1]) : 5;
  return MODES.includes(n) ? n : 5;
}

function rating(cps: number) {
  if (cps < 3) return " Warming up. Slow and steady!";
  if (cps < 5) return " Average clicker. Solid.";
  if (cps < 7) return " Quick fingers!";
  if (cps < 9) return " Seriously fast!";
  if (cps < 12) return " Gamer-level speed!";
  return " Inhuman. Are you a robot?";
}

type Phase = "ready" | "running" | "done";

/** Click speed (CPS) test with 1 to 60 second modes and a personal best kept in this browser only. */
export function ClickSpeedTest(props: { page?: string }) {
  const spaceMode = props.page === "spacebar";
  const rightMode = props.page === "right-click";
  const [seconds, setSeconds] = useState(() => defaultSeconds(props.page));
  const [phase, setPhase] = useState<Phase>("ready");
  const [clicks, setClicks] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);

  const startRef = useRef(0);
  const clicksRef = useRef(0);
  const phaseRef = useRef<Phase>("ready");
  const rafRef = useRef(0);
  const secondsRef = useRef(seconds);
  secondsRef.current = seconds;

  const bestKey = `lazur-cps-best-${seconds}${spaceMode ? "-space" : rightMode ? "-right" : ""}`;

  useEffect(() => {
    try {
      const v = localStorage.getItem(bestKey);
      setBest(v ? Number(v) : null);
    } catch {
      setBest(null);
    }
  }, [bestKey]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const finish = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const total = secondsRef.current;
    setElapsed(total);
    setPhaseBoth("done");
    const cps = clicksRef.current / total;
    try {
      const prev = Number(localStorage.getItem(bestKey) ?? 0);
      if (cps > prev) {
        localStorage.setItem(bestKey, String(cps));
        setBest(cps);
        setNewBest(prev > 0);
      }
    } catch {
      /* storage blocked: skip personal best */
    }
  }, [bestKey]);

  const tick = useCallback(() => {
    const t = (performance.now() - startRef.current) / 1000;
    if (t >= secondsRef.current) {
      finish();
      return;
    }
    setElapsed(t);
    // eslint-disable-next-line react-hooks/immutability
    rafRef.current = requestAnimationFrame(tick);
  }, [finish]);

  const registerClick = useCallback(() => {
    if (phaseRef.current === "done") return;
    if (phaseRef.current === "ready") {
      clicksRef.current = 0;
      startRef.current = performance.now();
      setPhaseBoth("running");
      rafRef.current = requestAnimationFrame(tick);
    }
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  }, [tick]);

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    clicksRef.current = 0;
    setClicks(0);
    setElapsed(0);
    setNewBest(false);
    setPhaseBoth("ready");
  };

  useEffect(() => {
    if (!spaceMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
      e.preventDefault();
      registerClick();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spaceMode, registerClick]);

  const liveCps = elapsed > 0.05 ? clicks / elapsed : 0;
  const finalCps = clicks / seconds;
  const left = Math.max(0, seconds - elapsed);
  const verb = spaceMode ? "press Space" : rightMode ? "right-click" : "click";

  return (
    <Panel className="space-y-5">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Test length">
        {MODES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={phase === "running"}
            onClick={() => {
              setSeconds(s);
              reset();
            }}
            className={`rounded-full px-4 py-2 text-[15px] font-semibold transition disabled:opacity-50 ${
              s === seconds ? "bg-[var(--brand)] text-white" : "border border-[var(--border-strong)] hover:bg-[var(--background-deep)]"
            }`}
          >
             {s}s
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Clicks" value={clicks} />
        <Stat label="Time left" value={`${left.toFixed(1)}s`} />
        <Stat label={phase === "done" ? "Final CPS" : "Live CPS"} value={(phase === "done" ? finalCps : liveCps).toFixed(1)} />
      </div>

      {phase !== "done" ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Click area"
          onPointerDown={(e) => {
            if (rightMode ? e.button !== 2 : e.button !== 0 && e.pointerType === "mouse") return;
            registerClick();
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={`flex h-[240px] cursor-pointer select-none touch-manipulation flex-col items-center justify-center gap-2 rounded-3xl text-center transition active:scale-[0.985] sm:h-[300px] ${
            phase === "running" ? "bg-[var(--brand)] text-white" : "bg-[var(--brand-soft)] text-[var(--brand-ink)]"
          }`}
        >
          <span className="text-[56px]" aria-hidden>
            {spaceMode ? <Sticker name="key" size={64} /> : <Sticker name="bolt" size={64} rotate={-8} />}
          </span>
          <span className="px-4 text-[20px] font-semibold">
            {phase === "running" ? `Keep going! ${verb} as fast as you can` : `Start by ${rightMode ? "right-clicking" : spaceMode ? "pressing Space" : "clicking"} here`}
          </span>
        </div>
      ) : (
        <div className="space-y-4 rounded-3xl bg-[var(--background-deep)] px-4 py-8 text-center">
          <div className="text-[64px] font-bold leading-none tabular-nums text-[var(--brand)]">{finalCps.toFixed(1)}</div>
          <div className="text-[14px] text-[var(--foreground-muted)]">clicks per second ({clicks} clicks in {seconds}s)</div>
          <p className="text-[18px] font-semibold">{rating(finalCps)}</p>
          {newBest ? <p className="text-[15px] font-semibold text-[var(--brand)]"> New personal best!</p> : null}
          <Btn onClick={reset} className="mx-auto">
             Try again
          </Btn>
        </div>
      )}

      <p className="text-center text-[14px] text-[var(--foreground-muted)]">
         Personal best ({seconds}s): <strong className="text-[var(--foreground)]">{best ? `${best.toFixed(1)} CPS` : "not set yet"}</strong>
        <span className="block text-[12px] text-[var(--foreground-faint)]">Saved only in this browser.</span>
      </p>
    </Panel>
  );
}
