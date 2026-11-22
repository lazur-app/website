/**
 * Lazur's email design system ("Ticket"). Every email Lazur sends is put together from the blocks
 * in this file, so they all look like one brand: an ink-outlined card, a coloured top with the big
 * wordmark, plain friendly words, one black pill button.
 *
 * The blocks return plain email HTML (tables and inline styles, system fonts, no images), which
 * is what mail apps reliably draw. Nothing here needs a browser or React, so the same strings can
 * be sent from anywhere. See /lab/emails for every block and every email drawn out.
 */

/**
 * The colour themes an email can be drawn in: the header band, the code ticket, notes and links
 * all take their colour from the theme. EMAIL_THEME is the one the real emails use; /lab/emails
 * can show every email in each of them.
 */
export const EMAIL_THEMES = {
  pink: { name: "Pink", accent: "#ff4f93", accentLight: "#ff8dbb", accentDeep: "#c81e63", accentWash: "#fff3f8", tagline: "#fff0f6" },
  teal: { name: "Teal", accent: "#14b8a6", accentLight: "#5eead4", accentDeep: "#0f766e", accentWash: "#ecfdf9", tagline: "#f0fdfa" },
  lilac: { name: "Lilac", accent: "#8b5cf6", accentLight: "#c4b5fd", accentDeep: "#5b21b6", accentWash: "#f5f3ff", tagline: "#f5f3ff" },
  blue: { name: "Blue", accent: "#3b82f6", accentLight: "#93c5fd", accentDeep: "#1d4ed8", accentWash: "#eff6ff", tagline: "#eff6ff" },
  ember: { name: "Ember", accent: "#f97316", accentLight: "#fdba74", accentDeep: "#c2410c", accentWash: "#fff7ed", tagline: "#fff7ed" },
  ink: { name: "Ink", accent: "#2a2724", accentLight: "#57534e", accentDeep: "#0c0b0a", accentWash: "#f5f5f4", tagline: "#e7e5e4" },
} as const;

export type EmailThemeId = keyof typeof EMAIL_THEMES;

/** The theme every real email is sent in. */
export const EMAIL_THEME: EmailThemeId = "lilac";

const THEME = EMAIL_THEMES[EMAIL_THEME];

/** Colours, type and sizes. Change a value here and every email follows. */
export const EMAIL_TOKENS = {
  color: {
    page: "#fffdfb",
    card: "#ffffff",
    ink: "#0c0b0a",
    text: "#1c1917",
    muted: "#6b6560",
    faint: "#a8a29e",
    accent: THEME.accent,
    accentLight: THEME.accentLight,
    accentDeep: THEME.accentDeep,
    accentWash: THEME.accentWash,
    tagline: THEME.tagline,
    rule: "#e7e2dc",
  },
  font: {
    sans: "'Helvetica Neue',Helvetica,Arial,sans-serif",
    serif: "Georgia,'Times New Roman',serif",
    mono: "'SF Mono',Menlo,Consolas,monospace",
  },
  width: 480,
  radius: { card: 18, block: 14, pill: 999 },
  /** Gutter on the left and right of every row inside the card. */
  gutter: 32,
} as const;

const T = EMAIL_TOKENS;
const C = T.color;
const F = T.font;
const OUTLINE = `1.5px solid ${C.ink}`;

/** Where the sticker images live (public/email on the website). Mail apps need a full address. */
export const EMAIL_ASSET_BASE = "https://www.lazur.app/email";

/** The stickers drawn for emails: the site's own chrome stickers, as images (public/email/<name>.png). */
export type EmailSticker = "star" | "heart" | "smiley" | "key" | "cursor" | "mic" | "check" | "bolt" | "planet" | "crown" | "cloud" | "ghost";

function stickerImg(name: EmailSticker, size: number, extra = ""): string {
  return `<img src="${EMAIL_ASSET_BASE}/${name}.png" width="${size}" height="${size}" alt="" style="display:block;width:${size}px;height:${size}px;border:0;${extra}">`;
}

/** Makes text from outside (a name, an email address) safe to place in the HTML. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One row of the card: every block below is wrapped in this. */
function row(inner: string, pad = `0 ${T.gutter}px`, bg: string = C.card): string {
  return `<tr><td style="background:${bg};padding:${pad};">${inner}</td></tr>`;
}

/**
 * The coloured top of every email: a tall band in the theme colour with the big wordmark and tagline on the left and a
 * cluster of chrome stickers on the right (one big one picked per email, two small ones that stay
 * the same), and an optional stamp ("3 DAYS FREE") above the wordmark.
 */
export function header(opts: { sticker: EmailSticker; stamp?: string }): string {
  const stamp = opts.stamp
    ? `<div style="display:inline-block;border:${OUTLINE};background:${C.page};border-radius:${T.radius.pill}px;padding:6px 12px;font:700 11px ${F.sans};letter-spacing:1px;color:${C.ink};white-space:nowrap;margin-bottom:18px;">${esc(opts.stamp)}</div><br>`
    : "";
  return `<tr><td bgcolor="${C.accent}" style="background:${C.accent};background:linear-gradient(150deg,${C.accentLight} 0%,${C.accent} 48%,${C.accentDeep} 100%);padding:38px 26px 34px ${T.gutter}px;border-bottom:${OUTLINE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="bottom" style="padding-right:8px;">
${stamp}<div style="font:800 76px/0.82 ${F.sans};letter-spacing:-4.5px;color:#ffffff;">lazur</div>
<div style="font:600 17px/1.35 ${F.sans};color:${C.tagline};padding-top:14px;max-width:220px;">your AI companion,<br>right by your cursor.</div>
</td>
<td width="150" valign="middle" align="right">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="top" style="padding-top:4px;">${stickerImg("star", 40)}</td>
<td>${stickerImg(opts.sticker, 108)}</td>
</tr><tr>
<td></td><td align="left" style="padding-left:6px;">${stickerImg("planet", 46)}</td>
</tr></table>
</td>
</tr></table>
</td></tr>`;
}

/** The email's one headline. */
export function heading(text: string): string {
  return row(`<div style="font:600 28px/1.08 ${F.sans};letter-spacing:-1.2px;color:${C.text};">${text}</div>`, `32px ${T.gutter}px 0`);
}

/** A paragraph of body text. Pass HTML you trust; run outside values through esc() first. */
export function text(html: string): string {
  return row(`<div style="font:400 16px/1.55 ${F.sans};color:${C.muted};">${html}</div>`, `10px ${T.gutter}px 0`);
}

/** Small grey words: fine print under a button, a closing line. */
export function finePrint(html: string, align: "left" | "center" = "center"): string {
  return row(`<div style="font:400 13px/1.6 ${F.sans};color:${C.faint};text-align:${align};">${html}</div>`, `16px ${T.gutter}px 0`);
}

/** The black pill button, full width. One per email. */
export function button(label: string, href: string): string {
  return row(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td align="center" bgcolor="${C.ink}" style="background:${C.ink};border-radius:${T.radius.pill}px;"><a href="${esc(href)}" style="display:block;padding:16px 30px;font:600 16px ${F.sans};color:#ffffff;text-decoration:none;">${esc(label)}</a></td>
</tr></table>`,
    `22px ${T.gutter}px 0`,
  );
}

/** A dashed ticket in the theme colour with a small label and a big value. Used for codes. */
export function ticket(opts: { label: string; value: string }): string {
  return row(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px dashed ${C.ink};border-radius:${T.radius.block}px;background:${C.accentWash};"><tr>
<td align="center" style="padding:22px 18px;">
<div style="font:700 11px ${F.sans};letter-spacing:2px;color:${C.accentDeep};">${esc(opts.label.toUpperCase())}</div>
<div style="font:700 42px ${F.mono};letter-spacing:10px;color:${C.text};padding-top:8px;">${esc(opts.value)}</div>
</td>
</tr></table>`,
    `20px ${T.gutter}px 0`,
  );
}

/** A numbered list of steps, each number in an ink circle. */
export function steps(items: string[]): string {
  const rows = items
    .map(
      (item, i) => `<tr>
<td width="38" valign="top" style="padding:7px 0;"><div style="width:26px;height:26px;border-radius:13px;background:${C.ink};color:#ffffff;font:700 13px/26px ${F.sans};text-align:center;">${i + 1}</div></td>
<td style="padding:9px 0 7px;font:400 16px/1.45 ${F.sans};color:${C.text};">${item}</td>
</tr>`,
    )
    .join("");
  return row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`, `16px ${T.gutter}px 0`);
}

/** A table of facts: a receipt, a plan summary. The last row can be set bold with `strong`. */
export function facts(items: { label: string; value: string; strong?: boolean }[]): string {
  const rows = items
    .map(
      (item, i) => `<tr>
<td style="padding:11px 0;${i ? `border-top:1px solid ${C.rule};` : ""}font:400 15px ${F.sans};color:${C.muted};">${esc(item.label)}</td>
<td align="right" style="padding:11px 0;${i ? `border-top:1px solid ${C.rule};` : ""}font:${item.strong ? 700 : 500} 15px ${F.sans};color:${C.text};">${esc(item.value)}</td>
</tr>`,
    )
    .join("");
  return row(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:${OUTLINE};border-radius:${T.radius.block}px;"><tr><td style="padding:6px 18px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
</td></tr></table>`,
    `20px ${T.gutter}px 0`,
  );
}

/** A note in the theme colour with a short label: a tip, a reminder, something worth a second look. */
export function note(label: string, html: string): string {
  return row(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.accentWash};border-radius:${T.radius.block}px;"><tr><td style="padding:16px 18px;">
<div style="font:700 11px ${F.sans};letter-spacing:2px;color:${C.accentDeep};">${esc(label.toUpperCase())}</div>
<div style="font:400 15px/1.5 ${F.sans};color:${C.text};padding-top:5px;">${html}</div>
</td></tr></table>`,
    `20px ${T.gutter}px 0`,
  );
}

/** A dashed line between two parts of an email. */
export function divider(): string {
  return row(`<div style="border-top:1px dashed ${C.ink};opacity:.25;font-size:0;line-height:0;">&nbsp;</div>`, `26px ${T.gutter}px 0`);
}

/** The words a person would say, set in the serif italic: what to say to Lazur. */
export function sayThis(words: string): string {
  return row(`<div style="font:italic 400 22px/1.3 ${F.serif};color:${C.text};">&ldquo;${esc(words)}&rdquo;</div>`, `14px ${T.gutter}px 0`);
}

/** The space that closes the card under the last block. */
function cardEnd(): string {
  return row("", `0 0 34px`);
}

/** Under the card: who sent this and why, with the links every email needs. */
function footer(reason: string): string {
  return `<table role="presentation" width="${T.width}" cellpadding="0" cellspacing="0" style="max-width:${T.width}px;width:100%;"><tr>
<td style="padding:18px 6px 0;font:400 12px/1.7 ${F.sans};color:${C.faint};text-align:center;">
${reason}<br>
<a href="https://www.lazur.app" style="color:${C.muted};text-decoration:underline;">lazur.app</a> &nbsp;&middot;&nbsp;
<a href="https://www.lazur.app/support" style="color:${C.muted};text-decoration:underline;">Help</a> &nbsp;&middot;&nbsp;
<a href="https://www.lazur.app/privacy" style="color:${C.muted};text-decoration:underline;">Privacy</a>
</td></tr></table>`;
}

/**
 * Puts a whole email together. `blocks` are the rows between the coloured top and the footer.
 * `preheader` is the grey preview line a mail app shows next to the subject.
 * `reason` is the footer's first line: why this person got this email.
 */
export function email(opts: { preheader: string; sticker: EmailSticker; stamp?: string; blocks: string[]; reason: string }): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};"><tr><td align="center" style="padding:36px 16px 44px;">
<table role="presentation" width="${T.width}" cellpadding="0" cellspacing="0" style="max-width:${T.width}px;width:100%;border:${OUTLINE};border-radius:${T.radius.card}px;overflow:hidden;border-collapse:separate;">
${header({ sticker: opts.sticker, stamp: opts.stamp })}
${opts.blocks.join("\n")}
${cardEnd()}
</table>
${footer(opts.reason)}
</td></tr></table></body></html>`;
}

/**
 * A personal note from one of the team: the same card and tall coloured top as the account emails,
 * then plain words written like a friend would, signed with a first name. No buttons, no boxes.
 * `paragraphs` are HTML you trust (run outside values through esc() first).
 */
export function plainEmail(opts: { preheader: string; sticker: EmailSticker; paragraphs: string[]; signature: string; ps?: string }): string {
  const p = (html: string) => `<p style="margin:0 0 16px;font:400 16px/1.6 ${F.sans};color:${C.text};">${html}</p>`;
  const ps = opts.ps ? `<p style="margin:18px 0 0;font:400 14px/1.6 ${F.sans};color:${C.muted};">${opts.ps}</p>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};"><tr><td align="center" style="padding:36px 16px 44px;">
<table role="presentation" width="${T.width}" cellpadding="0" cellspacing="0" style="max-width:${T.width}px;width:100%;border:${OUTLINE};border-radius:${T.radius.card}px;overflow:hidden;border-collapse:separate;">
${header({ sticker: opts.sticker })}
<tr><td style="background:${C.card};padding:30px ${T.gutter}px 8px;">
${opts.paragraphs.map(p).join("")}
</td></tr>
<tr><td style="background:${C.card};padding:4px ${T.gutter}px 32px;">
<p style="margin:0;font:600 16px/1.3 ${F.sans};color:${C.text};">${esc(opts.signature)}</p>
<p style="margin:2px 0 0;font:400 13px ${F.sans};color:${C.muted};">Lazur</p>
${ps}
</td></tr>
</table>
</td></tr></table></body></html>`;
}

/** A link inside a personal note: underlined, in the theme's deep colour. */
export function link(label: string, href: string): string {
  return `<a href="${esc(href)}" style="color:${C.accentDeep};font-weight:600;text-decoration:underline;">${esc(label)}</a>`;
}

/**
 * Redraws an email in another theme by swapping the sent theme's colours for that theme's. Used by
 * /lab/emails to compare themes; the real emails are built in EMAIL_THEME directly.
 */
export function recolor(html: string, to: EmailThemeId): string {
  if (to === EMAIL_THEME) return html;
  const from = EMAIL_THEMES[EMAIL_THEME];
  const target = EMAIL_THEMES[to];
  const keys = ["accent", "accentLight", "accentDeep", "accentWash", "tagline"] as const;
  const map = new Map<string, string>();
  for (const k of keys) map.set(from[k].toLowerCase(), target[k]);
  const pattern = new RegExp([...map.keys()].join("|"), "gi");
  return html.replace(pattern, (m) => map.get(m.toLowerCase()) ?? m);
}
