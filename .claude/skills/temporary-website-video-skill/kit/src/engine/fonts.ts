import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { continueRender, delayRender, staticFile } from "remotion";

// Same families as servicerobotco.com: Clash Display headlines, Open Sauce One body, EB Garamond italic accent.
export const FONT_DISPLAY = "Clash Display";
export const FONT_BODY = "Open Sauce One";
export const FONT_SERIF = loadGaramond("italic", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

const faces: [string, string, string][] = [
  [FONT_DISPLAY, "fonts/ClashDisplay-Medium.woff2", "500"],
  [FONT_DISPLAY, "fonts/ClashDisplay-Semibold.woff2", "600"],
  [FONT_BODY, "fonts/OpenSauceOne-Regular.ttf", "400"],
  [FONT_BODY, "fonts/OpenSauceOne-Medium.ttf", "500"],
  [FONT_BODY, "fonts/OpenSauceOne-SemiBold.ttf", "600"],
  [FONT_BODY, "fonts/OpenSauceOne-Bold.ttf", "700"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("local fonts");
  Promise.all(
    faces.map(([family, file, weight]) =>
      new FontFace(family, `url(${staticFile(file)})`, { weight }).load().then((f) => document.fonts.add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}
