// @ts-check
/**
 * Minimal Cloudflare R2 uploader (S3 API, AWS Signature V4) with no extra dependencies.
 *
 * Env (set on the cloud environment / .env.local, never committed):
 *   R2_ACCOUNT_ID         Cloudflare account id
 *   R2_ACCESS_KEY_ID      R2 API token: Access Key ID (Object Read & Write on the bucket)
 *   R2_SECRET_ACCESS_KEY  R2 API token: Secret Access Key
 *   R2_BUCKET             bucket name, default "lazur-content-images"
 *   R2_PUBLIC_URL         public base URL of the bucket, default "https://images.lazur.app"
 */
import crypto from "node:crypto";

export const r2Configured = () => Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
export const r2PublicUrl = () => (process.env.R2_PUBLIC_URL || "https://images.lazur.app").replace(/\/$/, "");
const bucket = () => process.env.R2_BUCKET || "lazur-content-images";

/** @param {crypto.BinaryLike} data */
const sha256 = (data) => crypto.createHash("sha256").update(data).digest("hex");
/** @param {crypto.BinaryLike | crypto.KeyObject} key @param {string} data */
const hmac = (key, data) => crypto.createHmac("sha256", key).update(data).digest();

/** RFC 3986 encode each path segment, keep the slashes. @param {string} key */
const encodeKey = (key) =>
  key
    .split("/")
    .map((s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))
    .join("/");

/**
 * PUT one object. Returns its public URL.
 * @param {string} key e.g. content-images/howto/x/y.jpg
 * @param {Buffer} body
 * @param {{ contentType?: string, cacheControl?: string }} [opts]
 */
export async function r2Put(key, body, opts = {}) {
  const account = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secret = process.env.R2_SECRET_ACCESS_KEY;
  if (!account || !accessKey || !secret) throw new Error("R2 is not configured (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).");

  const host = `${account}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${bucket()}/${encodeKey(key)}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // 20260107T120000Z
  const day = amzDate.slice(0, 8);
  const payloadHash = sha256(body);
  /** @type {Record<string, string>} */
  const headers = {
    "cache-control": opts.cacheControl ?? "public, max-age=31536000, immutable",
    "content-type": opts.contentType ?? "image/jpeg",
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  const names = Object.keys(headers).sort();
  const canonicalHeaders = names.map((n) => `${n}:${headers[n]}\n`).join("");
  const signedHeaders = names.join(";");
  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${day}/auto/s3/aws4_request`;
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
  const kSigning = hmac(hmac(hmac(hmac(`AWS4${secret}`, day), "auto"), "s3"), "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(toSign).digest("hex");

  const sendHeaders = Object.fromEntries(Object.entries(headers).filter(([n]) => n !== "host"));
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://${host}${canonicalUri}`, {
      method: "PUT",
      headers: {
        ...sendHeaders,
        authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      },
      body: new Uint8Array(body),
    });
    if (res.ok) return `${r2PublicUrl()}/${encodeKey(key)}`;
    const text = (await res.text()).slice(0, 300);
    if (attempt >= 3 || (res.status < 500 && res.status !== 429)) throw new Error(`R2 PUT ${res.status} for ${key}: ${text}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}
