"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Notice, Panel } from "./ui";

const COLORS: { name: string; css: string }[] = [
  { name: "Black", css: "#000000" },
  { name: "White", css: "#ffffff" },
  { name: "Red", css: "#ff0000" },
  { name: "Green", css: "#00ff00" },
  { name: "Blue", css: "#0000ff" },
  { name: "Yellow", css: "#ffff00" },
  { name: "Cyan", css: "#00ffff" },
  { name: "Magenta", css: "#ff00ff" },
  { name: "Gradient", css: "linear-gradient(90deg,#000,#fff)" },
];

/** Dead / stuck pixel test: fullscreen solid colours you cycle through, plus a gradient step. */
export function DeadPixelTest(props: { page?: string }) {
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(props.page === "oled" ? 0 : 0);
  const [hintVisible, setHintVisible] = useState(true);
  const [finished, setFinished] = useState(false);
  const ranRef = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashHint = useCallback(() => {
    setHintVisible(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHintVisible(false), 2500);
  }, []);

  const exit = useCallback(() => {
    setRunning(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  const start = async () => {
    setIndex(props.page === "oled" ? 0 : 0);
    setRunning(true);
    ranRef.current = true;
    setFinished(false);
    flashHint();
  };

  // Request fullscreen once the overlay exists; fall back silently to the fixed overlay.
  useEffect(() => {
    if (!running) return;
    const el = boxRef.current;
    if (el?.requestFullscreen) void el.requestFullscreen().catch(() => {});
    el?.focus();
  }, [running]);

  // Leaving fullscreen with Esc ends the test.
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setRunning((r) => (r ? false : r));
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!running) return;
    const next = () => {
      setIndex((i) => (i + 1) % COLORS.length);
      flashHint();
    };
    const prev = () => {
      setIndex((i) => (i - 1 + COLORS.length) % COLORS.length);
      flashHint();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return exit();
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, exit, flashHint]);

  useEffect(
    () => () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    },
    [],
  );

  // Lock page scroll while the overlay is up.
  useEffect(() => {
    if (!running) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [running]);

  const color = COLORS[index];
  const darkBg = ["Black", "Blue", "Red", "Magenta", "Gradient"].includes(color.name);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!running && ranRef.current) setFinished(true);
  }, [running]);
  // Opens after the visitor leaves the full-screen colours, never on top of them.
  useMomentWhen(finished, "pixel test done", 900);
  return (
    <Panel className="space-y-5 text-center">
      <div className="flex justify-center gap-1.5" aria-hidden>
        {COLORS.slice(0, 8).map((c) => (
          <span key={c.name} className="h-7 w-7 rounded-full border border-[var(--border-strong)]" style={{ background: c.css }} />
        ))}
      </div>
      <p className="text-[15px] text-[var(--foreground-muted)]">
        {props.page === "oled" ? " OLED screens show stuck pixels best on black, so we start there. " : ""}
        Your screen will fill with solid colours. Look closely for dots that stay the wrong colour: <strong>dead</strong> pixels (black on a lit screen) or <strong>stuck</strong> pixels (always on).
      </p>
      <Btn onClick={start} className="w-full !py-4 !text-[17px]">
         Start test
      </Btn>
      <Notice> Tip: wipe your screen first. Dust and specks look a lot like dead pixels.</Notice>

      {running ? (
        <div
          ref={boxRef}
          tabIndex={-1}
          role="dialog"
          aria-label="Dead pixel test"
          onClick={() => {
            setIndex((i) => (i + 1) % COLORS.length);
            flashHint();
          }}
          className="fixed inset-0 z-[9999] cursor-pointer select-none outline-none"
          style={{ background: color.css }}
        >
          <div
            className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-opacity duration-700 ${hintVisible ? "opacity-100" : "opacity-0"} ${darkBg ? "bg-white/85 text-black" : "bg-black/75 text-white"}`}
          >
            {color.name} ({index + 1}/{COLORS.length}) · click or press → for next colour, Esc to exit
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              exit();
            }}
            className="absolute right-4 top-4 rounded-full bg-black/60 px-4 py-2 text-[14px] font-semibold text-white opacity-30 transition hover:opacity-100 focus:opacity-100"
          >
             Exit
          </button>
        </div>
      ) : null}
    </Panel>
  );
}
