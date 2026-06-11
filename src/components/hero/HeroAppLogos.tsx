import Image from "next/image";

const APPS = [
  { name: "Gmail", icon: "/gmail-50.png" },
  { name: "Slack", icon: "/slack-new-50.png" },
  { name: "Notion", icon: "/notion.png" },
  { name: "Cursor", icon: "/cursor-ai-48.png" },
  { name: "VS Code", icon: "/vs-code-50.png" },
  // { name: "Discord", icon: "/discord.png" },
  { name: "X", icon: "/x-50.png" },
  // { name: "Scrivener", icon: "/scrivener-48.png" },
];

type HeroAppLogosProps = {
  className?: string;
};

/** Icon-only app row for hero — no heading text. */
export function HeroAppLogos({ className = "" }: HeroAppLogosProps) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-3.5 md:gap-4 ${className}`}
    >
      {APPS.map((app) => (
        <li key={app.name}>
          <Image
            src={app.icon}
            alt={app.name}
            width={18}
            height={18}
            className="h-[18px] w-[18px] object-contain opacity-40 grayscale transition-opacity hover:opacity-60"
          />
        </li>
      ))}
    </ul>
  );
}
