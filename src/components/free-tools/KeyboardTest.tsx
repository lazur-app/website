"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useMomentWhen } from "./Letter";
import { Btn, Panel, Stat } from "./ui";

type Key = { code: string; label: string; w?: number };

const k = (code: string, label?: string, w = 1): Key => ({ code, label: label ?? code.replace(/^Key|^Digit/, ""), w });

const ROWS: Key[][] = [
  [k("Escape", "Esc", 1.4), ...Array.from({ length: 12 }, (_, i) => k(`F${i + 1}`))],
  [
    k("Backquote", "`"), ...Array.from({ length: 9 }, (_, i) => k(`Digit${i + 1}`)), k("Digit0"), k("Minus", "-"), k("Equal", "="), k("Backspace", "⌫", 2),
  ],
  [k("Tab", "Tab", 1.5), ..."QWERTYUIOP".split("").map((c) => k(`Key${c}`)), k("BracketLeft", "["), k("BracketRight", "]"), k("Backslash", "\\", 1.5)],
  [k("CapsLock", "Caps", 1.8), ..."ASDFGHJKL".split("").map((c) => k(`Key${c}`)), k("Semicolon", ";"), k("Quote", "'"), k("Enter", "Enter", 2.2)],
  [k("ShiftLeft", "Shift", 2.3), ..."ZXCVBNM".split("").map((c) => k(`Key${c}`)), k("Comma", ","), k("Period", "."), k("Slash", "/"), k("ShiftRight", "Shift", 2.7)],
  [k("ControlLeft", "Ctrl", 1.4), k("MetaLeft", "⌘", 1.4), k("AltLeft", "Alt", 1.4), k("Space", "Space", 6.4), k("AltRight", "Alt", 1.4), k("MetaRight", "⌘", 1.4), k("ControlRight", "Ctrl", 1.4)],
];

/** A Mac's bottom row: control, option, command, with command and option again on the right. */
const MAC_BOTTOM: Key[] = [k("ControlLeft", "control", 1.5), k("AltLeft", "option", 1.5), k("MetaLeft", "⌘ cmd", 1.8), k("Space", "Space", 6.2), k("MetaRight", "⌘ cmd", 1.8), k("AltRight", "option", 1.5)];
/** What a Mac keyboard prints on the keys that differ. */
const MAC_LABELS: Record<string, string> = { Backspace: "delete", Enter: "return", CapsLock: "caps", Escape: "esc", Tab: "tab", ShiftLeft: "shift", ShiftRight: "shift" };
const MAC_ROWS: Key[][] = [...ROWS.slice(0, 5), MAC_BOTTOM];

const ARROWS: Key[] = [k("ArrowUp", "↑"), k("ArrowLeft", "←"), k("ArrowDown", "↓"), k("ArrowRight", "→")];

const NUMPAD: Key[][] = [
  [k("NumLock", "Num"), k("NumpadDivide", "/"), k("NumpadMultiply", "*"), k("NumpadSubtract", "-")],
  [k("Numpad7", "7"), k("Numpad8", "8"), k("Numpad9", "9"), k("NumpadAdd", "+")],
  [k("Numpad4", "4"), k("Numpad5", "5"), k("Numpad6", "6")],
  [k("Numpad1", "1"), k("Numpad2", "2"), k("Numpad3", "3"), k("NumpadEnter", "⏎")],
  [k("Numpad0", "0", 2), k("NumpadDecimal", ".")],
];

const codesFor = (rows: Key[][]) => [...rows.flat(), ...ARROWS].map((x) => x.code);

const isMac = () => {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return /mac/i.test(nav.userAgentData?.platform || navigator.platform || navigator.userAgent);
};

type Last = { key: string; code: string; keyCode: number };

/** Keyboard tester: press keys and watch them light up on an on-screen layout. Nothing is sent anywhere. */
export function KeyboardTest(props: { page?: string }) {
  void props;
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [down, setDown] = useState<Set<string>>(new Set());
  const [last, setLast] = useState<Last | null>(null);
  const [capture, setCapture] = useState(true);
  const [touch, setTouch] = useState(false);
  const [mac, setMac] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef(capture);
  // Keep the latest values where the key listener (below) can read them.
  useEffect(() => {
    captureRef.current = capture;
  });

  // Listen on the whole page from the start: people land and type without clicking anything first.
  // Keys are skipped only while they type in a real field or a popup (the founders' note) is open.
  useEffect(() => {
    const busy = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (document.querySelector('[aria-modal="true"]')) return true;
      return !!t && t !== areaRef.current && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    };
    // Block scrolling and shortcuts only when the visitor isn't focused on something else on the page.
    const block = () => {
      const a = document.activeElement;
      return captureRef.current && (!a || a === document.body || a === areaRef.current);
    };
    const onDown = (e: KeyboardEvent) => {
      if (busy(e)) return;
      if (block()) e.preventDefault();
      setLast({ key: e.key === " " ? "(space)" : e.key, code: e.code, keyCode: e.keyCode });
      setTested((s) => (s.has(e.code) ? s : new Set(s).add(e.code)));
      setDown((s) => new Set(s).add(e.code));
      // Caps Lock only reports "up" when it is switched off again, so light it briefly instead.
      if (e.code === "CapsLock") setTimeout(() => setDown((s) => (s.has("CapsLock") ? new Set([...s].filter((c) => c !== "CapsLock")) : s)), 180);
    };
    const onUp = (e: KeyboardEvent) => {
      if (busy(e)) return;
      if (block()) e.preventDefault();
      // On a Mac, keys pressed while ⌘ is held never report "up", so letting go of ⌘ clears them all.
      if (e.key === "Meta") return setDown(new Set());
      setDown((s) => {
        const n = new Set(s);
        n.delete(e.code);
        return n;
      });
    };
    const onBlur = () => setDown(new Set());
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMac(isMac());
    // Phones and tablets without a keyboard can't send key presses to a page.
    setTouch(window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(any-pointer: fine)").matches);
  }, []);

  const rows = mac ? MAC_ROWS : ROWS;
  const allCodes = useMemo(() => codesFor(mac ? MAC_ROWS : ROWS), [mac]);
  const testedCount = useMemo(() => allCodes.filter((c) => tested.has(c)).length, [allCodes, tested]);

  const renderCap = (x: Key, unit = 44) => {
    const isDown = down.has(x.code);
    const isTested = tested.has(x.code);
    return (
      <div
        key={x.code}
        style={{ flexGrow: x.w, flexBasis: 0, minWidth: 0, height: unit }}
        className={`flex items-center justify-center rounded-lg border text-[11px] font-semibold transition sm:text-[13px] ${
          isDown
            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
            : isTested
              ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-ink)]"
              : "border-[var(--border-strong)] bg-white text-[var(--foreground-muted)]"
        }`}
      >
        {mac ? (MAC_LABELS[x.code] ?? x.label) : x.label}
      </div>
    );
  };

  useMomentWhen(testedCount >= 15, "your keyboard is registering keys", 1500);
  return (
    <Panel className="max-w-[1000px] space-y-5">
      <div
        ref={areaRef}
        tabIndex={0}
        className="space-y-4 rounded-2xl border-2 border-[var(--brand)] bg-[var(--background-deep)] p-3 outline-none transition sm:p-4"
      >
        <p className="text-center text-[15px] font-medium">Listening. Press any key on your keyboard.</p>
        {touch ? (
          <p className="text-center text-[14px] text-[var(--foreground-muted)]">This test needs a real keyboard. Plug one into your phone or tablet, or open this page on a computer.</p>
        ) : null}

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Key" value={last?.key ?? "–"} />
          <Stat label="Code" value={<span className="text-[18px]">{last?.code ?? "–"}</span>} />
          <Stat label="keyCode" value={last?.keyCode ?? "–"} />
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-[560px] flex-col gap-1.5 sm:min-w-0 sm:flex-row sm:gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              {rows.map((row, i) => (
                <div key={i} className={`flex gap-1.5 ${i === 0 ? "mb-1" : ""}`}>
                  {row.map((x) => (
                    <Fragment key={x.code}>{renderCap(x)}</Fragment>
                  ))}
                </div>
              ))}
            </div>
            <div className="hidden flex-col justify-end gap-1.5 sm:flex sm:w-[140px]">
              <div className="flex justify-center">
                <div className="w-1/3">
                  {renderCap(ARROWS[0])}
                </div>
              </div>
              <div className="flex gap-1.5">
                {ARROWS.slice(1).map((x) => (
                  <Fragment key={x.code}>{renderCap(x)}</Fragment>
                ))}
              </div>
            </div>
            <div className="hidden flex-col gap-1.5 sm:flex sm:w-[190px]">
              {NUMPAD.map((row, i) => (
                <div key={i} className="flex gap-1.5">
                  {row.map((x) => (
                    <Fragment key={x.code}>{renderCap(x)}</Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-[15px] font-semibold text-[var(--brand-ink)]">
          {testedCount} / {allCodes.length} keys tested
        </div>
        <Btn
          tone="ghost"
          onClick={() => {
            setTested(new Set());
            setDown(new Set());
            setLast(null);
            areaRef.current?.focus();
          }}
        >
           Reset
        </Btn>
        <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[var(--foreground-muted)]">
          <input type="checkbox" checked={capture} onChange={(e) => setCapture(e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
          Block page scrolling and shortcuts while testing
        </label>
      </div>
      <p className="text-[13px] text-[var(--foreground-faint)]">
        {mac
          ? "On a Mac, F1 to F12 control brightness and volume, so hold fn while you press them. The fn key itself, and media keys, are handled by macOS and can't be seen by a web page."
          : "Some keys (like the Windows key, volume keys or Fn) are handled by your system and can't be seen by a web page."}
      </p>
    </Panel>
  );
}
