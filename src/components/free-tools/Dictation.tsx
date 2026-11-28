"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLazurMoment, useMomentWhen } from "./Letter";
import { Btn, CopyBtn, Field, Notice, Panel, Stat, Unsupported, inputClass } from "./ui";
import { Mic, Square } from "lucide-react";

/* ---------- Web Speech API (not in lib.dom), typed locally ---------- */

interface SRAlternative {
  transcript: string;
  confidence: number;
}
interface SRResult {
  isFinal: boolean;
  length: number;
  [index: number]: SRAlternative;
}
interface SREvent {
  resultIndex: number;
  results: { length: number; [index: number]: SRResult };
}
interface SRErrorEvent {
  error: string;
}
export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SRCtor = new () => SpeechRecognitionLike;

export function getSpeechRecognitionCtor(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type SpeechError = "denied" | "nomic" | "network" | "other";

export function speechErrorMessage(e: SpeechError): string {
  switch (e) {
    case "denied":
      return "The browser blocked the microphone or speech service. Click the lock icon next to the address bar, set Microphone to Allow, then try again.";
    case "nomic":
      return "No microphone was found. Plug one in or check your system sound settings, then try again.";
    case "network":
      return "The speech service couldn't be reached. Speech recognition in your browser needs an internet connection.";
    default:
      return "Something went wrong with speech recognition. Please try again.";
  }
}

/**
 * Shared speech engine. Calls onFinal for every finalized phrase, exposes interim text, and
 * (in continuous mode) restarts itself when the browser stops the engine on its own.
 */
export function useSpeechRecognition(opts: { lang: string; continuous?: boolean; onFinal: (text: string) => void }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);

  const optsRef = useRef(opts);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const wantRef = useRef(false);

  useEffect(() => {
    optsRef.current = opts;
  });
  useEffect(() => {
    setSupported(getSpeechRecognitionCtor() !== null);
  }, []);

  const create = useCallback(function create(): SpeechRecognitionLike | null {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return null;
    const r = new Ctor();
    const continuous = optsRef.current.continuous ?? true;
    r.lang = optsRef.current.lang;
    r.continuous = continuous;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0]?.transcript ?? "";
        if (res.isFinal) {
          if (t.trim()) optsRef.current.onFinal(t.trim());
        } else {
          interimText += t;
        }
      }
      setInterim(interimText);
    };
    r.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      wantRef.current = false;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError("denied");
      else if (e.error === "audio-capture") setError("nomic");
      else if (e.error === "network") setError("network");
      else setError("other");
    };
    r.onend = () => {
      setInterim("");
      if (wantRef.current && continuous) {
        // The engine stops itself after a pause; keep going until the user presses stop.
        setTimeout(() => {
          if (!wantRef.current) return;
          try {
            recRef.current = create();
            recRef.current?.start();
          } catch {
            wantRef.current = false;
            setListening(false);
          }
        }, 250);
      } else {
        wantRef.current = false;
        setListening(false);
      }
    };
    return r;
  }, []);

  const start = useCallback(() => {
    if (wantRef.current) return;
    setError(null);
    const r = create();
    if (!r) return;
    recRef.current = r;
    wantRef.current = true;
    try {
      r.start();
      setListening(true);
    } catch {
      wantRef.current = false;
      setListening(false);
    }
  }, [create]);

  const stop = useCallback(() => {
    wantRef.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* already stopped */
    }
    setListening(false);
    setInterim("");
  }, []);

  useEffect(
    () => () => {
      wantRef.current = false;
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
    },
    [],
  );

  return { supported, listening, interim, error, start, stop };
}

/* ---------- helpers shared with the other voice widgets ---------- */

export function PulseDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#c23030]" aria-live="polite">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d94040] opacity-70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#d94040]" />
      </span>
      {label}
    </span>
  );
}

export function MicButton({ listening, onClick, disabled }: { listening: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={listening}
      aria-label={listening ? "Stop listening" : "Start listening"}
      className={`relative flex h-24 w-24 items-center justify-center rounded-full text-[40px] text-white shadow-lg transition disabled:opacity-50 ${
        listening ? "bg-[#d94040]" : "bg-[var(--brand)] hover:bg-[var(--brand-hover)]"
      }`}
    >
      {listening ? <span className="absolute inset-0 animate-ping rounded-full bg-[#d94040] opacity-30" /> : null}
      <span className="relative">{listening ? <Square className="h-6 w-6 fill-current" /> : <Mic className="h-7 w-7" />}</span>
    </button>
  );
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function countWords(s: string) {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Turns spoken "comma", "period", "new line"... into real punctuation (English only). */
export function applySpokenPunctuation(text: string): string {
  return text
    .replace(/\s*\bnew paragraph\b\s*/gi, "\n\n")
    .replace(/\s*\bnew line\b\s*/gi, "\n")
    .replace(/\s*\bquestion mark\b/gi, "?")
    .replace(/\s*\b(exclamation mark|exclamation point)\b/gi, "!")
    .replace(/\s*\b(period|full stop)\b/gi, ".")
    .replace(/\s*\bcomma\b/gi, ",")
    .replace(/\s*\bcolon\b/gi, ":")
    .replace(/\s*\bsemicolon\b/gi, ";");
}

/** Appends a finalized phrase to existing text with sensible spacing and sentence capitals. */
export function appendDictated(prev: string, chunk: string, capitalize: boolean): string {
  let c = chunk.trim();
  if (!c) return prev;
  const atStart = prev.length === 0 || /[\n]$/.test(prev) || /[.?!]\s*$/.test(prev);
  if (capitalize && atStart) c = c.charAt(0).toUpperCase() + c.slice(1);
  if (!prev) return c;
  if (/^[,.?!:;\n]/.test(c) || /\n$/.test(prev)) return prev + c;
  return prev + " " + c;
}

export const DICTATION_LANGS: { code: string; label: string }[] = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "en-IN", label: "English (India)" },
  { code: "en-AU", label: "English (Australia)" },
  { code: "es-ES", label: "Spanish (Spain)" },
  { code: "es-MX", label: "Spanish (Mexico)" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "pt-PT", label: "Portuguese (Portugal)" },
  { code: "nl-NL", label: "Dutch" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ar-SA", label: "Arabic" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "zh-CN", label: "Chinese (Mandarin)" },
  { code: "ru-RU", label: "Russian" },
  { code: "tr-TR", label: "Turkish" },
];

const PAGE_LANG: Record<string, string> = {
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  portuguese: "pt-BR",
  hindi: "hi-IN",
  arabic: "ar-SA",
  japanese: "ja-JP",
  uk: "en-GB",
  india: "en-IN",
};

/** Dictation: speak and watch your words appear. Everything stays in the browser. */
export function Dictation(props: { page?: string }) {
  const [lang, setLang] = useState(() => (props.page && PAGE_LANG[props.page]) || "en-US");
  const [text, setText] = useState("");
  const [punct, setPunct] = useState(true);
  const textRef = useRef("");
  const langRef = useRef(lang);
  const punctRef = useRef(punct);

  useEffect(() => {
    langRef.current = lang;
    punctRef.current = punct;
  });

  const onFinal = useCallback((t: string) => {
    const english = langRef.current.startsWith("en");
    const processed = punctRef.current && english ? applySpokenPunctuation(t) : t;
    const next = appendDictated(textRef.current, processed, english);
    textRef.current = next;
    setText(next);
  }, []);

  const { supported, listening, interim, error, start, stop } = useSpeechRecognition({ lang, onFinal });

  const edit = (v: string) => {
    textRef.current = v;
    setText(v);
  };

  const spoken = (text.match(/\S+/g) ?? []).length;
  useMomentWhen(!listening && spoken >= 15, `${spoken} words, typed by your voice`, 2000);
  const moment = useLazurMoment();
  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Speech recognition" />
      </Panel>
    );
  }

  const words = countWords(text + " " + interim);

  return (
    <Panel>
      <div className="flex flex-col items-center gap-3 text-center">
        <MicButton listening={listening} onClick={listening ? stop : start} disabled={supported === null} />
        <div className="min-h-[24px]">
          {listening ? (
            <PulseDot label="Listening… speak now" />
          ) : text ? (
            <span className="text-[14px] font-medium text-[#2f7a3d]"> Done. Edit below, copy or download.</span>
          ) : (
            <span className="text-[14px] text-[var(--foreground-muted)]">Tap the mic and start talking</span>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label=" Language">
          <select
            value={lang}
            onChange={(e) => {
              if (listening) stop();
              setLang(e.target.value);
            }}
            className={inputClass}
          >
            {DICTATION_LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>
        <label className="flex items-center gap-2 pb-3 text-[14px] text-[var(--foreground)]">
          <input type="checkbox" checked={punct} onChange={(e) => setPunct(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
          Spoken punctuation
        </label>
      </div>

      {error ? (
        <div className="mt-4">
          <Notice tone="warn">{speechErrorMessage(error)}</Notice>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-[var(--border-strong)] bg-white focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[var(--brand-soft)]">
        <textarea
          value={text}
          onChange={(e) => edit(e.target.value)}
          rows={9}
          placeholder="Your words will appear here. You can also type or fix things by hand."
          aria-label="Dictated text"
          className="block w-full resize-y rounded-2xl bg-transparent px-4 py-3 text-[16px] leading-[1.6] text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-faint)]"
        />
        {interim ? <p className="px-4 pb-3 text-[16px] italic leading-[1.5] text-[var(--foreground-faint)]">{interim}</p> : null}
      </div>
      {punct && lang.startsWith("en") ? (
        <p className="mt-2 text-[13px] text-[var(--foreground-muted)]">
          Try saying &ldquo;comma&rdquo;, &ldquo;period&rdquo;, &ldquo;question mark&rdquo;, &ldquo;new line&rdquo; or &ldquo;new paragraph&rdquo;.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyBtn text={text} />
        <Btn tone="ghost" disabled={!text} onClick={() => {
            downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), "dictation.txt");
            moment({ label: "your text is downloading", every: true, delay: 500, words: spoken });
          }}>
          Download .txt
        </Btn>
        <Btn
          tone="ghost"
          disabled={!text}
          onClick={() => {
            stop();
            edit("");
          }}
        >
           Clear
        </Btn>
        <div className="ml-auto w-28">
          <Stat label="words" value={words} />
        </div>
      </div>
      <p className="mt-4 text-[13px] text-[var(--foreground-muted)]">
        Your browser&apos;s own speech engine does the listening. Lazur never receives your voice or your text. Some browsers (Chrome, for example) send speech to their own speech service to turn it into text.
      </p>
    </Panel>
  );
}
