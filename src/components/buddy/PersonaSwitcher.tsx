"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/productAnalytics";
import { PERSONAS, setPersona, usePersona } from "@/lib/personas";

/** Top right of the homepage: "I am a founder ▾". Changes the page to speak to that person. */
export function PersonaSwitcher() {
  const persona = usePersona();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="fixed right-4 top-4 z-50 md:right-6 md:top-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/80 py-2 pl-3.5 pr-2.5 text-[14px] shadow-[0_4px_16px_rgba(28,25,23,0.08)] backdrop-blur-xl transition-colors hover:bg-white"
      >
        <span className="text-[var(--foreground-muted)]">I am</span>
        <span className="font-semibold text-[var(--foreground)]">{persona.id === "everyone" ? "…" : persona.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-[var(--foreground-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl border border-black/[0.06] bg-white/95 p-1.5 shadow-[0_18px_40px_rgba(28,25,23,0.14)] backdrop-blur-xl"
            role="listbox"
          >
            {PERSONAS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p.id === persona.id}
                  onClick={() => {
                    setPersona(p.id);
                    setOpen(false);
                    track("persona_selected", { persona: p.id });
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-[14px] hover:bg-black/[0.04] ${
                    p.id === persona.id ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground-muted)]"
                  }`}
                >
                  {p.id === "everyone" ? "Anyone" : `I am ${p.label}`}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
