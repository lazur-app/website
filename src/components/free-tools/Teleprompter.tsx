"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Field, Notice, Panel, inputClass } from "./ui";

const KEY = "lazur-teleprompter-script";
const SAMPLE = "Welcome! Paste your script here and press Start.\n\nYour words will scroll smoothly while you look at the camera. Use Space to pause, the arrow keys to change speed, and plus or minus to resize the text.";

type Unit = "px" | "wpm";

/** Browser teleprompter: paste a script, tune the look, and read it on a scrolling fullscreen overlay. */
export function Teleprompter(props: { page?: string }) {
  const mirrorDefault = !!props.page && /mirror|glass|rig/i.test(props.page);
  const [script, setScript] = useState(SAMPLE);
  const [fontSize, setFontSize] = useState(56);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [width, setWidth] = useState(80);
  const [mirror, setMirror] = useState(mirrorDefault);
  const [guide, setGuide] = useState(true);
  const [unit, setUnit] = useState<Unit>("px");
  const [speedPx, setSpeedPx] = useState(60);
  const [speedWpm, setSpeedWpm] = useState(140);
  const [camera, setCamera] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [camError, setCamError] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const posRef = useRef(0);
  const live = useRef({ unit, speedPx, speedWpm, words: 1 });

  const words = useMemo(() => (script.match(/\S+/g) ?? []).length, [script]);
  useEffect(() => {
    live.current = { unit, speedPx, speedWpm, words: Math.max(1, words) };
  });

  // Restore + remember the script.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setScript(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, script);
    } catch {
      /* storage unavailable */
    }
  }, [script]);

  const applyPos = useCallback(() => {
    const el = contentRef.current;
    if (el) el.style.transform = `translateY(${-posRef.current}px)`;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setPlaying(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  const start = () => {
    posRef.current = 0;
    setOpen(true);
    setPlaying(true);
  };

  // Enter fullscreen once the overlay is mounted.
  useEffect(() => {
    if (!open) return;
    applyPos();
    const el = overlayRef.current;
    if (el?.requestFullscreen) void el.requestFullscreen().catch(() => {});
    const onFs = () => {
      if (!document.fullscreenElement) close();
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [open, applyPos, close]);

  // Auto-scroll loop.
  useEffect(() => {
    if (!open || !playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const el = contentRef.current;
      if (el) {
        const l = live.current;
        const textH = Math.max(1, el.scrollHeight - window.innerHeight);
        const pxPerSec = l.unit === "px" ? l.speedPx : (l.speedWpm / 60) * (textH / l.words);
        const max = Math.max(0, el.scrollHeight - window.innerHeight * 0.4);
        posRef.current = Math.min(max, posRef.current + pxPerSec * dt);
        applyPos();
        if (posRef.current >= max) setPlaying(false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, playing, applyPos]);

  const bumpSpeed = useCallback((dir: 1 | -1) => {
    if (live.current.unit === "px") setSpeedPx((v) => Math.min(400, Math.max(5, v + dir * 10)));
    else setSpeedWpm((v) => Math.min(400, Math.max(20, v + dir * 10)));
  }, []);

  // Keyboard controls.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        bumpSpeed(1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        bumpSpeed(-1);
      } else if (e.key === "Escape") {
        close();
      } else if (e.key === "+" || e.key === "=") {
        setFontSize((f) => Math.min(160, f + 4));
      } else if (e.key === "-" || e.key === "_") {
        setFontSize((f) => Math.max(20, f - 4));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, bumpSpeed, close]);

  // Camera preview.
  useEffect(() => {
    if (!open || !camera) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCamError("");
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCamError("Camera blocked or not found. Allow camera access in the address bar to see yourself."));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, camera]);

  const speedLabel = unit === "px" ? `${speedPx} px/s` : `${speedWpm} wpm`;

  useMomentWhen(open && playing, "your script is rolling", 15000);
  return (
    <Panel className="space-y-5">
      <Field label=" Your script" hint="Saved in this browser only. Nothing is uploaded.">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={9}
          placeholder={SAMPLE}
          className={`${inputClass} resize-y leading-[1.6]`}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={` Font size: ${fontSize}px`}>
          <input type="range" min={20} max={160} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </Field>
        <Field label={`Line height: ${lineHeight.toFixed(1)}`}>
          <input type="range" min={1} max={2.4} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </Field>
        <Field label={`Text width: ${width}%`}>
          <input type="range" min={30} max={100} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </Field>
        <div>
          <span className="mb-1.5 flex items-center justify-between text-[14px] font-medium">
            <span> Scroll speed: {speedLabel}</span>
            <button type="button" className="text-[13px] text-[var(--brand)] underline" onClick={() => setUnit(unit === "px" ? "wpm" : "px")}>
              switch to {unit === "px" ? "words/min" : "px/s"}
            </button>
          </span>
          {unit === "px" ? (
            <input type="range" min={5} max={400} value={speedPx} onChange={(e) => setSpeedPx(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          ) : (
            <input type="range" min={20} max={400} value={speedWpm} onChange={(e) => setSpeedWpm(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} className="h-5 w-5 accent-[var(--brand)]" />
           Mirror text (glass rigs)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={guide} onChange={(e) => setGuide(e.target.checked)} className="h-5 w-5 accent-[var(--brand)]" />
           Reading line
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={camera} onChange={(e) => setCamera(e.target.checked)} className="h-5 w-5 accent-[var(--brand)]" />
           Camera preview
        </label>
      </div>

      <Btn onClick={start} disabled={!script.trim()} className="w-full !py-4 text-[17px]">
        Start teleprompter
      </Btn>
      <Notice>Space = play/pause · ↑ ↓ = speed · + / − = font size · Esc = exit. About {Math.max(1, Math.round(words / 130))} min at 130 wpm.</Notice>

      {open ? (
        <div ref={overlayRef} className="fixed inset-0 z-[9999] overflow-hidden bg-black keep-case text-white" role="dialog" aria-label="Teleprompter">
          <div
            ref={contentRef}
            className="mx-auto will-change-transform"
            style={{
              width: `${width}%`,
              paddingTop: "35vh",
              paddingBottom: "70vh",
              fontSize,
              lineHeight,
              fontWeight: 600,
              textAlign: "center",
              whiteSpace: "pre-wrap",
              transform: "translateY(0px)",
            }}
          >
            <div style={{ transform: mirror ? "scaleX(-1)" : undefined }}>{script}</div>
          </div>

          {guide ? (
            <div
              className="pointer-events-none absolute inset-x-0 border-y-2 border-[var(--brand)] bg-[var(--brand)]/10"
              style={{ top: "35vh", height: fontSize * lineHeight }}
            />
          ) : null}

          {camera ? (
            <div className="absolute bottom-24 right-4 w-40 overflow-hidden rounded-2xl border border-white/30 bg-black/70 sm:w-56">
              {camError ? (
                <p className="p-3 text-[12px] leading-snug text-white/80">{camError}</p>
              ) : (
                <video ref={videoRef} autoPlay muted playsInline className="block w-full -scale-x-100" />
              )}
            </div>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 bg-gradient-to-t from-black to-transparent p-4 text-[14px]">
            <Btn tone="ghost" className="!border-white/40 !text-white hover:!bg-white/10" onClick={() => setPlaying((p) => !p)}>
              {playing ? " Pause" : "Play"}
            </Btn>
            <Btn tone="ghost" className="!border-white/40 !text-white hover:!bg-white/10" onClick={() => bumpSpeed(-1)}>
               Slower
            </Btn>
            <span className="min-w-[80px] text-center text-white/80">{speedLabel}</span>
            <Btn tone="ghost" className="!border-white/40 !text-white hover:!bg-white/10" onClick={() => bumpSpeed(1)}>
               Faster
            </Btn>
            <Btn tone="ghost" className="!border-white/40 !text-white hover:!bg-white/10" onClick={() => setFontSize((f) => Math.max(20, f - 4))}>
              A−
            </Btn>
            <Btn tone="ghost" className="!border-white/40 !text-white hover:!bg-white/10" onClick={() => setFontSize((f) => Math.min(160, f + 4))}>
              A+
            </Btn>
            <Btn tone="danger" onClick={close}>
               Exit
            </Btn>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
