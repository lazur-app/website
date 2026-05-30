import Link from "next/link";
import { LogoWordmark } from "./LogoWordmark";

const footerLinks = {
  Product: [
    { href: "/#smart-rewrite", label: "Smart Rewrite" },
    { href: "/#transformation", label: "Demo" },
    { href: "/#speed", label: "Speed" },
    { href: "/pricing", label: "Pricing" },
    { href: "/leaderboard", label: "Leaderboard" },
  ],
  Account: [
    { href: "/login", label: "Log in" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/#waitlist", label: "Early access" },
  ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <LogoWordmark iconSize="h-7 w-7" textClassName="text-lg font-bold" />
            <p className="mt-3 max-w-xs text-sm text-[var(--foreground-muted)]">
              Your voice, upgraded. The fastest way to think in text.
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
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-[var(--foreground-faint)] md:text-left">
          © {new Date().getFullYear()} Lazur AI · Built for macOS
        </p>
      </div>
    </footer>
  );
}
