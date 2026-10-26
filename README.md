# Lazur website

The marketing site, account pages and app sign-in for [lazur.app](https://lazur.app). Next.js, deployed on Vercel from `main`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also the pre-push check)
npm run lint
```

Create `.env.local`:

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend, e.g. `https://api.lazur.app` or `http://localhost:8000` |
| `NEXT_PUBLIC_MAC_DOWNLOAD_URL` | Apple Silicon DMG, e.g. `https://releases.lazur.app/Lazur_<version>_aarch64.dmg` |
| `NEXT_PUBLIC_MAC_DOWNLOAD_URL_INTEL` | Intel DMG (`…_x64.dmg`). Optional; the Intel option hides without it |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | Product analytics |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |

On Vercel these live in the project's Production environment. **After each app release, update both download URLs and redeploy** (see `app-macOS/RELEASE.md`).

## Where things are

| Path | What |
|---|---|
| `src/app/page.tsx` | Homepage (`src/components/hero`, `src/components/landing`) |
| `src/app/pricing`, `src/lib/pricingPlans.ts` | Pricing page and plan copy. Charged prices come from Polar via the backend |
| `src/app/download`, `src/lib/download.ts` | Download page; picks the Apple Silicon or Intel DMG |
| `src/app/login`, `src/app/auth/callback`, `src/lib/appDeepLink.ts` | Sign-in, including the hand-off back to the Mac app |
| `src/app/dashboard`, `src/app/billing` | Signed-in account and billing pages |
| `src/app/compare`, `src/lib/compare` | `/compare/lazur-vs-*` head-to-head pages |
| `src/app/use-cases`, `src/lib/use-cases` | Use-case pages |
| `content/blog/` | Blog posts as markdown, one file per URL. See `content/blog/README.md` |
| `src/lib/seo` | Titles, descriptions, structured data, sitemap helpers |
| `src/app/support`, `privacy`, `terms` | Support (also the Chrome Web Store support URL) and legal pages |

## Positioning

Copy should match `ICP_AND_DISCOVERY.md` and `brand-description.txt` in the parent folder: Lazur is a voice assistant for the Mac that sees your screen, talks back and does the work. Dictation is included, not the headline.
