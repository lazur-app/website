/* eslint-disable @next/next/no-img-element */

/**
 * "Works in": four rows of small full-colour app logos, alternating direction. Lazur types and points in
 * whatever app is in front, so this is a sample, not a list of integrations. Logos are static SVGs
 * in /public/app-logos (gilbarbara/logos, CC0). CSS-only motion that keeps going on hover;
 * rows stand still under prefers-reduced-motion.
 */
type App = { slug: string; name: string };

export const ROWS: App[][] = [
  [
    { slug: "google-gmail", name: "Gmail" },
    { slug: "slack", name: "Slack" },
    { slug: "notion", name: "Notion" },
    { slug: "figma", name: "Figma" },
    { slug: "visual-studio-code", name: "VS Code" },
    { slug: "discord", name: "Discord" },
    { slug: "whatsapp", name: "WhatsApp" },
    { slug: "safari", name: "Safari" },
    { slug: "chrome", name: "Chrome" },
    { slug: "arc", name: "Arc" },
    { slug: "linear", name: "Linear" },
    { slug: "github", name: "GitHub" },
    { slug: "cursor", name: "Cursor" },
  ],
  [
    { slug: "google-calendar", name: "Google Calendar" },
    { slug: "google-drive", name: "Google Drive" },
    { slug: "google-meet", name: "Google Meet" },
    { slug: "zoom", name: "Zoom" },
    { slug: "microsoft-teams", name: "Microsoft Teams" },
    { slug: "spotify", name: "Spotify" },
    { slug: "youtube", name: "YouTube" },
    { slug: "x", name: "X" },
    { slug: "linkedin", name: "LinkedIn" },
    { slug: "reddit", name: "Reddit" },
    { slug: "telegram", name: "Telegram" },
    { slug: "trello", name: "Trello" },
    { slug: "asana", name: "Asana" },
  ],
  [
    { slug: "jira", name: "Jira" },
    { slug: "confluence", name: "Confluence" },
    { slug: "dropbox", name: "Dropbox" },
    { slug: "obsidian", name: "Obsidian" },
    { slug: "openai", name: "ChatGPT" },
    { slug: "claude", name: "Claude" },
    { slug: "xcode", name: "Xcode" },
    { slug: "airtable", name: "Airtable" },
    { slug: "miro", name: "Miro" },
    { slug: "framer", name: "Framer" },
    { slug: "perplexity", name: "Perplexity" },
    { slug: "loom", name: "Loom" },
    { slug: "todoist", name: "Todoist" },
  ],
  [
    { slug: "intercom", name: "Intercom" },
    { slug: "messenger", name: "Messenger" },
    { slug: "signal", name: "Signal" },
    { slug: "adobe-photoshop", name: "Photoshop" },
    { slug: "adobe-illustrator", name: "Illustrator" },
    { slug: "adobe-premiere", name: "Premiere Pro" },
    { slug: "sketch", name: "Sketch" },
    { slug: "clickup", name: "ClickUp" },
    { slug: "monday", name: "Monday" },
    { slug: "instagram", name: "Instagram" },
    { slug: "postman", name: "Postman" },
    { slug: "docker", name: "Docker" },
    { slug: "shopify", name: "Shopify" },
    { slug: "blender", name: "Blender" },
  ],
];

function Logo({ app, hidden }: { app: App; hidden: boolean }) {
  return (
    <img
      src={`/app-logos/${app.slug}.svg`}
      alt={hidden ? "" : app.name}
      title={app.name}
      loading="lazy"
      decoding="async"
      className="h-6 w-6 shrink-0 object-contain md:h-7 md:w-7"
    />
  );
}

function Row({ apps, index }: { apps: App[]; index: number }) {
  return (
    <div className="logo-wall-row flex w-max" data-reverse={index % 2 === 1 ? "" : undefined} style={{ animationDuration: `${46 + index * 7}s` }}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14" aria-hidden={copy === 1 ? true : undefined}>
          {apps.map((app) => (
            <Logo key={app.slug} app={app} hidden={copy === 1} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function WorksInWall({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "pt-12 md:pt-16" : "py-16 md:py-24"} aria-label="Apps Lazur works in">
      <p className="landing-container text-center text-[14px] text-[var(--foreground-faint)]">works in every app on your Mac</p>
      <div className="logo-wall app-marquee-mask mx-auto mt-6 flex max-w-4xl flex-col gap-6 overflow-hidden py-1 md:gap-7">
        {ROWS.map((apps, i) => (
          <Row key={i} apps={apps} index={i} />
        ))}
      </div>
    </section>
  );
}
