"use client";

import dynamic from "next/dynamic";

const loading = () => <div className="aspect-[4/5] w-full animate-pulse rounded-[28px] bg-white/5 sm:aspect-[16/10]" />;

/** Each game is its own chunk, loaded only on its page. */
const PLAYERS: Record<string, React.ComponentType> = {
  "notch-catcher": dynamic(() => import("./NotchCatcher").then((m) => m.NotchCatcher), { ssr: false, loading }),
  "one-breath": dynamic(() => import("./OneBreath").then((m) => m.OneBreath), { ssr: false, loading }),
  "guess-the-shortcut": dynamic(() => import("./GuessTheShortcut").then((m) => m.GuessTheShortcut), { ssr: false, loading }),
  "typo-hunt": dynamic(() => import("./TypoHunt").then((m) => m.TypoHunt), { ssr: false, loading }),
  "desk-tetris": dynamic(() => import("./DeskTetris").then((m) => m.DeskTetris), { ssr: false, loading }),
};

export function GamePlayer({ slug }: { slug: string }) {
  const P = PLAYERS[slug];
  return P ? <P /> : null;
}
