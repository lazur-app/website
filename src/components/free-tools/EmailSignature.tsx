"use client";

import { useRef, useState } from "react";
import { Btn, CopyBtn, Field, Notice, Panel, inputClass } from "./ui";
import { copyGuard, useLazurNudge, useMomentWhen } from "./Letter";

type Form = {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  photo: string;
  accent: string;
};
type Style = "classic" | "modern" | "minimal" | "bold";

const STYLES: { id: Style; label: string }[] = [
  { id: "classic", label: " Classic" },
  { id: "modern", label: " Modern" },
  { id: "minimal", label: " Minimal" },
  { id: "bold", label: " Bold" },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const href = (u: string) => (/^(https?:|mailto:|tel:)/i.test(u) ? u : `https://${u}`);
const safeColor = (c: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : "#6c4df6");

function build(f: Form, style: Style): string {
  const a = safeColor(f.accent);
  const font = "font-family:Arial,Helvetica,sans-serif;";
  const name = f.name || "Your Name";
  const link = (url: string, text: string, color = a) =>
    `<a href="${esc(url)}" style="color:${color};text-decoration:none;" target="_blank">${esc(text)}</a>`;

  const contacts: string[] = [];
  if (f.phone) contacts.push(link(`tel:${f.phone.replace(/[^\d+]/g, "")}`, f.phone, "#444444"));
  if (f.email) contacts.push(link(`mailto:${f.email}`, f.email, "#444444"));
  if (f.website) contacts.push(link(href(f.website), f.website.replace(/^https?:\/\//i, ""), a));
  const socials: string[] = [];
  if (f.linkedin) socials.push(link(href(f.linkedin), "LinkedIn"));
  if (f.twitter) socials.push(link(href(f.twitter), "Twitter"));

  const photo = (size: number, radius: string) =>
    f.photo
      ? `<td style="padding-right:16px;vertical-align:top;"><img src="${esc(f.photo)}" width="${size}" height="${size}" alt="${esc(name)}" style="display:block;border-radius:${radius};width:${size}px;height:${size}px;object-fit:cover;" /></td>`
      : "";
  const titleLine = [f.title, f.company].filter(Boolean).map(esc).join(" | ");

  const open = `<table cellpadding="0" cellspacing="0" border="0" style="${font}font-size:14px;line-height:1.5;color:#444444;">`;

  if (style === "classic") {
    return `${open}<tr>${photo(80, "50%")}<td style="vertical-align:top;${f.photo ? `border-left:3px solid ${a};padding-left:16px;` : ""}">
<div style="font-size:18px;font-weight:bold;color:#111111;">${esc(name)}</div>
${titleLine ? `<div style="color:${a};font-size:14px;">${titleLine}</div>` : ""}
${contacts.length ? `<div style="margin-top:8px;font-size:13px;">${contacts.join(" &nbsp;|&nbsp; ")}</div>` : ""}
${socials.length ? `<div style="margin-top:4px;font-size:13px;">${socials.join(" &nbsp;&middot;&nbsp; ")}</div>` : ""}
</td></tr></table>`;
  }
  if (style === "modern") {
    return `${open}<tr>${photo(88, "16px")}<td style="vertical-align:top;">
<div style="font-size:20px;font-weight:bold;color:#111111;">${esc(name)}</div>
${titleLine ? `<div style="font-size:13px;color:#777777;">${titleLine}</div>` : ""}
<div style="height:2px;width:48px;background:${a};margin:8px 0;font-size:0;line-height:0;">&nbsp;</div>
${contacts.map((c) => `<div style="font-size:13px;">${c}</div>`).join("")}
${socials.length ? `<div style="margin-top:6px;font-size:13px;font-weight:bold;">${socials.join(" &nbsp; ")}</div>` : ""}
</td></tr></table>`;
  }
  if (style === "minimal") {
    return `${open}<tr><td style="vertical-align:top;">
<div style="font-size:15px;color:#111111;"><strong>${esc(name)}</strong>${titleLine ? ` <span style="color:#888888;">&mdash; ${titleLine}</span>` : ""}</div>
${contacts.length ? `<div style="font-size:12px;margin-top:2px;">${contacts.join(" &middot; ")}</div>` : ""}
${socials.length ? `<div style="font-size:12px;">${socials.join(" &middot; ")}</div>` : ""}
</td></tr></table>`;
  }
  // bold
  return `${open}<tr>${f.photo ? `<td style="background:${a};padding:16px;vertical-align:middle;"><img src="${esc(f.photo)}" width="72" height="72" alt="${esc(name)}" style="display:block;border-radius:50%;width:72px;height:72px;object-fit:cover;border:3px solid #ffffff;" /></td>` : ""}<td style="background:${a};padding:16px 22px;vertical-align:middle;color:#ffffff;">
<div style="font-size:20px;font-weight:bold;color:#ffffff;">${esc(name)}</div>
${titleLine ? `<div style="font-size:13px;color:#ffffff;opacity:0.9;">${titleLine}</div>` : ""}
${contacts.length ? `<div style="margin-top:8px;font-size:13px;color:#ffffff;">${contacts.map((c) => c.replace(/color:#[0-9a-f]{6}/i, "color:#ffffff")).join(" &nbsp;|&nbsp; ")}</div>` : ""}
${socials.length ? `<div style="margin-top:4px;font-size:13px;font-weight:bold;">${socials.map((c) => c.replace(/color:#[0-9a-f]{6}/i, "color:#ffffff")).join(" &nbsp;&middot;&nbsp; ")}</div>` : ""}
</td></tr></table>`;
}

function plain(f: Form) {
  return [[f.name, f.title, f.company].filter(Boolean).join(", "), f.phone, f.email, f.website, f.linkedin, f.twitter].filter(Boolean).join("\n");
}

/** Build an email-client-safe HTML signature (inline styles, tables only) and copy it as rich text. */
export function EmailSignature(props: { page?: string }) {
  const initial = STYLES.find((s) => props.page?.toLowerCase().includes(s.id))?.id ?? "classic";
  const [style, setStyle] = useState<Style>(initial);
  const [f, setF] = useState<Form>({
    name: "",
    title: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    photo: "",
    accent: "#6c4df6",
  });
  const [status, setStatus] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const html = build(f, style);

  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));
  const flash = (m: string) => {
    setStatus(m);
    setTimeout(() => setStatus(""), 2000);
  };

  const nudge = useLazurNudge();
  const copyRich = async () => {
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain(f)], { type: "text/plain" }),
          }),
        ]);
        flash("✓ Signature copied. Paste it into your email settings.");
        nudge(true, plain(f));
        return;
      }
    } catch {
      /* fall through to selection copy */
    }
    const el = previewRef.current;
    if (!el) return;
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    sel?.removeAllRanges();
    sel?.addRange(range);
    copyGuard.on = true;
    const ok = document.execCommand("copy");
    copyGuard.on = false;
    sel?.removeAllRanges();
    nudge(ok, plain(f));
    flash(ok ? "✓ Signature copied. Paste it into your email settings." : "Couldn't copy. Select the preview and press Ctrl/Cmd+C.");
  };

  const text = (label: string, key: keyof Form, ph: string, type = "text") => (
    <Field label={label}>
      <input type={type} value={f[key]} onChange={set(key)} placeholder={ph} className={inputClass} />
    </Field>
  );

  // A signature with a name and a way to reach them is a finished result, even before it is copied.
  useMomentWhen(!!f.name.trim() && !!(f.email.trim() || f.phone.trim()), "your signature is ready", 6000);
  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStyle(s.id)}
            className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-[14px] font-medium transition ${style === s.id ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border-strong)] hover:bg-[var(--background-deep)]"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {text(" Name", "name", "Alex Morgan")}
        {text(" Job title", "title", "Head of Growth")}
        {text(" Company", "company", "Acme Inc.")}
        {text(" Phone", "phone", "+1 555 123 4567", "tel")}
        {text(" Email", "email", "alex@acme.com", "email")}
        {text(" Website", "website", "acme.com")}
        {text(" LinkedIn URL", "linkedin", "linkedin.com/in/alex")}
        {text(" Twitter URL", "twitter", "x.com/alex")}
        {text(" Photo URL (optional)", "photo", "https://…/me.jpg")}
        <Field label=" Accent colour">
          <input type="color" value={f.accent} onChange={set("accent")} className="h-12 w-full cursor-pointer rounded-2xl border border-[var(--border-strong)] bg-white p-1" />
        </Field>
      </div>

      <div>
        <h3 className="mb-2 text-[15px] font-semibold"> Live preview</h3>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-strong)] bg-white p-5">
          <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Btn onClick={copyRich}> Copy signature</Btn>
        <CopyBtn text={html} label="Copy HTML code" />
      </div>
      {status ? <Notice>{status}</Notice> : null}
      <Notice>Photos must be a public image link (https). Everything here is built in your browser, nothing is uploaded.</Notice>
    </Panel>
  );
}
