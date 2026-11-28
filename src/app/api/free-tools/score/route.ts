import { NextResponse } from "next/server";
import { localKV, localLimitEnabled, whoFrom } from "@/lib/free-tools/limit-server";
import { readStats, recordScore } from "@/lib/free-tools/stats";

/** Score stats for local development. In production the Worker answers this (edge/src/index.ts). */
export async function GET(request: Request) {
  if (!localLimitEnabled()) return NextResponse.json({ message: "Not available." }, { status: 404 });
  const tool = new URL(request.url).searchParams.get("tool") ?? "";
  return NextResponse.json((await readStats(localKV, tool)) ?? { message: "Unknown tool." }, { status: 200 });
}

export async function POST(request: Request) {
  if (!localLimitEnabled()) return NextResponse.json({ message: "Not available." }, { status: 404 });
  const { who, setCookie } = whoFrom(request);
  const body = (await request.json().catch(() => ({}))) as { tool?: string; value?: number };
  const tool = String(body.tool ?? "");
  await recordScore(localKV, tool, Number(body.value), who.dev);
  const res = NextResponse.json((await readStats(localKV, tool)) ?? { message: "Unknown tool." });
  if (setCookie) res.headers.append("set-cookie", setCookie);
  return res;
}
