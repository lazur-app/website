/**
 * Two things the plain puzzle design does for the whole page it is on: every heading and accent is set in the
 * hero's face (Open Sauce) instead of Clash Display and the serif italic, and the page's scroll
 * bar is not drawn (the page still scrolls).
 *
 * `body[class]` so these win over the font variables next/font puts on the body's own class. It
 * also gives --font-sans a real value: the site-wide one is declared on :root, where
 * --font-open-sauce does not exist yet, so everywhere else the body text falls back to the
 * system font.
 */
const PAGE_CSS = `
html { scrollbar-width: none; }
html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
body[class] {
  --font-sans: var(--font-open-sauce), ui-sans-serif, system-ui, sans-serif;
  --font-clash: var(--font-open-sauce);
  --font-display: var(--font-open-sauce), ui-sans-serif, system-ui, sans-serif;
  --font-garamond: var(--font-open-sauce);
}
body [class*="font-garamond"] { font-style: normal; font-size: 1em; letter-spacing: inherit; }
`;

export function PlainPageStyle() {
  return <style>{PAGE_CSS}</style>;
}
