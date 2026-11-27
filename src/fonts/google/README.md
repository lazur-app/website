# Google Fonts, self-hosted

Latin `.woff2` files downloaded from Google Fonts (fonts.googleapis.com/css2, Chrome user agent) so the
production build never fetches fonts from Google. Since late November 2026 `next/font/google` failed inside
Cloud Build's Docker build ("An error occurred in next/font", loader.js reading '1'), which broke every deploy.

All are under the SIL Open Font License 1.1 (https://openfontlicense.org): Caveat, EB Garamond, Geist Mono,
Big Shoulders, Fraunces, Unbounded, Instrument Serif. Each file is the variable font for its style.
Loaded with `next/font/local` in src/lib/fonts.ts, src/app/layout.tsx and the lab font files.
