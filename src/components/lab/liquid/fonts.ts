import { Instrument_Serif, Unbounded } from "next/font/google";

/** The wide, bold face of the /lab/5 headline, and of the liquid-metal "lazur". Variable, so every weight is in one file. */
export const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

/** The thin italic serif "AI companion" is set in, against the wide face. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});
