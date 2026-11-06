# Content automation

Daily programmatic SEO for lazur.app. A GitHub Actions job runs every hour, writes researched pages
with headless Claude Code on a Claude Code seat, checks every page in code, adds keyword-tagged
photos, and makes one commit. Pushing to `main` deploys on Vercel.

**It is off.** Nothing runs on a schedule until you set the repo variable `CONTENT_DAILY_ENABLED=true`.

## What it writes

| Type | URL | Data | Default per day |
| --- | --- | --- | --- |
| How to do X in app Y | `/how-to/<task>-in-<app>` | `content/seo/howto/*.json` | 100 |
| App pages | `/apps/<app>` | `content/seo/apps/*.json` | 20 (until every app in `sources.mjs` has one) |
| Role pages | `/for/<role>` | `content/seo/roles/*.json` | 15 (until every role has one) |
| Role × app | `/for/<role>/<app>` | `content/seo/role-apps/<role>--<app>.json` | 50 |
| Problems people in a job have, and fixes | `/for/<role>/problems/<slug>` | `content/seo/problems/<role>--<slug>.json` | 30 |
| Compare, X vs Y | `/compare/<slug>` | `content/seo/compare/*.json` | 5 (shared with alternatives) |
| Alternatives | `/alternatives/<competitor>` | `content/seo/alternatives/*.json` | (in compare) |
| Blog | `/blog/<slug>` | `content/blog/*.md` | 5 |
| Free tools | `/tools/<slug>` | hand-built in `src/components/tools` | not generated |

Every page has **at least 2,000 words** of prose (`MIN_WORDS` in `src/lib/content/rules.mjs`, counted
by code over intro, TL;DR, blocks, steps, FAQ and lists). Generated pages under it are refused. Pages
written before the rule only warn in `seo-lint`, and the refresh job rewrites the thinnest pages first.

Problem pages: a planner researches real problems per role (forums, People also ask, surveys) and
rejects overlaps; each page covers what the problem costs, why it happens, fixes that work without
any app, then where Lazur honestly helps, a short plan, FAQ and sources.

Hubs: `/how-to`, `/how-to/app/<app>`, `/apps`, `/for`, `/for/<role>/problems`, `/compare`, `/alternatives`, `/tools`, `/blog`.
Old `/use-cases/*` URLs redirect to `/apps/*`.

## How one page gets written

```
pick next target ─► research (Haiku + WebSearch/WebFetch, JSON: facts with URLs)
                 ─► write (Haiku, no tools, JSON Schema for that page type)
                 ─► assemble (code adds slug, dates, Lazur's own facts and prices)
                 ─► guards ─fail─► one fix round with the error list ─fail─► refused.jsonl
                 ─► images (Pixabay → re-encode → keyword file name → EXIF/XMP/IPTC → storage)
                 ─► guards again (now with images) ─► content/seo/<type>/<slug>.json
```

- **Targets.** How-to and blog topics come from planners that research search demand and dedupe
  against every existing slug, title and keyword (`content/seo/_plan/*.jsonl` queues). App, role,
  role × app and compare targets come from the lists in `src/lib/content/sources.mjs`.
- **Model calls.** `scripts/content/lib/agent.mjs` runs `claude -p --output-format json --json-schema …`
  with `--model haiku`, `--max-budget-usd` per call, and only `WebSearch,WebFetch` for research (no
  tools for writing). Answers are validated against the schema; one correction round on failure.
  Every call appends cost, tokens and duration to `usage.jsonl`.
- **Guards** (`scripts/content/lib/guards.mjs`, rules in `src/lib/content/rules.mjs`): banned words and
  AI tells, no em/en dashes, no exclamation marks, sentence length, unsupported Lazur claims (user
  counts, results, testimonials, partnerships, "Lazur clicks/builds it for you"), keyword in title,
  every stat and chart sourced, every internal link exists, Lazur prices match `lazur-facts.mjs`,
  competitor prices need a URL on their own site and a check date, the H1 must be long tail (8 to 16 words) and contain the exact target keyword phrase, Lazur demos only use real
  capabilities, image alt text and credits, no duplicate titles or keywords.
- **Honesty by construction.** "Faster with Lazur" blocks can only show a capability id from
  `src/lib/content/lazur-facts.mjs` (explain, point, guide, dictate, draft, research, everyday).
  Lazur's row on compare pages is overwritten from that file, so the model cannot misstate our price.
- **Links** come from the data graph (`src/lib/seo-pages/links.ts`), not the model: every page links
  across types, to its hub, with breadcrumbs, sitemap entries and JSON-LD (Article, BreadcrumbList,
  FAQPage, HowTo, SoftwareApplication).
- **Keywords.** One file, `src/lib/content/sources.mjs`: apps, roles, competitors with sites, keyword
  patterns per type, blog seeds, daily counts. Every page records `keywordHits`.

## Images

`scripts/content/lib/images.mjs`, the SRCo pattern on **Pixabay**:

- Search Pixabay (`PIXABAY_API_KEY`, `safesearch=true`, horizontal photos at least 1200px wide).
  Results are cached for 24 hours (`content/seo/_plan/pixabay-cache.json`), and the
  `X-RateLimit-Remaining/Reset` headers are read so the job waits instead of hitting 429s.
- Photo ids already used on another page are skipped (`pixabay-used.json`). A page that already has
  a stored image for the same query reuses it (`images-stored.json`), so refreshes do not re-download.
- Pixabay URLs are never hotlinked: `largeImageURL` is downloaded and re-encoded with `sharp` (max
  1600px wide, mozjpeg q74, original metadata stripped), renamed from the keyword
  (`how-to-make-a-pivot-table-1-3f9a2c.jpg`), and tagged in EXIF (ImageDescription, Artist,
  Copyright), XMP (dc:subject, dc:description, dc:creator, AltTextAccessibility) and IPTC (2:25
  keywords, 2:120 caption, 2:80 by-line, via `iptc.mjs`).
- Credit on the page: "Image by <user> from Pixabay", linking to the photo page.
- **Storage is one function, `store()`**, so the vendor can change later: Vercel Blob when
  `BLOB_READ_WRITE_TOKEN` is set; otherwise `public/content-images/<type>/<slug>/` for local runs and a
  handful of sample pages. The daily job in GitHub Actions refuses to write into `public/`.
- Pages get 3 photos (`CONTENT_MIN_IMAGES` is the minimum, default 2). Product visuals (notch capsule,
  "you say / Lazur does" window), charts and OG images are drawn in code and need no files.
- Existing pages without photos: `PIXABAY_API_KEY=... node scripts/content/fill-images.mjs [--blog]`.

**Rate math.** Pixabay allows 100 requests a minute. One search returns up to 30 photos, so with the
search cache a page costs about 3 searches at most, and fewer as common queries repeat. 100 pages an
hour is about 300 searches an hour, well under the 6,000 the limit allows; image downloads are
separate CDN requests.

## The daily run

`node scripts/content/daily.mjs [--howto=N --apps=N --roles=N --role-apps=N --problems=N --compare=N --blog=N] [--refresh=N]`

- State lives in `content-runs/daily-<New York date>/`: `manifest.json` (every item and its status),
  `usage.jsonl`, `refused.jsonl`, `summary.md`. It is committed, so the next hourly run resumes and
  only writes what is still missing for that date.
- `--concurrency` (default 4), `--max-minutes` (default 50; the workflow uses 40), `--no-images`,
  `--out=<dir>` (write somewhere else, for previews), `--date=` (override).
- `--refresh=N` rewrites N pages: first every page under 2,000 words, then the stalest (older than 30 days) against fresh research, keeping the
  slug, publish date and photos. Mondays the workflow runs a refresh only (`CONTENT_REFRESH_COUNT`,
  default 40). Older hand-written blog posts are the first in line.
- `npm run content:fake` runs the whole pipeline with a fake model into `.content-preview/`: no seat,
  no cost, no changes to `content/`.
- `npm run content:lint` checks every page in the repo against the same guards.

## Endless roles and problems

Roles are not a fixed list. When every role in `src/lib/content/sources.mjs` has its page, the role
planner researches new jobs that live on a Mac (with evidence of search demand) and appends them to
`src/lib/content/roles-discovered.mjs`. Each new role then gets its role page, role × app pages and
an open-ended stream of problem pages (the problem planner researches new, non-overlapping problems
per role). The same problem can appear for different roles; each page is written for that job.

## Indexing, llms.txt and markdown copies

- **Sitemap:** every page is in `/sitemap.xml` (robots.txt points to it). Submit it once in Google
  Search Console; Google does not take pings.
- **IndexNow:** after each run that pushes to main, `scripts/content/indexnow.mjs` sends that day's
  new and updated URLs to IndexNow (Bing, Yandex and others; Bing feeds ChatGPT search and Copilot).
  The key file is `public/<key>.txt`. `--all` resends everything.
- **llms.txt:** generated at build time (`src/app/llms.txt/route.ts`): the hand-written product
  summary in `content/llms/header.md`, then every page grouped by type. `/llms-full.txt` stays as is.
- **Markdown copies:** every content page also exists as plain markdown at its URL plus `.md`
  (`/how-to/x.md`, `/for/students/problems/x.md`, `/blog/x.md`). Same text, sources and FAQ, no
  layout. Pages announce it with `<link rel="alternate" type="text/markdown">`, the response carries
  a canonical Link header back to the HTML page, and llms.txt links to these copies.
- A separate `llms.` subdomain is deliberately not used: it would split authority from
  www.lazur.app and look like duplicate content. Same-URL markdown gives LLMs the clean text without
  that cost.

## Running the job on a Claude Code seat (cloud)

Instead of GitHub Actions, the job can run as a scheduled Claude Code cloud session on your seat
(no `CLAUDE_CODE_OAUTH_TOKEN` needed). The session needs `PIXABAY_API_KEY` and
`BLOB_READ_WRITE_TOKEN` in its environment and push access to the repo. Each run:

```bash
npm ci
node scripts/content/daily.mjs --max-minutes=50     # resumes today's batch
node scripts/content/seo-lint.mjs --quiet && npm run build
git add content content-runs src/lib/content/roles-discovered.mjs && git commit -m "$(head -1 content-runs/daily-$(TZ=America/New_York date +%F)/summary.md)" && git push origin HEAD:main
node scripts/content/indexnow.mjs
```

## GitHub Actions

`.github/workflows/content-daily.yml`: hourly at :17, Mondays 07:41 for refresh, one job at a time
(`concurrency: content-daily`), 58-minute timeout. Steps: install, Claude Code CLI, generate, lint,
`npm run build`, one commit, push. Manual runs: Actions > content-daily > Run workflow, with
`target=branch` to push to `content-test/<date>` instead of `main`, per-type counts, and `fake` to test
the plumbing for free.

### Knobs (repo variables, all optional)

| Variable | Meaning |
| --- | --- |
| `CONTENT_DAILY_ENABLED` | `true` turns the schedule on. Leave unset to keep it off. |
| `CONTENT_COUNT_HOWTO`, `_APPS`, `_ROLES`, `_ROLE_APPS`, `_PROBLEMS`, `_COMPARE`, `_BLOG` | Per-day counts (defaults in `sources.mjs`: 100, 20, 15, 50, 30, 5, 5) |
| `CONTENT_REFRESH_COUNT` | Pages rewritten each Monday (default 40) |
| `CONTENT_CONCURRENCY` | Parallel pages (default 4) |

Env knobs for local runs: `CONTENT_RESEARCH_MODEL`, `CONTENT_WRITE_MODEL` (default `haiku`),
`CONTENT_MAX_USD_PER_CALL` (default 0.75), `CONTENT_MIN_IMAGES` (2), `SEO_PRERENDER_LIMIT` (pages
per type rendered at build time, default 1500; the rest render on first visit and are cached).

## What Veer needs to do to switch it on

1. **Secrets** (Settings > Secrets and variables > Actions > Secrets):
   - `CLAUDE_CODE_OAUTH_TOKEN`: run `claude setup-token` on a machine logged in to the Claude Code seat
     that should pay for this.
   - `PIXABAY_API_KEY`: free key from https://pixabay.com/api/docs/ (log in, the key is on that page).
   - `BLOB_READ_WRITE_TOKEN`: Vercel > Storage > create a Blob store connected to the website project
     > copy the read-write token.
2. **Test on a branch:** Actions > content-daily > Run workflow, `target=branch`, small counts
   (`howto=3, apps=1, compare=1, blog=1`). Read the pages on the Vercel preview for
   `content-test/<date>`, and check `refused.jsonl` and `usage.jsonl` in the run artifact.
3. **Turn it on:** set the variable `CONTENT_DAILY_ENABLED=true`. Start with lower counts (for
   example `CONTENT_COUNT_HOWTO=20`) and raise them once the pages read well.
4. Each hour that writes something pushes one commit to `main`, which deploys. To stop it, delete
   the variable or set it to anything but `true`.

## Files

| Path | What |
| --- | --- |
| `src/lib/content/sources.mjs` | Keywords, apps, roles, competitors, daily counts |
| `src/lib/content/rules.mjs` | Writing rules: banned phrases, dash and claim checks, the rules prompt |
| `src/lib/content/lazur-facts.mjs` | What Lazur is and can do; capability ids; prices |
| `src/lib/content/keywords.mjs` | Keyword hits |
| `src/lib/seo-pages/` | Types, loader, routes, links, JSON-LD, metadata, OG image |
| `src/components/seo-pages/` | Design-system components and page templates (`docs/DESIGN-SYSTEM.md`) |
| `scripts/content/lib/` | agent, schemas, prompts, guards, images, iptc, pipeline, core, fake |
| `scripts/content/daily.mjs` | The orchestrator |
| `scripts/content/seo-lint.mjs` | Lint everything |
| `scripts/content/screenshots.mjs` | Screenshot one page per type, mobile and desktop |
| `scripts/content/seed/` | The scripts that wrote the hand-made seed pages |
| `.github/workflows/content-daily.yml` | The job |
