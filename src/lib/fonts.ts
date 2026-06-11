import localFont from "next/font/local";

/** Body/UI — SIL Open Font License 1.1 (see src/fonts/open-sauce-one/OFL.txt) */
export const openSauceOne = localFont({
  src: [
    {
      path: "../fonts/open-sauce-one/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/open-sauce-one/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/open-sauce-one/OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/open-sauce-one/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce",
  display: "swap",
});

/** Headlines — ITF Free Font License (see src/fonts/clash-display/LICENSE.txt) */
export const clashDisplay = localFont({
  src: [
    {
      path: "../fonts/clash-display/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/clash-display/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});
