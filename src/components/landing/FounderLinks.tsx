"use client";

import { useEffect, useRef, useState } from "react";
import { FounderSticker, type Pose, type Who } from "./FounderSticker";

const LINKS: Record<Who, { name: string; links: { label: string; href: string }[] }> = {
  vaidik: {
    name: "vaidik",
    links: [
      { label: "portfolio", href: "https://vaidik.tech" },
      { label: "linkedin", href: "https://linkedin.com/in/vaidiksule" },
      { label: "github", href: "https://github.com/vaidiksule" },
    ],
  },
  veer: {
    name: "veer",
    links: [
      { label: "portfolio", href: "https://veeradyani.tech" },
      { label: "linkedin", href: "https://www.linkedin.com/in/veer-adyani/" },
      { label: "github", href: "https://github.com/veeradyani222" },
    ],
  },
  ayush: {
    name: "ayush",
    links: [
      { label: "portfolio", href: "https://interactiveportfolio-three.vercel.app/" },
      { label: "linkedin", href: "https://www.linkedin.com/in/ayush-agrawal-869940290/" },
      { label: "github", href: "https://github.com/Ayuussshhh" },
    ],
  },
};

/**
 * A founder sticker you can click: a little thought cloud pops up over their head with their
 * portfolio, LinkedIn and GitHub. `className` places the whole thing (the sticker sits inside).
 */
export function FounderLinks({ who, pose, size, className = "", cloudClassName = "" }: { who: Who; pose: Pose; size: number | string; className?: string; cloudClassName?: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const person = LINKS[who];

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={box} className={`pointer-events-auto ${open ? "z-30" : "z-10"} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${person.name}'s links`}
        className="block cursor-pointer rounded-2xl outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#6B4BFC]"
      >
        <FounderSticker who={who} pose={pose} size={size} />
      </button>

      {/* The thought cloud: a soft bubble over the head, with two little puffs trailing down to it. */}
      <div
        className={`absolute bottom-[98%] left-1/2 w-max origin-bottom -translate-x-1/2 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
        } ${cloudClassName}`}
        role="dialog"
        aria-label={`${person.name}'s links`}
      >
        <div className="relative px-11 pb-8 pt-11">
          {/* the cloud outline, stretched to fit the links; the stroke keeps its width */}
          <svg viewBox="0 0 200 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_2px_0_rgba(28,25,23,0.9)]" aria-hidden>
            <path
              d="M44 106 C18 106 12 76 34 68 C28 40 62 26 84 38 C100 16 140 18 150 40 C174 34 194 54 184 76 C198 90 186 108 164 106 Z"
              fill="#fff"
              stroke="#1c1917"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="relative">
            <ul className="flex flex-col gap-0.5">
              {person.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-medium text-[#1c1917] underline decoration-black/25 underline-offset-4 transition-colors hover:text-[#6B4BFC] hover:decoration-[#6B4BFC]"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <span className="absolute -bottom-3 left-[46%] h-4 w-4 rounded-full border-[1.5px] border-[#1c1917] bg-white" aria-hidden />
          <span className="absolute -bottom-7 left-[52%] h-2.5 w-2.5 rounded-full border-[1.5px] border-[#1c1917] bg-white" aria-hidden />
        </div>
      </div>
    </div>
  );
}
