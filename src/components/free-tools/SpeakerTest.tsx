"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Field, Notice, Panel, Unsupported } from "./ui";
import { Volume1, Volume2 } from "lucide-react";

type Side = "left" | "right" | "both";

/** Speaker / headphone test: left, right and both channels, a frequency slider and a sweep. Runs in WebAudio only. */
export function SpeakerTest(props: { page?: string }) {
  const headphones = props.page === "headphones" || props.page === "earphones";
  const [supported, setSupported] = useState(true);
  const [freq, setFreq] = useState(440);
  const [volume, setVolume] = useState(40);
  const [playing, setPlaying] = useState<Side | "sweep" | null>(null);
  const [plays, setPlays] = useState(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(typeof window !== "undefined" && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext));
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    try {
      oscRef.current?.stop();
    } catch {
      /* already stopped */
    }
    oscRef.current?.disconnect();
    oscRef.current = null;
    gainRef.current = null;
    setPlaying(null);
  }, []);

  useEffect(
    () => () => {
      stop();
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [stop],
  );

  useEffect(() => {
    if (gainRef.current && ctxRef.current) gainRef.current.gain.setTargetAtTime(volume / 100, ctxRef.current.currentTime, 0.02);
  }, [volume]);

  const play = (mode: Side | "sweep") => {
    stop();
    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const pan = ctx.createStereoPanner();
      const now = ctx.currentTime;
      const dur = mode === "sweep" ? 5 : 2;
      pan.pan.value = mode === "left" ? -1 : mode === "right" ? 1 : 0;
      osc.type = "sine";
      if (mode === "sweep") {
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + dur);
      } else {
        osc.frequency.value = freq;
      }
      const v = volumeRef.current / 100;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(v, now + 0.03);
      gain.gain.setTargetAtTime(0, now + dur - 0.1, 0.03);
      osc.connect(pan).connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
      osc.onended = () => {
        if (oscRef.current === osc) {
          oscRef.current = null;
          gainRef.current = null;
          setPlaying(null);
        }
      };
      oscRef.current = osc;
      gainRef.current = gain;
      setPlaying(mode);
      setPlays((n) => n + 1);
    } catch {
      setSupported(false);
    }
  };

  useMomentWhen(plays >= 2 && playing === null, "sound test done", 1200);
  if (!supported) {
    return (
      <Panel>
        <Unsupported what="Web Audio" />
      </Panel>
    );
  }

  const leftOn = playing === "left" || playing === "both" || playing === "sweep";
  const rightOn = playing === "right" || playing === "both" || playing === "sweep";

  const speaker = (label: string, on: boolean) => (
    <div
      key={label}
      className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 px-3 py-6 transition ${on ? "scale-[1.03] border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--border-strong)] bg-[var(--background-deep)]"}`}
    >
      <span className={`text-[44px] transition ${on ? "animate-pulse" : "opacity-60"}`} aria-hidden>
        {on ? <Volume2 className="h-11 w-11" /> : <Volume1 className="h-11 w-11" />}
      </span>
      <span className="text-[15px] font-semibold">{label}</span>
    </div>
  );

  return (
    <Panel className="space-y-6">
      <p className="text-center text-[15px] text-[var(--foreground-muted)]">
        {headphones
          ? " Put your headphones on and turn the volume down a little. Each button plays a tone in one ear, so you can check left and right are the right way round."
          : " Turn your volume to a comfortable level. Each button plays a tone from one side, so you can check both speakers work."}
      </p>

      <div className="flex gap-3" aria-live="polite">
        {speaker("Left", leftOn)}
        {speaker("Right", rightOn)}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Btn onClick={() => play("left")}>Left only</Btn>
        <Btn onClick={() => play("both")}> Both</Btn>
        <Btn onClick={() => play("right")}>Right only </Btn>
      </div>

      <div className="space-y-4">
        <Field label={` Tone pitch: ${freq} Hz`}>
          <input type="range" min={100} max={2000} step={10} value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </Field>
        <Field label={` Volume: ${volume}%`}>
          <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Btn tone="dark" onClick={() => play("sweep")}>
           Sweep 100 to 2000 Hz
        </Btn>
        <Btn tone="ghost" onClick={stop} disabled={!playing}>
           Stop
        </Btn>
      </div>

      <Notice> Hear nothing? Check the volume, that the right output device is selected in your system settings, and that the device isn&apos;t muted.</Notice>
    </Panel>
  );
}
