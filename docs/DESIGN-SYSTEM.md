# SEO page design system

Every programmatic page (how-to, app, role, role × app, compare, alternatives, tools, blog) is built
from the same small set of components, on the tokens already in `src/app/globals.css`. Templates
render from typed data (`src/lib/seo-pages/types.ts`), so the generator only ever writes JSON.

## Tokens

From the existing site, unchanged:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#fffdfb` warm off-white | Page |
| `--background-deep` | `#f7f4ef` | TL;DR, menu-path chips, table heads |
| `--foreground` / `-muted` / `-faint` | `#1c1917` / `#6b6560` / `#a8a29e` | Text levels |
| `--brand` / `--brand-ink` / `--brand-soft` | `#6b4bfc` / `#4c3d99` / 10% violet | Links, markers, Lazur tints |
| `--gradient-brand` | violet → purple → orange | Stat numbers, highlighted chart bar, waveform |
| `--border`, `--shadow-card`, `--radius-card` (14px) | | Cards and tables |
| Clash Display / Open Sauce | | Headings / body |

Added for SEO pages (top of the `seo-` block in `globals.css`):

| Token | Value | Use |
| --- | --- | --- |
| `--seo-coral` | `#ef5350` | The circle Lazur draws (same as the hero NotchStage) |
| `--seo-ink-body`, `--seo-ink-soft` | `#3d3834`, `#5c564f` | Body copy, intros (same values the blog used) |
| `--seo-col` | 44rem | Reading column |
| `--seo-wide` | 72rem | Hero, Faster with Lazur, related grid |
| `--seo-chart-bar`, `--seo-chart-hi` | 16% ink, brand gradient | Chart bars |

Spacing stays on the 4px grid. Mobile first: 16px side gutter, 24px from 640px. No horizontal scroll at
390px (checked by `scripts/content/screenshots.mjs`). Motion is CSS only and stops under
`prefers-reduced-motion`.

## Components (`src/components/seo-pages`)

| Component | What it is |
| --- | --- |
| `SeoPageFrame` | Navbar, backdrop, footer, JSON-LD |
| `PageHero` | Breadcrumbs, kicker, H1 that matches the query, two-sentence answer, meta line (updated, checked against), optional visual |
| `Breadcrumbs` | Also emitted as BreadcrumbList JSON-LD |
| `TldrBox` | 3 to 5 bullets a model can quote |
| `StepList` | Numbered steps with menu path chips (`MenuPath`), keys (`Kbd`), tip and optional photo; each step has an `#step-n` anchor |
| `ShortcutTable`, `Troubleshooting` | How-to extras |
| `FasterWithLazur` | The Lazur block: copy, three mini steps, "more things to say" chips, and the `NotchScene` visual. Only shows real capabilities |
| `NotchScene` / `NotchCapsule` / `ScreenMock` | Product visual drawn in code: the notch, the listening capsule, "You say" and "Lazur" bubbles, an app window per shell (sheet, design, doc, mail, slack, code, chat, generic) with the coral circle or the text written at the cursor |
| `LazurCallout` | One-line mid-page nudge |
| `StatStrip` | 2 to 4 sourced numbers, each linking to its source |
| `BarChart` | CSS bar chart with a screen-reader table and a source line |
| `CompareGrid`, `ProductCards` | Any number of products; Lazur's column is tinted, never declared the winner |
| `Callout` | tip, note, warning |
| `ImageFigure` | `next/image` with keyword alt text and visible Pixabay credit |
| `FaqList` | `<details>` FAQ, also FAQPage JSON-LD |
| `SourcesList` | Numbered sources with check dates |
| `CtaBand` | Dark closing band: Download for Mac, Pro $18/month after the 3-day trial |
| `RelatedGrid` | Cross-type related links in groups, each with its hub |
| `HubHeader`, `HubSection`, `HubCard` | Index pages |
| `SeoBlocks` | Renders body blocks: paragraph, heading, list, callout, image, table, stats, chart, lazur |
| `InlineText` | The only inline markup generated text may use: `[text](/path)` and `**bold**`. No HTML |

## Templates (`src/components/seo-pages/templates`)

| Template | Order |
| --- | --- |
| `HowToTemplate` | Hero (photo) → TL;DR → what you need → steps → nudge → stats → body → shortcuts → troubleshooting → Faster with Lazur → FAQ → sources → CTA → related |
| `AppTemplate` | Hero (notch scene) → TL;DR → stats → what you can ask → body → by role → second demo → FAQ → sources → CTA → related |
| `RoleTemplate` | Hero (notch scene) → TL;DR → stats → where the day goes → a day with Lazur → body → apps → FAQ → sources → CTA → related |
| `RoleAppTemplate` | Hero (notch scene) → TL;DR → stats → asks → body → FAQ → sources → CTA → related |
| `ProblemTemplate` | Hero (photo) → short answer → stats → what it costs (cards) → why it happens (numbered) → chart → how to fix it (checklist) → nudge → body → Where Lazur helps → what people say to Lazur → plan (timeline) → FAQ → sources → CTA → related |
| `CompareTemplate` | Hero → short version → side by side → our take → product cards → body → FAQ → sources → disclaimer → CTA → related |

The rule for how-to pages: the real answer comes first. Lazur appears after the steps, and only as
"ask Lazur and it points at / walks you through it", never "Lazur does it for you".

Screenshots of every type, mobile and desktop: `docs/seo-screenshots/`.
