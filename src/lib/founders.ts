import type { Who } from "@/components/landing/FounderSticker";

/** Each founder's portfolio, LinkedIn and GitHub (used by the footer stickers and the team page). */
export const FOUNDER_LINKS: Record<Who, { name: string; links: { label: string; href: string }[] }> = {
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
