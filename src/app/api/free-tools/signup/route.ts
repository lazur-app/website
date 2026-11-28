import { NextResponse } from "next/server";
import { localKV, localLimitEnabled, whoFrom } from "@/lib/free-tools/limit-server";
import { signUp } from "@/lib/free-tools/limiter";

/** Email sign-up that unlocks more runs. In production the Worker handles this (and stores the email in KV). */
export async function POST(request: Request) {
  if (!localLimitEnabled()) return NextResponse.json({ message: "Sign-up isn't available here." }, { status: 503 });
  const body = (await request.json().catch(() => ({}))) as { email?: string; tool?: string };
  const { who, setCookie } = whoFrom(request);
  const r = await signUp(localKV, who, String(body.email ?? ""), String(body.tool ?? ""));
  const res = NextResponse.json(r.ok ? { ok: true, left: r.left } : { ok: false, message: r.message }, { status: r.ok ? 200 : 400 });
  if (setCookie) res.headers.append("set-cookie", setCookie);
  return res;
}
