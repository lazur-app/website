import { NextResponse } from "next/server";

/** ISO country code from edge / hosting headers. */
function detectCountry(request: Request): string {
  const headers = request.headers;

  const fromEdge =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country-code");

  if (fromEdge && fromEdge !== "XX" && fromEdge !== "T1") {
    return fromEdge.toUpperCase();
  }

  return "US";
}

export async function GET(request: Request) {
  const country = detectCountry(request);
  const region = country === "IN" ? "india" : "international";

  return NextResponse.json(
    { country, region },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
      },
    },
  );
}
