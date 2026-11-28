"use client";

import { useCallback, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, CopyBtn, Field, Notice, Panel, Unsupported, inputClass } from "./ui";
import { MicButton, PulseDot, appendDictated, countWords, speechErrorMessage, useSpeechRecognition } from "./Dictation";

const LANGS: { code: string; label: string; native: string; slug: string }[] = [
  { code: "hi-IN", label: "Hindi", native: "हिन्दी", slug: "hindi" },
  { code: "ta-IN", label: "Tamil", native: "தமிழ்", slug: "tamil" },
  { code: "te-IN", label: "Telugu", native: "తెలుగు", slug: "telugu" },
  { code: "mr-IN", label: "Marathi", native: "मराठी", slug: "marathi" },
  { code: "bn-IN", label: "Bengali", native: "বাংলা", slug: "bengali" },
  { code: "gu-IN", label: "Gujarati", native: "ગુજરાતી", slug: "gujarati" },
  { code: "ml-IN", label: "Malayalam", native: "മലയാളം", slug: "malayalam" },
  { code: "kn-IN", label: "Kannada", native: "ಕನ್ನಡ", slug: "kannada" },
  { code: "pa-IN", label: "Punjabi", native: "ਪੰਜਾਬੀ", slug: "punjabi" },
  { code: "ur-PK", label: "Urdu", native: "اردو", slug: "urdu" },
  { code: "si-LK", label: "Sinhala", native: "සිංහල", slug: "sinhala" },
  { code: "en-US", label: "English", native: "English", slug: "english" },
  { code: "es-ES", label: "Spanish", native: "Español", slug: "spanish" },
  { code: "fr-FR", label: "French", native: "Français", slug: "french" },
  { code: "ar-SA", label: "Arabic", native: "العربية", slug: "arabic" },
];

const RTL = new Set(["ur-PK", "ar-SA"]);

/** Voice typing in many languages: speak, get text in that script, copy it or send it to WhatsApp. */
export function VoiceTyping(props: { page?: string }) {
  const [lang, setLang] = useState(() => LANGS.find((l) => l.slug === props.page)?.code ?? "hi-IN");
  const [text, setText] = useState("");
  const textRef = useRef("");

  const onFinal = useCallback((t: string) => {
    const next = appendDictated(textRef.current, t, false);
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
  if (supported === false) {
    return (
      <Panel>
        <Unsupported what="Speech recognition" />
      </Panel>
    );
  }

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const rtl = RTL.has(lang);

  return (
    <Panel>
      <Field label=" Which language will you speak?">
        <select
          value={lang}
          onChange={(e) => {
            if (listening) stop();
            setLang(e.target.value);
          }}
          className={`${inputClass} !py-4 !text-[18px] font-medium`}
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label} · {l.native}
            </option>
          ))}
        </select>
      </Field>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <MicButton listening={listening} onClick={listening ? stop : start} disabled={supported === null} />
        <div className="min-h-[24px]">
          {listening ? (
            <PulseDot label={`Listening in ${current.label}…`} />
          ) : (
            <span className="text-[14px] text-[var(--foreground-muted)]">Tap the mic and speak in {current.label}</span>
          )}
        </div>
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
          rows={7}
          lang={lang}
          dir={rtl ? "rtl" : "ltr"}
          placeholder={`${current.native}…`}
          aria-label="Typed text"
          className="block w-full resize-y rounded-2xl bg-transparent px-4 py-3 text-[18px] leading-[1.7] text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-faint)]"
        />
        {interim ? (
          <p lang={lang} dir={rtl ? "rtl" : "ltr"} className="px-4 pb-3 text-[18px] italic leading-[1.6] text-[var(--foreground-faint)]">
            {interim}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyBtn text={text} />
        <a
          href={text ? `https://wa.me/?text=${encodeURIComponent(text)}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!text}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#1fa855] px-5 py-3 text-[15px] font-semibold text-white transition hover:opacity-90 ${text ? "" : "pointer-events-none opacity-50"}`}
        >
           Open WhatsApp with this text
        </a>
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
        <span className="ml-auto text-[14px] text-[var(--foreground-muted)]">{countWords(text)} words</span>
      </div>
      <p className="mt-4 text-[13px] text-[var(--foreground-muted)]">
        Your browser&apos;s speech engine writes the text in the right script. Lazur never receives your voice or your text. Some browsers (Chrome, for example) send speech to their own speech service to turn it into text. Chrome and Edge support the most languages.
      </p>
    </Panel>
  );
}
