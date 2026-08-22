import {
  LandingBand,
  LandingBandBleed,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const MOSAIC = [
  { name: "Gmail", icon: "/gmail-50.png" },
  { name: "Slack", icon: "/slack-new-50.png" },
  { name: "Notion", icon: "/apps/notion-color.png" },
  { name: "Cursor", icon: "/cursor-ai-48.png" },
  { name: "VS Code", icon: "/vs-code-50.png" },
  { name: "Discord", icon: "/discord.png" },
  { name: "Linear", icon: "/apps/linear.png" },
  { name: "GitHub", icon: "/apps/github.png" },
  { name: "Figma", icon: "/apps/figma.png" },
  { name: "Chrome", icon: "/apps/chrome.png" },
  { name: "Outlook", icon: "/apps/outlook.png" },
  { name: "ChatGPT", icon: "/apps/chatgpt.png" },
  { name: "Docs", icon: "/apps/gdocs.png" },
  { name: "WhatsApp", icon: "/apps/whatsapp.png" },
  { name: "Telegram", icon: "/apps/telegram.png" },
  { name: "LinkedIn", icon: "/apps/linkedin.png" },
  { name: "X", icon: "/x-50.png" },
  { name: "Obsidian", icon: "/apps/obsidian.png" },
  { name: "Zoom", icon: "/apps/zoom.png" },
  { name: "Asana", icon: "/apps/asana.png" },
] as const;

function Cap({
  children,
  className = "",
  short = false,
}: {
  children?: React.ReactNode;
  className?: string;
  short?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[9px] bg-[#2a2a2e] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_0_#0b0b0c] ${
        short ? "h-8 sm:h-10" : "aspect-square"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function AppCap({ name, icon }: { name: string; icon: string }) {
  return (
    <Cap>
      <span className="flex h-[70%] w-[70%] items-center justify-center overflow-hidden rounded-[8px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={icon}
          alt={name}
          className="h-[72%] w-[72%] object-contain"
        />
      </span>
    </Cap>
  );
}

export function WorksAnywhereSection() {
  const top = MOSAIC.slice(0, 10);
  const bottom = MOSAIC.slice(10);

  return (
    <LandingBand className="py-20 md:py-28">
      <LandingBandInner>
        <div className="text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Works anywhere
          </p>
          <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            Works anywhere you can type
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[16px] text-[var(--foreground-muted)] md:text-[17px]">
            Slack, Cursor, Notion, and every other Mac app.
          </p>
        </div>
      </LandingBandInner>

      <LandingBandBleed className="mt-12 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[72rem]">
          <div className="rounded-[2rem] bg-gradient-to-b from-[#2e2e32] to-[#111113] p-3 shadow-[0_32px_80px_rgba(20,18,16,0.22)] sm:p-4 md:rounded-[2.25rem] md:p-5">
            <div
              className="rounded-[1.5rem] bg-[#161618] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10"
              aria-hidden
            >
              <div className="grid gap-2 [grid-template-columns:repeat(14,minmax(0,1fr))] sm:gap-2.5 md:gap-3">
                {Array.from({ length: 14 }).map((_, i) => (
                  <Cap key={`fn-${i}`} short />
                ))}

                <Cap />
                <Cap />
                {top.map((app) => (
                  <AppCap key={app.name} name={app.name} icon={app.icon} />
                ))}
                <Cap />
                <Cap />

                <Cap />
                <Cap />
                {bottom.map((app) => (
                  <AppCap key={app.name} name={app.name} icon={app.icon} />
                ))}
                <Cap />
                <Cap />

                <Cap />
                <Cap />
                <Cap className="col-span-10 !aspect-auto min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem]" />
                <Cap />
                <Cap />
              </div>
            </div>
          </div>
        </div>
      </LandingBandBleed>
    </LandingBand>
  );
}
