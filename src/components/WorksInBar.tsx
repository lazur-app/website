import Image from "next/image";

const apps = [
  { name: "Gmail", icon: "/gmail-50.png" },
  { name: "Slack", icon: "/slack-new-50.png" },
  { name: "Notion", icon: "/notion.png" },
  { name: "Cursor", icon: "/cursor-ai-48.png" },
  { name: "VS Code", icon: "/vs-code-50.png" },
  { name: "Discord", icon: "/discord.png" },
  { name: "X", icon: "/x-50.png" },
  { name: "Scrivener", icon: "/scrivener-48.png" },
];

/** Four identical groups — each group width matches 25% of track for seamless loop */
const MARQUEE_COPIES = 4;

function AppIcon({ name, icon }: { name: string; icon: string }) {
  return (
    <span className="inline-flex shrink-0 items-center px-1">
      <Image
        src={icon}
        alt={name}
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain opacity-70"
      />
    </span>
  );
}

function AppGroup({ copyIndex }: { copyIndex: number }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 pr-8"
      aria-hidden={copyIndex > 0 ? true : undefined}
    >
      {apps.map((app) => (
        <AppIcon key={`${copyIndex}-${app.name}`} name={app.name} icon={app.icon} />
      ))}
    </div>
  );
}

export function WorksInBar() {
  return (
    <div className="relative mt-14 w-full md:mt-16">
      <p className="mb-4 text-center text-[var(--text-xs)] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
        Works in the apps you already use
      </p>
      <div className="app-marquee-mask relative w-full overflow-hidden py-1">
        <div className="animate-app-marquee flex w-max items-center">
          {Array.from({ length: MARQUEE_COPIES }, (_, i) => (
            <AppGroup key={i} copyIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
