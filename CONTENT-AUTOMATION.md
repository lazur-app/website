# Content automation

Daily programmatic SEO for lazur.app. A GitHub Actions job runs every hour, researches and writes
pages with Google's Gemini API (cheap, pay per use), adds keyword-tagged photos, and makes one commit.
Pushing to `main` deploys on Vercel. Every run's cost is recorded (see Costs below).

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

Length: prompts ask for about 2,000 words, but pages are published at whatever length the model
writes (Gemini Flash-Lite usually writes 800 to 2,000). Nothing is rejected for length.
`CONTENT_EXPAND=on` adds up to two passes that ask for more sections when a page is under 2,000.

**Content checks are OFF by default** (Veer's call, 2026-11-09): whatever the model writes is
published as long as it is valid JSON for the page template. The writing rules still go into every
prompt as guidance. `CONTENT_CHECKS=on` (repo variable) brings back the full guards: banned words and
dashes, word count, cited sources only, Lazur claims, keyword in the H1, fix rounds and rejection.
`npm run content:lint` always reports what the guards would say, without blocking anything.

Problem pages: a planner researches real problems per role (forums, People also ask, surveys) and
rejects overlaps; each page covers what the problem costs, why it happens, fixes that work without
any app, then where Lazur honestly helps, a short plan, FAQ and sources.

Hubs: `/how-to`, `/how-to/app/<app>`, `/apps`, `/for`, `/for/<role>/problems`, `/compare`, `/alternatives`, `/tools`, `/blog`.
Old `/use-cases/*` URLs redirect to `/apps/*`.

## How one page gets written

```
pick next target ─► research: cached facts about the app / role / competitor (no new search),
                    plus at most ONE grounded Gemini call for the page's own topic
                 ─► write (Gemini, JSON Schema for that page type)
                 ─► assemble (code adds slug, dates, Lazur's own facts and prices)
                 ─► images (Pixabay → re-encode → keyword file name → EXIF/XMP/IPTC → Cloudflare R2)
                 ─► content/seo/<type>/<slug>.json, cost recorded per page
```

- **Model:** `scripts/content/lib/agent.mjs` calls Gemini over REST. Key: `GEMINI_VERTEX_API_KEY`
  (Vertex AI express key, starts `AQ.`) or `GEMINI_API_KEY` (Google AI Studio). Default model for both
  research and writing: `gemini-3.1-flash-lite` (the only one enabled on the current Vertex key);
  change with `CONTENT_RESEARCH_MODEL` / `CONTENT_WRITE_MODEL`.
- **Research = one call:** Gemini writes plain-text notes while Google Search runs; code builds the
  facts and sources from Google's grounding data (each sentence Google tied to a web page, with that
  page's real URL). Known official help sites are read through URL context, which has no search fee.
- **Research cache** (`content/research-cache/<kind>--<slug>.json`, 45 days): an app, a role or a
  competitor is researched once and reused by every page about it. Role × app, app, role and compare
  pages usually need no new search at all; how-to, problem and blog pages need one call each.
- **Topic planning is free:** planners pull Google autocomplete suggestions (what people type,
  cached 7 days) and pick topics with one ungrounded call. No search fees.
- **Targets.** Topics dedupe against every existing slug, title and keyword (`content/seo/_plan/*.jsonl`).
- **Guards** (only with `CONTENT_CHECKS=on`): `scripts/content/lib/guards.mjs`, rules in
  `src/lib/content/rules.mjs`.
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
- **Storage is one function, `store()`**, so the vendor can change later: Cloudflare R2 when the
  `R2_*` variables are set (`lib/r2.mjs`); Vercel Blob when only `BLOB_READ_WRITE_TOKEN` is set (legacy); otherwise `public/content-images/<type>/<slug>/` for local runs and a
  handful of sample pages. The daily job in GitHub Actions refuses to write into `public/`.
- Pages get 3 photos (`CONTENT_MIN_IMAGES` is the minimum, default 2). Product visuals (notch capsule,
  "you say / Lazur does" window), charts and OG images are drawn in code and need no files.
- Existing pages without photos: `PIXABAY_API_KEY=... node scripts/content/fill-images.mjs [--blog]`.
- **R2 bucket (since 2026-11-07):** `lazur-content-images` on the lazur.app Cloudflare account, public at
  `https://images.lazur.app`, same `content-images/<type>/<slug>/` paths. Env: `R2_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` (an R2 API token with Object Read & Write on that bucket),
  optional `R2_BUCKET` / `R2_PUBLIC_URL`. The Hobby Blob store was suspended after ~2,000 uploads in its
  first day (Advanced Operations limit), so every image was rebuilt from Pixabay and moved with
  `scripts/content/migrate-images-to-r2.mjs`.
- **Blob store (2026-11-06 to 2026-11-07, retired):** store `store_lFObMih1TPJ3SGPO` on the `lazur-website` project,
  public base URL `https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com`, files under
  `content-images/<type>/<slug>/`. The first 105 sample photos were moved there from `public/` with
  `scripts/content/migrate-images-to-blob.mjs`; nothing image-related lives in the repo now.

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

## Costs

Every model call is logged to `content-runs/daily-<date>/usage.jsonl` with tokens, search queries and
its USD cost at Google's list price. Each page's total is in that day's `manifest.json`
(`cost_usd`), and `content-runs/COSTS.md` is rewritten after every run with a per-day table: pages,
searches, total cost, cost per page.

Prices (Google pricing pages, read 2026-11-09): `gemini-3.1-flash-lite` $0.25 per million input
tokens, $1.50 per million output; Google Search grounding on Gemini 3 is billed per search query,
5,000 free a month, then $14 per 1,000.

**Measured** (2026-11-09, 7 real pages, one of each type, empty research cache): $0.63 in total,
about **$0.09 a page**; 33 search queries were $0.46 of that. With the cache warm, roughly 70% of
pages (how-to, problem, blog) need one research call and the rest none, so expect about **$0.05 to
$0.07 a page**:

| Pages a day | Approx. cost a day | Approx. a month |
| ---: | ---: | ---: |
| 200 | $10 to $14 | $300 to $420 |
| 300 | $15 to $21 | $450 to $630 |
| 500 | $25 to $35 | $750 to $1,050 |
| 700 | $35 to $49 | $1,050 to $1,470 |
| 1,000 | $50 to $70 | $1,500 to $2,100 |

Search is most of it. A Google AI Studio key (`GEMINI_API_KEY`) with `gemini-2.5-flash-lite` would cut
that a lot: 2.5 bills grounding per prompt with 1,500 grounded prompts a day free, and its tokens are
cheaper ($0.10 / $0.40). That model is not enabled on the current Vertex key.

**Guards on spend** (repo variables): `CONTENT_MAX_USD_PER_DAY` (default 60) stops the run for the
day; `CONTENT_MAX_SEARCHES_PER_DAY` (default 1400) stops grounding, after which only pages that can use
cached research are written and the rest wait for the next day.

## Running it

GitHub Actions (below) is the main way now: it only needs API keys. A scheduled Claude Code cloud
session can also run it with [`scripts/content/CLOUD-RUN.md`](scripts/content/CLOUD-RUN.md); the
environment then needs the same keys: a Gemini key, `PIXABAY_API_KEY` and the `R2_*` image storage
variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`). `scripts/content/build-check.mjs` is `next build` that works
inside cloud sessions, whose proxy breaks Next's Google Fonts download.

## The ramp: 300, then 500, then 1,000 pages a day

Set in `src/lib/content/sources.mjs` (`RAMP`, `TYPE_WEIGHTS`, `DAILY_REFRESH`):

| Days since the first real run | Pages a day |
| --- | --- |
| 1 to 7 | 300 |
| 8 to 14 | 500 |
| 15 onwards | 1,000 |

The first real run writes its date to `content-runs/ramp.json` (delete it to restart the ramp). The
daily total is split by weight: how-to 40%, problems 25%, role × app 20%, blog 5%, roles 4%,
compare 3%, apps 3%. When a type runs out (there are only so many apps and competitors), its share
rolls into the next type, ending with how-tos. On top, up to 20 old pages under 2,000 words are
rewritten each day until none are left. Override with `CONTENT_DAILY_COUNTS` (`"300"` or
`{"howto":40,"problems":20}`) or per-type flags.

### Can it do 1,000 a day?

- **Time:** a Gemini page takes about 20 to 50 seconds. With 6 in parallel and 40 working minutes an
  hour, one hourly run writes well over 100 pages, so 1,000 a day fits easily.
- **Cost:** see Costs above, roughly $50 to $70 a day at 1,000 pages, capped by
  `CONTENT_MAX_USD_PER_DAY`.
- **Pixabay:** at most 3 searches a page (cached 24 hours), well under 6,000 an hour.
- **Image storage (Cloudflare R2):** about 3 photos of roughly 120 KB per page, so about 360 MB a day at 1,000 pages,
  around 11 GB a month.
- **Deploys:** each hourly push deploys the site, up to 24 deploys a day.
- **Google:** a young domain adding 1,000 pages a day gets crawled slowly at first.

## GitHub Actions

`.github/workflows/content-daily.yml`: hourly at :17, Mondays 07:41 for refresh, one job at a time
(`concurrency: content-daily`), 58-minute timeout. Steps: install, check keys, generate, lint (report only),
`npm run build`, one commit, push. Manual runs: Actions > content-daily > Run workflow, with
`target=branch` to push to `content-test/<date>` instead of `main`, per-type counts, and `fake` to test
the plumbing for free.

### Knobs (repo variables, all optional)

| Variable | Meaning |
| --- | --- |
| `CONTENT_DAILY_ENABLED` | `true` turns the schedule on. Leave unset to keep it off. |
| `CONTENT_COUNT_HOWTO`, `_APPS`, `_ROLES`, `_ROLE_APPS`, `_PROBLEMS`, `_COMPARE`, `_BLOG` | Per-day counts (defaults in `sources.mjs`: 100, 20, 15, 50, 30, 5, 5) |
| `CONTENT_REFRESH_COUNT` | Pages rewritten each Monday (default 40) |
| `CONTENT_CONCURRENCY` | Parallel pages (default 6) |
| `CONTENT_MAX_USD_PER_DAY` | Daily spend cap in USD (default 60) |
| `CONTENT_MAX_SEARCHES_PER_DAY` | Daily cap on Google Search queries (default 1400) |
| `CONTENT_CHECKS` | `on` brings back the writing-rule guards (default off) |

Env knobs for local runs: `CONTENT_RESEARCH_MODEL`, `CONTENT_WRITE_MODEL` (default
`gemini-3.1-flash-lite`), `CONTENT_RESEARCH_TTL_DAYS` (45), `CONTENT_MIN_IMAGES` (2), `SEO_PRERENDER_LIMIT` (pages
per type rendered at build time, default 1500; the rest render on first visit and are cached).

## What Veer needs to do to switch it on

1. **Secrets** (Settings > Secrets and variables > Actions > Secrets):
   - `GEMINI_VERTEX_API_KEY`: the Vertex AI express key (or `GEMINI_API_KEY` for a Google AI Studio key).
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`: Cloudflare R2 image storage.
   - `PIXABAY_API_KEY`: free key from https://pixabay.com/api/docs/ (log in, the key is on that page).
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`: Cloudflare > R2 > Manage API tokens >
     create a token with Object Read & Write on the `lazur-content-images` bucket.
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
| `scripts/content/lib/` | agent (Gemini), research-cache, suggest (autocomplete), schemas, prompts, guards, images, iptc, pipeline, core, fake |
| `content/research-cache/` | Cached research per app, role and competitor |
| `content-runs/COSTS.md` | Cost per day and per page |
| `scripts/content/daily.mjs` | The orchestrator |
| `scripts/content/seo-lint.mjs` | Lint everything |
| `scripts/content/screenshots.mjs` | Screenshot one page per type, mobile and desktop |
| `scripts/content/seed/` | The scripts that wrote the hand-made seed pages |
| `.github/workflows/content-daily.yml` | The job |
