import localFont from "next/font/local";

// Self-hosted (see src/fonts/google/README.md).

/**
 * Big Shoulders Display (Google now ships it as "Big Shoulders", with an optical size axis): tall
 * condensed caps. Used only by the /lab/2 hero, for the words the flock lands as (drawn on the canvas).
 */
export const bigShoulders = localFont({
  src: [{ path: "../../../fonts/google/big-shoulders/big-shoulders-variable.woff2", weight: "700 900", style: "normal" }],
  variable: "--font-shoulders",
  display: "swap",
});

/**
 * Fraunces, the variable cut with its soft and wonky axes: the /lab/2 headline. Used through the
 * `--font-fraunces` variable; the softness and the wonk are switched on in flock.module.css.
 */
export const fraunces = localFont({
  src: [{ path: "../../../fonts/google/fraunces/fraunces-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-fraunces",
  display: "swap",
});
