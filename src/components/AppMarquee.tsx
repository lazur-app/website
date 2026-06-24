import Image from "next/image";

export const MARQUEE_APPS = [
  { name: "Gmail", icon: "/gmail-50.png" },
  { name: "Slack", icon: "/slack-new-50.png" },
  { name: "Notion", icon: "/notion.png" },
  { name: "Cursor", icon: "/cursor-ai-48.png" },
  { name: "VS Code", icon: "/vs-code-50.png" },
  { name: "Discord", icon: "/discord.png" },
  { name: "X", icon: "/x-50.png" },
  { name: "Scrivener", icon: "/scrivener-48.png" },
] as const;

const MARQUEE_COPIES = 4;

type AppMarqueeProps = {
  className?: string;
  iconSize?: number;
  iconClassName?: string;
  groupClassName?: string;
};

function AppIcon({
  name,
  icon,
  size,
  className,
}: {
  name: string;
  icon: string;
  size: number;
  className: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-center px-1">
      <Image
        src={icon}
        alt={name}
        width={size}
        height={size}
        className={className}
      />
    </span>
  );
}

function AppGroup({
  copyIndex,
  iconSize,
  iconClassName,
  groupClassName,
}: {
  copyIndex: number;
  iconSize: number;
  iconClassName: string;
  groupClassName: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center ${groupClassName}`}
      aria-hidden={copyIndex > 0 ? true : undefined}
    >
      {MARQUEE_APPS.map((app) => (
        <AppIcon
          key={`${copyIndex}-${app.name}`}
          name={app.name}
          icon={app.icon}
          size={iconSize}
          className={iconClassName}
        />
      ))}
    </div>
  );
}

export function AppMarquee({
  className = "",
  iconSize = 24,
  iconClassName = "h-6 w-6 shrink-0 object-contain opacity-70",
  groupClassName = "gap-8 pr-8",
}: AppMarqueeProps) {
  return (
    <div
      className={`app-marquee-mask relative w-full overflow-hidden py-1 ${className}`}
    >
      <div className="animate-app-marquee flex w-max items-center">
        {Array.from({ length: MARQUEE_COPIES }, (_, i) => (
          <AppGroup
            key={i}
            copyIndex={i}
            iconSize={iconSize}
            iconClassName={iconClassName}
            groupClassName={groupClassName}
          />
        ))}
      </div>
    </div>
  );
}
