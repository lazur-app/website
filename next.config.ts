import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    // Safe headers for every page. No Content-Security-Policy yet: GA, DataFast, Vercel and the
    // R2 media hosts need an allow-list that should be tested on a preview first.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
  async rewrites() {
    // Markdown copy of any content page: /how-to/x.md is served by src/app/md/[...path]/route.ts.
    return [{ source: "/:path((?:blog|how-to|apps|for|compare|alternatives)/.+)\\.md", destination: "/md/:path" }];
  },
  async redirects() {
    return [
      {
        source: "/blog/lazur-vs-wispr-flow",
        destination: "/compare/lazur-vs-wispr-flow",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-aqua-voice",
        destination: "/compare/lazur-vs-aqua-voice",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-macwhisper",
        destination: "/compare/lazur-vs-macwhisper",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-super-whisper",
        destination: "/compare/lazur-vs-super-whisper",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-willow-voice",
        destination: "/compare/lazur-vs-willow-voice",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-apple-dictation",
        destination: "/compare/lazur-vs-apple-dictation",
        permanent: true,
      },
      {
        source: "/blog/google-voice-typing-alternative",
        destination: "/compare/google-voice-typing-alternative",
        permanent: true,
      },
      // Use cases became app pages (/apps/<app>) with the programmatic SEO system.
      { source: "/use-cases", destination: "/apps", permanent: true },
      { source: "/use-cases/:app", destination: "/apps/:app", permanent: true },
      {
        source: "/blog/README",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/readme",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Keyword-named photos uploaded by scripts/content (Pixabay → re-encoded → Cloudflare R2,
    // served from images.lazur.app). The Blob host stays for any page not yet migrated.
    remotePatterns: [
      { protocol: "https", hostname: "images.lazur.app" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  outputFileTracingIncludes: {
    "/llms.txt": ["./content/**/*"],
    "/api/seo-stats": ["./content/**/*", "./content-runs/daily-*/manifest.json", "./content-runs/daily-*/usage.jsonl"],
    "/md/[...path]": ["./content/**/*"],
    "/blog/[slug]": ["./content/blog/**/*", "./content/seo/**/*"],
    "/blog": ["./content/blog/**/*"],
    "/how-to/[slug]": ["./content/seo/**/*", "./content/blog/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/how-to/[slug]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/apps/[app]": ["./content/seo/**/*", "./content/blog/**/*"],
    "/apps/[app]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/for/[role]": ["./content/seo/**/*", "./content/blog/**/*"],
    "/for/[role]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/for/[role]/[app]": ["./content/seo/**/*", "./content/blog/**/*"],
    "/for/[role]/[app]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/for/[role]/problems/[slug]": ["./content/seo/**/*", "./content/blog/**/*"],
    "/for/[role]/problems/[slug]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/for/[role]/problems": ["./content/seo/**/*"],
    "/compare/[slug]": ["./content/seo/**/*", "./content/blog/**/*"],
    "/compare/[slug]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
    "/alternatives/[slug]": ["./content/seo/**/*", "./content/blog/**/*"],
    "/alternatives/[slug]/opengraph-image": ["./content/seo/**/*", "./src/fonts/open-sauce-one/*.ttf"],
  },
};

export default nextConfig;
