import { Big_Shoulders, Fraunces } from "next/font/google";

/**
 * Big Shoulders Display (Google now ships it as "Big Shoulders", with an optical size axis): tall
 * condensed caps. Used only by the /lab/2 hero, for the words the flock lands as (drawn on the canvas).
 */
export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-shoulders",
  display: "swap",
});

/**
 * Fraunces, the variable cut with its soft and wonky axes: the /lab/2 headline. Used through the
 * `--font-fraunces` variable; the softness and the wonk are switched on in flock.module.css.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
