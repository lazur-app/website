import localFont from "next/font/local";

// Self-hosted (see src/fonts/google/README.md).

/** The wide, bold face of the /lab/5 headline, and of the liquid-metal "lazur". Variable, so every weight is in one file. */
export const unbounded = localFont({
  src: [{ path: "../../../fonts/google/unbounded/unbounded-variable.woff2", weight: "200 900", style: "normal" }],
  variable: "--font-unbounded",
  display: "swap",
});

/** The thin italic serif "AI companion" is set in, against the wide face. */
export const instrumentSerif = localFont({
  src: [{ path: "../../../fonts/google/instrument-serif/instrument-serif-italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-instrument",
  display: "swap",
});
