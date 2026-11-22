/**
 * Lazur's email design system ("Ticket"). Every email Lazur sends is put together from the blocks
 * in this file, so they all look like one brand: an ink-outlined card, a teal top with the big
 * wordmark, plain friendly words, one black pill button.
 *
 * The blocks return plain email HTML (tables and inline styles, system fonts, no images), which
 * is what mail apps reliably draw. Nothing here needs a browser or React, so the same strings can
 * be sent from anywhere. See /lab/emails for every block and every email drawn out.
 */

/** Colours, type and sizes. Change a value here and every email follows. */
export const EMAIL_TOKENS = {
  color: {
    page: "#fffdfb",
    card: "#ffffff",
    ink: "#0c0b0a",
    text: "#1c1917",
    muted: "#6b6560",
    faint: "#a8a29e",
    accent: "#14b8a6",
    accentLight: "#5eead4",
    accentDeep: "#0f766e",
    accentWash: "#ecfdf9",
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

/** The teal top of every email: the wordmark, the tagline, and an optional tilted stamp ("3 DAYS FREE"). */
export function header(opts: { stamp?: string } = {}): string {
  const stamp = opts.stamp
    ? `<td align="right" valign="top"><div style="display:inline-block;transform:rotate(9deg);border:${OUTLINE};background:${C.page};border-radius:${T.radius.pill}px;padding:7px 13px;font:700 12px ${F.sans};letter-spacing:.4px;color:${C.ink};white-space:nowrap;">${esc(opts.stamp)}</div></td>`
    : "";
  return `<tr><td bgcolor="${C.accent}" style="background:${C.accent};background:linear-gradient(135deg,${C.accentLight} 0%,${C.accent} 55%,${C.accentDeep} 100%);padding:30px ${T.gutter}px 26px;border-bottom:${OUTLINE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font:800 58px/0.9 ${F.sans};letter-spacing:-3.5px;color:#ffffff;">lazur</td>${stamp}
</tr></table>
<div style="font:italic 400 21px ${F.serif};color:#ffffff;padding-top:10px;">your AI companion, right by your cursor.</div>
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

/** A dashed teal ticket: a small label, a big value, and an optional stub on the right. Used for codes. */
export function ticket(opts: { label: string; value: string; stub?: string }): string {
  const stub = opts.stub
    ? `<td width="96" align="center" style="border-left:1.5px dashed ${C.ink};font:700 11px/1.5 ${F.sans};letter-spacing:1.5px;color:${C.text};">${esc(opts.stub).replace(/ /g, "<br>")}</td>`
    : "";
  return row(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px dashed ${C.ink};border-radius:${T.radius.block}px;background:${C.accentWash};"><tr>
<td style="padding:20px 22px;">
<div style="font:700 11px ${F.sans};letter-spacing:2px;color:${C.accentDeep};">${esc(opts.label.toUpperCase())}</div>
<div style="font:700 40px ${F.mono};letter-spacing:9px;color:${C.text};padding-top:6px;">${esc(opts.value)}</div>
</td>${stub}
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

/** A teal note with a short label: a tip, a reminder, something worth a second look. */
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
 * Puts a whole email together. `blocks` are the rows between the teal top and the footer.
 * `preheader` is the grey preview line a mail app shows next to the subject.
 * `reason` is the footer's first line: why this person got this email.
 */
export function email(opts: { preheader: string; stamp?: string; blocks: string[]; reason: string }): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};"><tr><td align="center" style="padding:36px 16px 44px;">
<table role="presentation" width="${T.width}" cellpadding="0" cellspacing="0" style="max-width:${T.width}px;width:100%;border:${OUTLINE};border-radius:${T.radius.card}px;overflow:hidden;border-collapse:separate;">
${header({ stamp: opts.stamp })}
${opts.blocks.join("\n")}
${cardEnd()}
</table>
${footer(opts.reason)}
</td></tr></table></body></html>`;
}

/**
 * A personal note from one of the team: no card, no logo, no colours, just words, the way a
 * friend's email looks in an inbox. Used for everything that is not a code or a receipt.
 * `paragraphs` are HTML you trust (run outside values through esc() first). `signature` is the
 * sender's first name, set on its own line.
 */
export function plainEmail(opts: { preheader: string; paragraphs: string[]; signature: string; ps?: string }): string {
  const p = (html: string) => `<p style="margin:0 0 16px;font:400 15px/1.6 ${F.sans};color:#222222;">${html}</p>`;
  const ps = opts.ps ? `<p style="margin:22px 0 0;font:400 14px/1.6 ${F.sans};color:#555555;">${opts.ps}</p>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;"><tr><td style="padding:24px 20px 40px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;"><tr><td>
${opts.paragraphs.map(p).join("\n")}
<p style="margin:0;font:400 15px/1.6 ${F.sans};color:#222222;">${esc(opts.signature)}</p>
${ps}
</td></tr></table>
</td></tr></table></body></html>`;
}

/** A link inside a personal note: plain, underlined, the way a mail app shows one. */
export function link(label: string, href: string): string {
  return `<a href="${esc(href)}" style="color:#1a56db;text-decoration:underline;">${esc(label)}</a>`;
}
