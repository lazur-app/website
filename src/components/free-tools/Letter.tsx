"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";
import { useIsWindowsVisitor } from "@/hooks/useIsWindowsVisitor";
import { track } from "@/lib/productAnalytics";
import { SITE_URL } from "@/lib/seo/constants";

/**
 * The note from the founders that opens the first time someone copies a result. It confirms the
 * copy at the top, says one short human thing, and points to Lazur: Mac visitors get the download,
 * Windows visitors the waitlist (that build isn't out yet). It is built to fit one screen with no
 * scrolling. It opens every time something is copied or saved, and once per visit when a tool with
 * nothing to copy does its job (see useLazurMoment).
 */

/** `text` is what was copied, so the note can say what the visitor just did. */
type Nudge = (copied?: boolean, text?: string) => void;

/**
 * A moment the tool just worked, for tools with nothing to copy (a mic that picked up sound, a
 * finished test, a downloaded recording). `label` is the line at the top of the note, in the
 * visitor's own result when we have one ("9.2 clicks a second"). Moments open the note once per
 * page visit unless `every` is set (downloads, like copies, open it every time). `delay` lets the
 * visitor see their result before the note covers it.
 */
export type Moment = { label: string; every?: boolean; delay?: number; words?: number };
type MomentFn = (m: Moment) => void;

const Ctx = createContext<{ nudge: Nudge; moment: MomentFn }>({ nudge: () => {}, moment: () => {} });

/** Call after a visitor copies a result, with whether the copy worked. */
export const useLazurNudge = () => useContext(Ctx).nudge;

/** Set while one of our Copy buttons is copying, so the hand-copy listener doesn't open the note twice. */
export const copyGuard = { on: false };

/** Call when a tool with nothing to copy just did its job. */
export const useLazurMoment = () => useContext(Ctx).moment;

/** Opens the note once `when` has stayed true for `after` ms (a mic heard for a few seconds, a camera live for a while). */
export function useMomentWhen(when: boolean, label: string, after = 2500) {
  const moment = useLazurMoment();
  useEffect(() => {
    if (!when) return;
    const t = setTimeout(() => moment({ label, delay: 0 }), after);
    return () => clearTimeout(t);
  }, [when, label, after, moment]);
}

type Open = { ok: boolean; status: string; words: number };

export function LazurLetterProvider({ tool, name, children }: { tool: string; name: string; children: ReactNode }) {
  const [open, setOpen] = useState<Open | null>(null);
  const openRef = useRef(false);
  const usedMoment = useRef(false);
  useEffect(() => {
    openRef.current = !!open;
  }, [open]);

  // Every copy opens the note, on purpose: it is the moment the visitor just got value.
  const nudge = useCallback<Nudge>(
    (copied = true, text = "") => {
      const words = (text.match(/\S+/g) ?? []).length;
      // A copy counts as this visit's moment, so the read-only fallback doesn't open it a second time.
      usedMoment.current = true;
      setOpen({ ok: copied, status: copied ? "your text is copied" : "couldn't copy automatically. select the text and press ctrl+c", words });
      track("tool_result_copied", { tool, copied, words });
      track("letter_shown", { tool, trigger: "copy" });
    },
    [tool],
  );

  const moment = useCallback<MomentFn>(
    ({ label, every = false, delay = 1400, words = 0 }) => {
      if (!every && usedMoment.current) return;
      usedMoment.current = true;
      setTimeout(() => {
        if (openRef.current) return;
        setOpen({ ok: true, status: label, words });
        track("letter_shown", { tool, trigger: every ? "save" : "moment", label });
      }, delay);
    },
    [tool],
  );

  // Copying by hand (select, then ctrl+c, the right-click menu, or a long press on a phone) opens
  // the note too. Copies made by our own Copy buttons are skipped here: they call nudge themselves.
  useEffect(() => {
    const onCopy = () => {
      if (copyGuard.on) return;
      const el = document.activeElement;
      let text = window.getSelection()?.toString() ?? "";
      if (!text && (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) && el.selectionStart !== null && el.selectionEnd !== null)
        text = el.value.slice(el.selectionStart, el.selectionEnd);
      if (!text.trim()) return;
      track("tool_text_copied_by_hand", { tool });
      nudge(true, text);
    };
    document.addEventListener("copy", onCopy);
    return () => document.removeEventListener("copy", onCopy);
  }, [nudge, tool]);

  const value = useMemo(() => ({ nudge, moment }), [nudge, moment]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {open ? <Note tool={tool} name={name} ok={open.ok} status={open.status} words={open.words} onClose={() => setOpen(null)} /> : null}
    </Ctx.Provider>
  );
}

const FOUNDERS = [
  { src: "/veer-img.jpeg", alt: "Veer" },
  { src: "/vaidik-img.jpg", alt: "Vaidik" },
  { src: "/ayush-img.jpg", alt: "Ayush" },
];

/** Tools where the visitor's own voice became the text. */
const VOICE_TOOLS = new Set(["dictation", "voice-typing", "voice-recorder", "audio-to-text", "voice-note-to-text", "audio-to-notes", "meeting-minutes", "youtube-transcript"]);
/** Tools that wrote or rewrote text for them. */
const WRITING_TOOLS = new Set(["grammar-checker", "paraphrasing-tool", "ai-humanizer", "summarizer", "email-reply", "linkedin-message", "linkedin-post", "linkedin-headline", "text-reply", "bio-generator", "caption-generator", "cover-letter", "resignation-letter", "prompt-generator", "youtube-summarizer", "image-to-text", "handwriting-to-text", "pdf-to-text"]);

/** "about 3 minutes" / "under a minute", from words at a pace in words per minute. */
function minutes(words: number, wpm: number) {
  const m = words / wpm;
  return m < 1 ? "under a minute" : `about ${Math.round(m)} minute${Math.round(m) === 1 ? "" : "s"}`;
}

/** The first line of the note: what the visitor just did, in their own numbers when we have them. */
function opener(tool: string, name: string, words: number) {
  // 40 wpm is the commonly cited average typing speed; people speak about 130 wpm.
  if (VOICE_TOOLS.has(tool) && words >= 15)
    return `you just turned a voice into ${words} words for free. typing that takes ${minutes(words, 40)}; saying it takes ${minutes(words, 130)}.`;
  if (WRITING_TOOLS.has(tool) && words >= 5) return `you just got ${words} words ready to paste, for free. we're really glad it worked. one small thing, from the three of us.`;
  return `you just used ${name.toLowerCase()} for free, and we're really glad it worked. one small thing, from the three of us.`;
}

function Note({ tool, name, ok, status, words, onClose }: { tool: string; name: string; ok: boolean; status: string; words: number; onClose: () => void }) {
  const windows = useIsWindowsVisitor();
  const closeRef = useRef<HTMLButtonElement>(null);
  const href = `${SITE_URL}/download?src=tool-${tool}-letter`;

  useEffect(() => {
    // Give focus back to wherever the visitor was (a keyboard test, a text box) when the note closes.
    const before = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      // Always hand scrolling back, whatever order effects ran in.
      document.body.style.overflow = "";
      if (before && before !== document.body && document.contains(before)) before.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#1c1917]/45 backdrop-blur-[3px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex min-h-full items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <article
        role="dialog"
        aria-modal="true"
        aria-label="A note from the Lazur team"
        className="relative w-full max-w-[500px] rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-6 pb-6 pt-5 shadow-[0_3px_0_rgba(28,25,23,0.9),0_30px_60px_-20px_rgba(28,25,23,0.5)] sm:px-8 sm:pb-7"
      >
        <Sticker name="heart" size={52} rotate={12} className="pointer-events-none absolute -right-3 -top-5 hidden sm:block" />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-[#1c1917]/55 hover:bg-black/5 hover:text-[#1c1917] sm:right-3 sm:top-3"
        >
          <span aria-hidden className="text-[26px] leading-none">
            ×
          </span>
        </button>

        <p
          role="status"
          className={`mr-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold ${ok ? "bg-[#e3f6e8] text-[#17612c]" : "bg-[#fff1d6] text-[#7a4b00]"}`}
        >
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
          {status}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex -space-x-3">
            {FOUNDERS.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={f.alt} src={f.src} alt={f.alt} loading="lazy" className="h-12 w-12 rounded-full border-2 border-white object-cover ring-[1.5px] ring-[#1c1917] sm:h-14 sm:w-14" />
            ))}
          </div>
          <p className="font-[family-name:var(--font-caveat)] text-[22px] font-bold leading-none text-[#1c1917] sm:text-[24px]">veer, vaidik &amp; ayush</p>
        </div>

        <h2 className="mt-4 text-[23px] font-bold leading-[1.08] tracking-[-0.03em] text-[#1c1917] sm:text-[30px]">hey, thanks for stopping by.</h2>
        <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[#3d3834]">{opener(tool, name, words)}</p>
        <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[#3d3834]">
          isn&apos;t it a pain to go hunting the web for a tool every time you need something done? lazur lives on your desktop. hold two keys, say what you want, and it&apos;s done, right in the app you&apos;re already in. no tabs, no searching.
        </p>
        {windows ? <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[#3d3834]">lazur for windows is still being built. join the waitlist and we&apos;ll write to you the day it&apos;s ready.</p> : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={() => track("letter_cta_clicked", { tool, platform: windows ? "windows" : "mac" })}
            className="relative inline-flex min-h-[44px] items-center text-[19px] font-bold tracking-[-0.02em] text-[#1c1917]"
          >
            <span className="relative inline-block">
              {windows ? "join the windows waitlist" : "download lazur"}
              <HandUnderline show color="#e11d48" delay={0.25} duration={0.7} offset={3} />
            </span>
          </a>
          <button type="button" onClick={onClose} className="min-h-[44px] px-1 text-[14px] text-[#1c1917]/55 underline underline-offset-4 hover:text-[#1c1917]">
            maybe later
          </button>
        </div>
      </article>
      </div>
    </div>
  );
}
