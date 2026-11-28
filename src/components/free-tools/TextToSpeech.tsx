"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Field, Notice, Panel, Unsupported, inputClass } from "./ui";

const SAMPLE =
  "Hello! This is a quick sample of text to speech. Pick a voice, slide the speed and pitch to taste, and press play. Everything is spoken by your own browser, so nothing leaves this page.";

type Mode = "idle" | "playing" | "paused";

function langName(code: string): string {
  try {
    const base = code.split(/[-_]/)[0];
    const region = code.split(/[-_]/)[1];
    const dn = new Intl.DisplayNames(["en"], { type: "language" });
    const name = dn.of(base) ?? code;
    return region ? `${name} (${region.toUpperCase()})` : name;
  } catch {
    return code;
  }
}

/** Text to speech using the browser's own voices. Nothing is sent anywhere. */
export function TextToSpeech(_props: { page?: string }) {
  void _props;
  const [supported, setSupported] = useState<boolean | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [text, setText] = useState(SAMPLE);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [mode, setMode] = useState<Mode>("idle");
  const [progress, setProgress] = useState(0);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(ok);
    if (!ok) return;
    const synth = window.speechSynthesis;
    const load = () => {
      const list = synth.getVoices();
      if (!list.length) return;
      setVoices(list);
      setVoiceURI((cur) => {
        if (cur && list.some((v) => v.voiceURI === cur)) return cur;
        const nav = (navigator.language || "en-US").toLowerCase();
        const match =
          list.find((v) => v.lang.toLowerCase() === nav) ??
          list.find((v) => v.lang.toLowerCase().startsWith(nav.split("-")[0])) ??
          list.find((v) => v.default) ??
          list[0];
        return match.voiceURI;
      });
    };
    load();
    synth.addEventListener("voiceschanged", load);
    return () => {
      synth.removeEventListener("voiceschanged", load);
      synth.cancel();
    };
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, SpeechSynthesisVoice[]>();
    for (const v of voices) {
      const key = v.lang.replace("_", "-");
      map.set(key, [...(map.get(key) ?? []), v]);
    }
    return [...map.entries()].sort((a, b) => langName(a[0]).localeCompare(langName(b[0])));
  }, [voices]);

  const play = () => {
    const synth = window.speechSynthesis;
    const content = text.trim();
    if (!content) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(content);
    const v = voices.find((x) => x.voiceURI === voiceURI);
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    }
    u.rate = rate;
    u.pitch = pitch;
    u.onboundary = (e) => setProgress(Math.min(100, Math.round((e.charIndex / content.length) * 100)));
    u.onend = () => {
      if (uttRef.current !== u) return;
      setMode("idle");
      setProgress(100);
    };
    u.onerror = () => {
      if (uttRef.current !== u) return;
      setMode("idle");
    };
    uttRef.current = u;
    setProgress(0);
    setMode("playing");
    synth.speak(u);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setMode("paused");
  };
  const resume = () => {
    window.speechSynthesis.resume();
    setMode("playing");
  };
  const stop = () => {
    uttRef.current = null;
    window.speechSynthesis.cancel();
    setMode("idle");
    setProgress(0);
  };

  useMomentWhen(mode === "playing", "your text is being read aloud", 8000);
  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Text to speech" />
      </Panel>
    );
  }

  return (
    <Panel>
      <Field label=" Text to read aloud">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Type or paste something here…"
          className={`${inputClass} resize-y leading-[1.6]`}
        />
      </Field>
      <div className="mt-2 flex items-center justify-between text-[13px] text-[var(--foreground-muted)]">
        <span>{text.length.toLocaleString()} characters</span>
        <button type="button" onClick={() => setText(SAMPLE)} className="font-medium text-[var(--brand)] underline-offset-2 hover:underline">
           Use sample text
        </button>
      </div>

      <div className="mt-5">
        <Field label=" Voice">
          {supported && voices.length === 0 ? (
            <Notice>Loading voices from your browser… If this stays empty, your device may have no speech voices installed.</Notice>
          ) : (
            <select value={voiceURI} onChange={(e) => setVoiceURI(e.target.value)} className={inputClass}>
              {groups.map(([lang, list]) => (
                <optgroup key={lang} label={langName(lang)}>
                  {list.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[14px] font-medium">
            <span> Speed</span>
            <span className="tabular-nums text-[var(--foreground-muted)]">{rate.toFixed(1)}x</span>
          </span>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </label>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[14px] font-medium">
            <span> Pitch</span>
            <span className="tabular-nums text-[var(--foreground-muted)]">{pitch.toFixed(1)}</span>
          </span>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {mode === "idle" ? (
          <Btn onClick={play} disabled={!text.trim() || voices.length === 0} className="!px-7 !py-4 !text-[17px]">
            Play
          </Btn>
        ) : null}
        {mode === "playing" ? (
          <Btn tone="ghost" onClick={pause}>
             Pause
          </Btn>
        ) : null}
        {mode === "paused" ? <Btn onClick={resume}>Resume</Btn> : null}
        <Btn tone="ghost" onClick={stop} disabled={mode === "idle"}>
           Stop
        </Btn>
        {mode === "playing" ? (
          <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--brand)]" aria-live="polite">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--brand)]" />
            </span>
            Speaking…
          </span>
        ) : null}
      </div>

      {mode !== "idle" || progress === 100 ? (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background-deep)]"
        >
          <div className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <p className="mt-5 text-[13px] text-[var(--foreground-muted)]">Voices come from your device and browser, so the list differs on each computer. Nothing is uploaded.</p>
    </Panel>
  );
}
