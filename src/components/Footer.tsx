import { PuzzleWordmark } from "./PuzzleWordmark";
import { FounderLinks } from "@/components/landing/FounderLinks";
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
  Company: [
    { href: "/team", label: "Team" },
    { href: "/changelog", label: "Changelog" },
  ],
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
    <footer className="overflow-hidden border-t-[1.5px] border-[#1c1917] py-16 md:py-24">
      <div className="landing-container">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <LogoWordmark height={28} location="footer" />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              Your AI companion, right at the notch or by your cursor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-12 sm:flex sm:flex-wrap sm:gap-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="mb-4 text-[13px] font-bold tracking-[-0.01em] text-[var(--foreground)]">
                  {category}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <TrackedLink
                        href={link.href}
                        event="nav_link_clicked"
                        eventProps={{ location: "footer", section: category, label: link.label, destination: link.href }}
                        className="text-[15px] text-[var(--foreground-muted)] underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]/40"
                      >
                        {link.label}
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-4 text-[13px] font-bold tracking-[-0.01em] text-[var(--foreground)]">
                Connect
              </p>
              <ul className="space-y-3">
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
                      className="text-[15px] lowercase text-[var(--foreground-muted)] underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]/40"
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

      {/* The sign-off: the mark and the name as a finished jigsaw, edge to edge. */}
      <div className="relative mt-16 px-4 md:mt-24 md:px-6">
        <Sticker name="smiley" size={88} rotate={-8} className="absolute -top-12 right-1 origin-top-right scale-[0.55] sm:-top-10 sm:right-6 sm:scale-100 md:right-16" />
        <PuzzleWordmark />
        {/* The three of us on the wordmark (positions measured from its letters): Vaidik sitting cross-legged on the mark,
            Ayush perched on the z, Veer leaning on the u. Click one for their links.
            On phones they are drawn a little bigger (scaled from their feet) so they still read. */}
        <div className="pointer-events-none absolute inset-x-4 inset-y-0 [container-type:inline-size] md:inset-x-6">
          <FounderLinks who="vaidik" pose="sitcross" size="11.21cqw" className="absolute origin-bottom max-sm:scale-[1.4] bottom-[calc(81.25%-1.3cqw)] left-[22.2%] -translate-x-1/2" />
          <FounderLinks who="ayush" pose="sitwave" size="12.1cqw" className="absolute origin-bottom max-sm:scale-[1.4] bottom-[calc(60.4%-3.3cqw)] left-[61.4%] -translate-x-1/2" />
          <FounderLinks who="veer" pose="lean" size="13.57cqw" className="absolute origin-bottom max-sm:scale-[1.4] bottom-[calc(4.7%-1.05cqw)] left-[calc(85.7%-2.74cqw)] -translate-x-1/2" />
        </div>
      </div>

      <div className="landing-container">
        <p className="mt-12 text-center text-[13px] text-[var(--foreground-muted)] md:mt-16 md:text-left">
          © {new Date().getFullYear()} Lazur AI · Built for macOS
        </p>
      </div>
    </footer>
  );
}
