import { PuzzleWordmark } from "./PuzzleWordmark";
import { Sticker } from "@/components/landing/Sticker";
import { LogoWordmark } from "./LogoWordmark";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/TrackedLink";

const footerLinks = {
  Product: [
    { href: "/pricing", label: "Pricing" },
    { href: "/apps", label: "Apps" },
    { href: "/for", label: "Roles" },
    { href: "/compare", label: "Comparisons" },
    { href: "/download", label: "Download" },
  ],
  Learn: [
    { href: "/how-to", label: "How-to guides" },
    { href: "/tools", label: "Free tools" },
    { href: "/alternatives", label: "Alternatives" },
    { href: "/blog", label: "Blog" },
  ],
  // Account: [
  //   { href: "/login", label: "Log in" },
  //   { href: "/dashboard", label: "Dashboard" },
  //   { href: "/login", label: "Refer a friend" },
  // ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/support", label: "Support" },
  ],
};

const connectLinks: {
  href: string;
  label: string;
  external?: boolean;
}[] = [
  { href: "mailto:hello@lazur.app", label: "email" },
  { href: "https://www.instagram.com/heylazur", label: "instagram", external: true },
  { href: "https://x.com/heylazur", label: "x (twitter)", external: true },
  { href: "https://www.linkedin.com/company/lazur-app", label: "linkedin", external: true },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-[var(--border)] py-16 md:py-20">
      <div className="landing-container">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <LogoWordmark height={28} location="footer" />
            <p className="mt-3 max-w-xs text-sm text-[var(--foreground-muted)]">
              Your AI companion, right at the notch or by your cursor.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-[var(--foreground-faint)]">
                  {category}
                </p>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <TrackedLink
                        href={link.href}
                        event="nav_link_clicked"
                        eventProps={{ location: "footer", section: category, label: link.label, destination: link.href }}
                        className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                      >
                        {link.label}
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
                connect
              </p>
              <ul className="space-y-2">
                {connectLinks.map((link) => (
                  <li key={link.label}>
                    <TrackedAnchor
                      href={link.href}
                      eventProps={{
                        location: "footer",
                        label: link.label,
                        // Never send the address itself for mailto links.
                        url: link.external ? link.href : "mailto",
                      }}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm lowercase text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </TrackedAnchor>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* The sign-off: the mark and the name, as a finished jigsaw. */}
      {/* The sign-off: the mark and the name as a finished jigsaw, edge to edge. */}
      <div className="relative mt-16 px-3 md:mt-24 md:px-6">
        <Sticker name="smiley" size={88} rotate={-8} className="absolute -top-10 right-6 md:right-16" />
        <PuzzleWordmark />
      </div>

      <div className="landing-container">
        <p className="mt-12 text-center text-xs text-[var(--foreground-faint)] md:mt-16 md:text-left">
          © {new Date().getFullYear()} Lazur AI · Built for macOS
        </p>
      </div>
    </footer>
  );
}
