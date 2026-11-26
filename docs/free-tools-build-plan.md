# Lazur free tools: build plan

How to serve the 49 free tools in [free-tools-naming.md](free-tools-naming.md) on their own subdomains (like `mic-test.lazur.app`). Written 2026-11-26. Nothing below is built yet.

## Decisions already made

- Every tool gets its **own subdomain**, named after the phrase people search (see the naming doc).
- The naming doc is good enough to start building. Monthly search numbers (DataForSEO top-up or Keyword Planner) can come later.
- More tools can be added later.

## How lazur.app works today

- **Cloudflare Worker** `lazur-web-proxy` (`edge/src/index.ts`) sits in front of everything. It proxies `www.lazur.app`, `admin.lazur.app` and `api.lazur.app` to Cloud Run. Every other hostname is redirected (308) to `www.lazur.app`.
- **Website** is one Next.js app on Cloud Run (`lazur-website`, built by `cloudbuild.yaml`).
- `next.config.ts` sends `Permissions-Policy: camera=(), microphone=()` on **every page**. That blocks the mic and camera, so the mic test, webcam test, dictation, voice recorder and the other voice tools can't work until this changes for them.
- 4 tools already live at `lazur.app/tools/[slug]` (typing speed test, speaking vs typing, typing tax, dictation accuracy). Their copy is in `src/app/tools/content.ts`.

## The setup: one site, many subdomains

All tools live in this same website repo. There are no separate apps.

1. **Cloudflare DNS and route.** Add a proxied wildcard DNS record `*.lazur.app` and a Worker route `*.lazur.app/*`. Workers custom domains don't accept wildcards, so it has to be a route. This needs access to Lazur's Cloudflare account; check for a token first.
2. **Worker.** Keep a list of tool subdomains. A known tool host is proxied to the website origin, with `x-forwarded-host` set to the real hostname (the Worker already sets it). Unknown subdomains still redirect to `www`.
3. **Next.js `src/proxy.ts`.** If the host is a tool subdomain, rewrite `mic-test.lazur.app/playback` to an internal route such as `/sub/mic-test/playback`. The internal `/sub/...` route should 404 on `www`, so the same page never shows on two addresses.
4. **One tools registry** in code (for example `src/lib/free-tools/registry.ts`), copied from the naming doc. Each entry has the subdomain, title, H1, tagline, extra pages, FAQ and related tools. Pages, metadata and sitemaps are all built from it, so adding a tool means adding one entry.
5. **Per-subdomain SEO.** Google treats each subdomain like its own site. Each one needs:
   - its own `sitemap.xml` and `robots.txt` (answered by the proxy rewrite);
   - canonical URLs on its own host;
   - coverage in Search Console. A `lazur.app` **domain** property covers all subdomains; check whether one exists.
6. **Permissions header.** Allow `microphone` (and `camera` for the webcam test and screen recorder) only on the tool hosts that need them. Keep the block everywhere else.
7. **Linking.** Every tool page links to `lazur.app/tools` and to 3-5 related tools. `lazur.app/tools` lists every tool. Every tool ends with the nudge: "Want this in every app? Hold two keys and talk with Lazur", linking to the download.
8. **Analytics.** Send PostHog events for tool used and CTA clicked, tagged with the tool.

## Build order

1. **Setup + Mic Test.** It needs no AI and is quick to build, so it proves the whole subdomain path. Test locally (fake the host with a header or a hosts-file entry), then on `dev`, then live.
2. **Other device tests:** webcam test, speaker test, keyboard test, click speed test, dead pixel test.
3. **Other no-AI tools:** teleprompter, words to minutes, word counter, color picker, email signature, screen recorder.
4. **AI tools, in batches by engine.** First decide where AI calls run (probably the Lazur API) and how to cap cost per visitor (daily limit per IP or device).
   - Speech to text: dictation, voice typing by language, audio to text, voice note to text, voice recorder, audio to notes, meeting minutes, YouTube transcript and summary.
   - Reading images and PDFs: image to text, handwriting, image to Excel, PDF to text, chat with PDF, image to prompt.
   - Writing: prompt generator, Excel/SQL/regex, email reply, LinkedIn message/headline/post, text reply, summarizer, grammar, paraphraser, humanizer, AI detector, bio, caption, cover letter, resignation letter.
   - Speech out: text to speech, read PDF aloud, pronunciation checker, dictation practice.

## Done for each tool

- [ ] Works on its subdomain, including every extra page in the naming doc
- [ ] Title, H1, tagline, intro and FAQ match the naming doc
- [ ] Listed in its subdomain sitemap and on `lazur.app/tools`
- [ ] Links to related tools, plus the Lazur nudge
- [ ] Mic/camera allowed only if the tool needs it
- [ ] PostHog events fire
- [ ] Checked on phone width and in dark mode

## Open questions

- Cloudflare access: is there an API token with rights to DNS and Workers routes for `lazur.app`?
- Search Console: is there a `lazur.app` domain property?
- AI tools: which API and model, and what daily limit per visitor?
- Search numbers: top up DataForSEO, or use Keyword Planner ranges?
