"use client";

/**
 * Hero clip config — swap `src` / `poster` when CDN videos land.
 * Shell uses posters + chrome only until `src` is set.
 */
export type HeroClip = {
  id: string;
  /** Filename label under the window (HeyClicky-style) */
  label: string;
  /** Optional future video URL (CDN / Blob). Empty = poster shell only. */
  src?: string;
  /** Poster image path under /public, or null for illustrated poster */
  poster?: string;
  /** Short caption shown on illustrated posters */
  caption: string;
  /** App icon for illustrated poster */
  icon: string;
  aspect: "landscape" | "portrait" | "wide";
  /** Desktop absolute placement (percent of hero stage) */
  desktop: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    width: string;
    rotate?: string;
  };
  /** Role: floating hover clips vs main showreel */
  role: "float" | "main";
};

export function getHeroShowreelSrc(): string {
  return (
    process.env.NEXT_PUBLIC_HERO_SHOWREEL_URL?.trim() ||
    (process.env.NODE_ENV === "development"
      ? "/videos/lazur-demo-video.mp4"
      : "https://releases.lazur.app/videos/lazur-demo-video.mp4")
  );
}

export const HERO_CLIPS: HeroClip[] = [
  {
    id: "hold-speak",
    label: "hold-speak.mov",
    caption: "Hold a key. Speak naturally.",
    icon: "/cursor-ai-48.png",
    aspect: "landscape",
    role: "float",
    desktop: {
      top: "7%",
      left: "3%",
      width: "min(185px, 15vw)",
      rotate: "-3deg",
    },
  },
  {
    id: "smart-rewrite",
    label: "smart-rewrite.mov",
    caption: "Messy speech → finished writing",
    icon: "/slack-new-50.png",
    aspect: "landscape",
    role: "float",
    desktop: {
      top: "5%",
      right: "3%",
      width: "min(190px, 15.5vw)",
      rotate: "2.5deg",
    },
  },
  {
    id: "command-mode",
    label: "command-mode.mov",
    caption: "Speak to edit, not just write",
    icon: "/notion.png",
    aspect: "portrait",
    role: "float",
    desktop: {
      top: "32%",
      left: "3%",
      width: "min(125px, 11vw)",
      rotate: "-2deg",
    },
  },
  {
    id: "any-app",
    label: "any-app.mov",
    caption: "Lands in the app you're in",
    icon: "/gmail-50.png",
    aspect: "landscape",
    role: "float",
    desktop: {
      top: "30%",
      right: "3%",
      width: "min(160px, 13.5vw)",
      rotate: "3deg",
    },
  },
  {
    id: "showreel",
    label: "lazur-demo-video.mp4",
    caption: "Work by voice on Mac",
    icon: "/logo.png",
    aspect: "wide",
    role: "main",
    src: getHeroShowreelSrc(),
    desktop: {
      width: "min(920px, 94%)",
    },
  },
];
