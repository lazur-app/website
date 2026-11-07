/** The arcade at /games. Each game is a client component in src/components/games/. */
export type GameInfo = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Card and stage accent. */
  color: string;
  /** Second gradient stop for the card. */
  color2: string;
  emoji: string;
  controls: string[];
};

export const GAMES: GameInfo[] = [
  {
    slug: "notch-catcher",
    name: "Notch Catcher",
    tagline: "Catch the good stuff. Dodge the bugs.",
    description: "Slide the notch, catch coffee, mail and ideas, dodge the bugs. Combos speed things up. How long can you last?",
    color: "#2563eb",
    color2: "#7c3aed",
    emoji: "☕",
    controls: ["Move: mouse, finger, or ← →", "Catch ☕ 📧 💡 ⭐ for points", "Dodge 🐛 and 🔥", "✦ sparkle pulls everything to you"],
  },
  {
    slug: "one-breath",
    name: "One Breath",
    tagline: "Say the tongue twister before time runs out.",
    description: "Read each tongue twister out loud before the timer ends. Every word you nail lights up. Five rounds, each one meaner.",
    color: "#e11d48",
    color2: "#f97316",
    emoji: "🎤",
    controls: ["Press the mic and read out loud", "Words light up as you say them", "Faster and more accurate = more points", "No mic? Play by typing instead"],
  },
  {
    slug: "guess-the-shortcut",
    name: "Guess the Shortcut",
    tagline: "What does ⌘⇧4 do? You have 6 seconds.",
    description: "A Mac keyboard shortcut lights up. Pick what it does before the bar runs out. Build a streak, lose three lives and it's over.",
    color: "#0f766e",
    color2: "#22c55e",
    emoji: "⌘",
    controls: ["Pick the answer, or press 1–4", "Answer fast for a time bonus", "Streaks multiply your score", "3 wrong answers and you're out"],
  },
  {
    slug: "typo-hunt",
    name: "Typo Hunt",
    tagline: "Five typos are hiding. Find them fast.",
    description: "Each paragraph hides five typos. Tap them before the clock runs out. Wrong taps cost you time.",
    color: "#9333ea",
    color2: "#ec4899",
    emoji: "🔍",
    controls: ["Tap a word you think is wrong", "Each typo found adds time", "Wrong taps cost 3 seconds", "Clear the page to move on"],
  },
  {
    slug: "desk-tetris",
    name: "Desk Tetris",
    tagline: "Stack the desk. Clear the clutter.",
    description: "Laptops, mugs, plants and sticky notes fall onto your desk. Fill a row to clear it. Speeds up every 10 rows.",
    color: "#ea580c",
    color2: "#eab308",
    emoji: "🧱",
    controls: ["← → move, ↑ rotate, ↓ drop faster", "Space drops it all the way", "Phone: use the buttons below", "Clear rows to score"],
  },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
