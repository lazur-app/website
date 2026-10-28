import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";

/** Account and app-only pages: nothing for search engines there. */
const PRIVATE_PATHS = ["/dashboard", "/billing", "/auth/", "/login", "/api/", "/leaderboard"];

/**
 * AI search and assistant crawlers, explicitly welcome so Lazur can be found and cited in
 * ChatGPT, Claude, Perplexity, Gemini and Apple Intelligence answers. They also get llms.txt.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
