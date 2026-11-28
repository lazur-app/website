"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Field, Notice, Panel, Unsupported, inputClass } from "./ui";
import { Sticker } from "@/components/landing/Sticker";

const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
const WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

interface PdfTextItem {
  str?: string;
  hasEOL?: boolean;
}
interface PdfPage {
  getTextContent(): Promise<{ items: PdfTextItem[] }>;
}
interface PdfDoc {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
  destroy?: () => Promise<void>;
}
interface PdfJs {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(src: { data: ArrayBuffer }): { promise: Promise<PdfDoc> };
}

type Chunk = { page: number; text: string };

let pdfjsPromise: Promise<PdfJs> | null = null;
function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = (import(/* webpackIgnore: true */ PDFJS) as Promise<PdfJs>).then((m) => {
      m.GlobalWorkerOptions.workerSrc = WORKER;
      return m;
    });
    pdfjsPromise.catch(() => {
      pdfjsPromise = null;
    });
  }
  return pdfjsPromise;
}

/** Split page text into sentence groups short enough that browsers won't cut the utterance. */
function chunkPage(page: number, text: string, max = 220): Chunk[] {
  const sentences = text.replace(/\s+/g, " ").trim().match(/[^.!?。]+[.!?。]+["')\]]*|[^.!?。]+$/g) ?? [];
  const out: Chunk[] = [];
  let cur = "";
  const push = () => {
    if (cur.trim()) out.push({ page, text: cur.trim() });
    cur = "";
  };
  for (let s of sentences) {
    s = s.trim();
    while (s.length > max) {
      // Hard-split a very long sentence at the last space before max.
      let cut = s.lastIndexOf(" ", max);
      if (cut < 40) cut = max;
      if (cur) push();
      out.push({ page, text: s.slice(0, cut).trim() });
      s = s.slice(cut).trim();
    }
    if (cur && cur.length + s.length + 1 > max) push();
    cur += (cur ? " " : "") + s;
  }
  push();
  return out;
}

/** Load a PDF, pull out its text in the browser, and read it aloud with your device's voices. */
export function ReadPdfAloud(props: { page?: string }) {
  void props.page;
  const [supported, setSupported] = useState(true);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [pages, setPages] = useState(0);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<"stopped" | "playing" | "paused">("stopped");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);

  const token = useRef(0);
  const chunksRef = useRef<Chunk[]>([]);
  const rateRef = useRef(1);
  const voiceRef = useRef("");
  const indexRef = useRef(0);
  chunksRef.current = chunks;
  rateRef.current = rate;
  voiceRef.current = voiceUri;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const load = () => {
      const v = synth.getVoices();
      setVoices(v);
      setVoiceUri((cur) => cur || (v.find((x) => x.default) ?? v[0])?.voiceURI || "");
    };
    load();
    synth.addEventListener("voiceschanged", load);
    const tokenRef = token;
    return () => {
      synth.removeEventListener("voiceschanged", load);
      tokenRef.current++;
      synth.cancel();
    };
  }, []);

  const speakFrom = useCallback((i: number) => {
    const synth = window.speechSynthesis;
    const list = chunksRef.current;
    const my = ++token.current;
    synth.cancel();
    if (i >= list.length) {
      indexRef.current = 0;
      setIndex(0);
      setState("stopped");
      return;
    }
    indexRef.current = i;
    setIndex(i);
    setState("playing");
    const u = new SpeechSynthesisUtterance(list[i].text);
    u.rate = rateRef.current;
    const v = synth.getVoices().find((x) => x.voiceURI === voiceRef.current);
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    }
    u.onend = () => {
      if (token.current === my) speakFrom(i + 1);
    };
    u.onerror = (e) => {
      if (token.current === my && e.error !== "canceled" && e.error !== "interrupted") setState("stopped");
    };
    synth.speak(u);
  }, []);

  const stop = useCallback(() => {
    token.current++;
    window.speechSynthesis?.cancel();
    indexRef.current = 0;
    setIndex(0);
    setState("stopped");
  }, []);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    stop();
    setError("");
    setChunks([]);
    setPages(0);
    setFileName(file.name);
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError("Please choose a PDF file.");
      return;
    }
    try {
      setBusy("Loading PDF reader…");
      const pdfjs = await loadPdfJs();
      setBusy("Reading your PDF…");
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const all: Chunk[] = [];
      for (let p = 1; p <= doc.numPages; p++) {
        setBusy(`Extracting text… page ${p} of ${doc.numPages}`);
        const content = await (await doc.getPage(p)).getTextContent();
        const text = content.items.map((it) => (it.str ?? "") + (it.hasEOL ? "\n" : " ")).join("");
        all.push(...chunkPage(p, text));
      }
      setPages(doc.numPages);
      setChunks(all);
      if (!all.length) {
        setError("no-text");
      }
      void doc.destroy?.();
    } catch {
      setError("load-failed");
    } finally {
      setBusy("");
    }
  };

  // Let it read for a while first, so the note never cuts in on the first sentence.
  useMomentWhen(state === "playing", "your pdf is being read aloud", 12000);
  if (!supported) return <Panel><Unsupported what="Speech synthesis" /></Panel>;

  const current = chunks[index];
  const totalChars = chunks.reduce((a, c) => a + c.text.length, 0);

  return (
    <Panel className="space-y-5">
      <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--background-deep)] p-6 text-center hover:border-[var(--brand)]">
        <Sticker name="cloud" size={64} className="mx-auto" />
        <p className="mt-1 text-[16px] font-medium">{fileName || "Choose a PDF to read aloud"}</p>
        <p className="text-[14px] text-[var(--foreground-muted)]">The text is extracted on your device.</p>
        <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => void onFile(e.target.files?.[0])} />
      </label>

      {busy ? <Notice> {busy}</Notice> : null}
      {error === "no-text" ? (
        <Notice tone="warn">
           This PDF has no text layer. It&apos;s probably a scan, so there&apos;s nothing to read. Try our{" "}
          <a className="underline" href="https://pdf-to-text.lazur.app" target="_blank" rel="noreferrer">
            PDF to Text tool
          </a>{" "}
          which can pull text out of scanned pages.
        </Notice>
      ) : null}
      {error === "load-failed" ? (
        <Notice tone="warn">
          Couldn&apos;t open that PDF. It may be password-protected or damaged, or the PDF reader couldn&apos;t load (it needs an internet connection the first time).
        </Notice>
      ) : null}
      {error && error !== "no-text" && error !== "load-failed" ? <Notice tone="warn">{error}</Notice> : null}

      {chunks.length ? (
        <>
          <Notice>
             Found {chunks.length.toLocaleString()} passages across {pages} page{pages === 1 ? "" : "s"} (~{Math.max(1, Math.round(totalChars / 5 / 160 / (rate || 1)))} min to listen).
          </Notice>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label=" Voice">
              <select
                value={voiceUri}
                onChange={(e) => {
                  setVoiceUri(e.target.value);
                  voiceRef.current = e.target.value;
                  if (state === "playing") speakFrom(indexRef.current);
                }}
                className={inputClass}
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </Field>
            <Field label={` Speed: ${rate.toFixed(1)}x`}>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.1}
                value={rate}
                onChange={(e) => {
                  setRate(Number(e.target.value));
                  rateRef.current = Number(e.target.value);
                }}
                className="w-full accent-[var(--brand)]"
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3">
            {state === "stopped" ? (
              <Btn onClick={() => speakFrom(index)}>Play</Btn>
            ) : state === "playing" ? (
              <Btn
                tone="dark"
                onClick={() => {
                  window.speechSynthesis.pause();
                  setState("paused");
                }}
              >
                 Pause
              </Btn>
            ) : (
              <Btn
                onClick={() => {
                  window.speechSynthesis.resume();
                  setState("playing");
                }}
              >
                Resume
              </Btn>
            )}
            <Btn tone="ghost" disabled={state === "stopped" && index === 0} onClick={stop}>
               Stop
            </Btn>
            <Btn tone="ghost" disabled={index === 0} onClick={() => speakFrom(Math.max(0, index - 1))}>
               Back
            </Btn>
            <Btn tone="ghost" disabled={index >= chunks.length - 1} onClick={() => speakFrom(index + 1)}>
               Skip
            </Btn>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-[13px] text-[var(--foreground-muted)]">
              <span> Page {current?.page ?? 1} of {pages}</span>
              <span>Passage {index + 1} of {chunks.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--background-deep)]">
              <div className="h-full rounded-full bg-[var(--brand)] transition-[width]" style={{ width: `${((index + 1) / chunks.length) * 100}%` }} />
            </div>
            <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--background-deep)] p-4 text-[16px] leading-[1.65]">
              {current?.text}
            </p>
          </div>
        </>
      ) : null}
    </Panel>
  );
}
