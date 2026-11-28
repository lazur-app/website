import { NextResponse } from "next/server";
import { localKV, localLimitEnabled, whoFrom } from "@/lib/free-tools/limit-server";
import { checkFeedback, claimPass } from "@/lib/free-tools/limiter";

/**
 * "I've sent feedback": checks with the Lazur backend and gives the 20-day pass. In production the
 * Worker handles this. Locally, FREE_TOOLS_FAKE_FEEDBACK=1 pretends the feedback is there.
 */
export async function POST(request: Request) {
  if (!localLimitEnabled()) return NextResponse.json({ ok: false, message: "Not available here." }, { status: 503 });
  const { who, setCookie } = whoFrom(request);
  const fake = process.env.FREE_TOOLS_FAKE_FEEDBACK === "1";
  const r = await claimPass(localKV, who, (email) => (fake ? Promise.resolve(true) : checkFeedback(email, process.env.LAZUR_API_URL, process.env.FREE_TOOLS_INTERNAL_KEY)));
  const res = NextResponse.json(r, { status: r.ok ? 200 : 400 });
  if (setCookie) res.headers.append("set-cookie", setCookie);
  return res;
}
