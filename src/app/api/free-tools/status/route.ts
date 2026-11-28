import { NextResponse } from "next/server";
import { localKV, localLimitEnabled, whoFrom } from "@/lib/free-tools/limit-server";
import { standing } from "@/lib/free-tools/limiter";

/** How many free runs are left today. In production the Worker answers this before it gets here. */
export async function GET(request: Request) {
  if (!localLimitEnabled()) return NextResponse.json({ message: "Not available." }, { status: 404 });
  const { who, setCookie } = whoFrom(request);
  const s = await standing(localKV, who);
  const res = NextResponse.json({ left: s.left, limit: s.limit, unlocked: s.unlocked, stage: s.stage, email: s.email, passUntil: s.passUntil });
  if (setCookie) res.headers.append("set-cookie", setCookie);
  return res;
}
