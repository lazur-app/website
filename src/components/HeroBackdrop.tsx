"use client";

import { motion } from "framer-motion";

/** Ghost fragments — speech on the left, polished on the right. Kept sparse so the hero stays readable. */
const rawFragments = [
  { text: "um…", top: "18%", left: "4%", rotate: -8 },
  { text: "like,", top: "32%", left: "8%", rotate: 4 },
  { text: "so basically", top: "48%", left: "2%", rotate: -5 },
  { text: "kinda", top: "62%", left: "10%", rotate: 7 },
  { text: "you know?", top: "76%", left: "5%", rotate: -3 },
];

const polishedFragments = [
  { text: "Please review.", top: "22%", right: "5%", rotate: 2 },
  { text: "Tuesday works.", top: "38%", right: "8%", rotate: -3 },
  { text: "Thank you.", top: "54%", right: "4%", rotate: 1 },
  { text: "By EOD.", top: "70%", right: "9%", rotate: -2 },
];

export function HeroBackdrop() {
  return (
    <div
      className="hero-backdrop pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
      aria-hidden
    >
      {/* Loose sketch arrow — voice → polish */}
      <svg
        className="hero-backdrop-arrow absolute left-[12%] top-[28%] h-[38%] w-[76%] text-[var(--brand)]"
        viewBox="0 0 800 320"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M40 200 C180 80, 320 240, 480 120 S700 60, 760 100"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="6 10"
          opacity="0.12"
        />
        <path
          d="M748 92 L768 98 L752 112"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.14"
        />
      </svg>

      {/* Raw speech — scribbly, faded */}
      {rawFragments.map((f, i) => (
        <motion.span
          key={f.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.06, duration: 0.8 }}
          className="hero-backdrop-raw absolute max-w-[9rem] text-[13px] leading-snug tracking-tight"
          style={{
            top: f.top,
            left: f.left,
            transform: `rotate(${f.rotate}deg)`,
          }}
        >
          {f.text}
        </motion.span>
      ))}

      {/* Polished — cleaner, slightly sharper */}
      {polishedFragments.map((f, i) => (
        <motion.span
          key={f.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 + i * 0.06, duration: 0.8 }}
          className="hero-backdrop-polished absolute max-w-[10rem] text-[12px] font-medium leading-snug"
          style={{
            top: f.top,
            right: f.right,
            transform: `rotate(${f.rotate}deg)`,
          }}
        >
          <span className="mr-1 inline-block text-[var(--brand)] opacity-40">
            ✓
          </span>
          {f.text}
        </motion.span>
      ))}

      {/* Tiny graffiti marks — crossed filler, wave doodle */}
      <svg
        className="absolute left-[14%] top-[30%] h-8 w-10 text-[var(--brand)] opacity-[0.14]"
        viewBox="0 0 40 32"
        fill="none"
      >
        <ellipse
          cx="20"
          cy="16"
          rx="14"
          ry="9"
          stroke="currentColor"
          strokeWidth="1.2"
          transform="rotate(-12 20 16)"
        />
      </svg>
      <svg
        className="absolute right-[16%] top-[58%] h-6 w-14 text-[var(--foreground)] opacity-[0.08]"
        viewBox="0 0 56 24"
        fill="none"
      >
        <path
          d="M2 14 Q14 4, 28 12 T54 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
