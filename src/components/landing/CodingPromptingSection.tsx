"use client";

import { motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const SPOKEN =
  "can you uh refactor the auth handler to use zustand instead of react context and add proper error handling for failed logins";

const PASTED =
  "Refactor the auth handler to use Zustand instead of React Context. Add error handling for failed login attempts with user-facing messages.";

export function CodingPromptingSection() {
  return (
    <LandingBand id="coding" variant="dark" className="py-20 md:py-28">
      <LandingBandInner>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
              For builders
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--background)] md:text-[2.75rem]">
              Prompts you actually
              <br />
              meant to write.
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/55">
              Rambling speech becomes a precise prompt, pasted at your cursor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.45 }}
            className="max-w-lg space-y-8 text-left"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                You speak
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/45">
                &ldquo;{SPOKEN}&rdquo;
              </p>
            </div>
            <div className="border-t border-white/10 pt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                Lazur pastes
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/90">
                {PASTED}
              </p>
            </div>
          </motion.div>
        </div>
      </LandingBandInner>
    </LandingBand>
  );
}
