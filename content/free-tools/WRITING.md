# Writing a free tool's pages

Each free tool lives at `<tool>.lazur.app` and gets one content file: `content/free-tools/pages/<tool>.json`.
It holds the text under the tool on its home page (`main`) and 8 to 10 keyword pages (`pages`), one per
search chosen from Google data in `content/free-tools/keywords.json`.

The goal of every page: the person who searched that phrase gets the answer at once, uses the tool,
and a search engine or AI assistant can quote the page as the answer.

## Inputs

- `content/free-tools/keywords.json` → your tool: `phrase`, `mainSerp` (what ranks for the main phrase and
  what people ask), and `pages`: each with `keyword`, `slug`, `intent` and `serp` (top results, People Also
  Ask, related searches).
- `content/free-tools/capabilities.json` → your tool's `does`: **the only features you may claim.**
- `src/lib/free-tools/data.generated.json` → the tool's name, title and tagline.

## Research (do this for every page)

1. Read the keyword's `serp.top` results. Open the top 2 or 3 with WebFetch to see what searchers get and
   what is missing or wrong.
2. Use `serp.paa` (People Also Ask) for the FAQ.
3. For platform or app steps (Windows 11, iPhone, Zoom, Google Docs …), check the official help page
   (support.microsoft.com, support.apple.com, support.google.com, support.zoom.com …) and write the steps
   exactly as they are today. Never guess a menu path.
4. Write something better and more direct than what ranks. Never copy sentences.

## The file

```json
{
  "tool": "mic-test",
  "main": {
    "claim": "…",
    "sections": [{ "heading": "…", "body": "…" }],
    "imageQuery": "podcast microphone desk",
    "imageAlt": "A microphone on a desk next to a laptop"
  },
  "pages": [
    {
      "slug": "iphone",
      "keyword": "mic test iphone",
      "title": "Mic Test on iPhone – Check Your Microphone Free | Lazur",
      "description": "Test your iPhone microphone in Safari in 10 seconds…",
      "h1": "Mic test on iPhone",
      "claim": "…",
      "sections": [{ "heading": "…", "body": "…" }],
      "faq": [{ "q": "…", "a": "…" }],
      "imageQuery": "person holding iphone",
      "imageAlt": "Someone holding an iPhone close to their mouth"
    }
  ]
}
```

- `slug` and `keyword` must match `keywords.json` exactly. Write one page per planned keyword.
- `title`: the keyword first, ≤ 70 characters including the ending ` | Lazur`. A ` – ` is allowed only in titles.
- `description`: 110 to 165 characters. Say what the page gives, with the keyword.
- `h1`: the keyword as a person would say it (≤ 70 characters).
- **`claim` (60 to 240 characters):** the direct answer, shown right under the H1. It is what search engines
  and AI assistants quote, so it must be true, specific and self-contained. Say what the tool does for
  this search, using facts from `capabilities.json`. Example: "Open this page on your iPhone in Safari,
  allow the microphone, and talk: the bar moves when your mic works. Record 10 seconds and play it back.
  Free, no app and no sign-up."
- `sections`: 3 to 6. Home page (`main`) 400 to 800 words; keyword pages 450 to 900 words.
  Good sections: how to do it (numbered steps), what the result means, fixes when it doesn't work, the
  platform/app-specific part, privacy. The last section of each page may mention Lazur once (see below).
- `faq`: 3 to 5 real questions (from People Also Ask). Answer in the first sentence, 25 to 90 words.
- `imageQuery`: 2 to 4 concrete words for a real photo (people, devices, places). `imageAlt`: what the photo shows.

## Body format

Paragraphs separated by a blank line. `- ` for bullets, `1. ` for steps (each list in its own block).
`**bold**` for the one thing to notice. Links only as `[text](url)` to `https://<tool>.lazur.app/<slug>`,
`https://www.lazur.app/…`, or an official help page from the list above. No HTML, no headings inside a body.

## Rules

- **Only true claims.** Features, limits and privacy exactly as in `capabilities.json`. No invented
  numbers, studies, user counts or ratings. No "best", "#1", "most accurate" about our tool.
- **Lazur, once per page at most, at the end:** Lazur is a Mac app (Windows is coming): hold two keys and
  talk, and it types, answers or does the task in whatever app you are in. Tie it to the page ("If you
  dictate every day, Lazur does this in any app on your Mac"). Never more than two sentences.
- Don't name or criticise competitors. Platforms and apps (Windows, Zoom, Google Docs) are fine.
- Plain, direct English a 14-year-old understands. Short sentences. Talk to the reader ("you").
  American spelling. Numbers as digits.
- Never use: in today's, delve, game-changer, seamless, unlock, elevate, leverage, robust, cutting-edge,
  revolutionize, look no further, whether you're, it's important to note, dive into, navigate the, realm,
  landscape, harness, effortless, best-in-class, world-class, ultimate guide, in conclusion, furthermore,
  moreover, embark, tapestry, testament, supercharge, empower, say goodbye, hassle-free. No em dashes.
- Every page must be useful on its own, not a copy of the others with a word swapped. Each one answers
  its own search.

## Check

`node scripts/free-tools-validate.mjs <tool>` must show 0 errors. Read every warning: a number that looks
like a statistic must be true or removed.
