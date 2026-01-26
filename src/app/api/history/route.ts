import { db } from "@/db";
import { appSessions, transcriptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionToken = authHeader.split(" ")[1];
        const session = await db.query.appSessions.findFirst({
            where: eq(appSessions.sessionToken, sessionToken),
        });

        if (!session) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const history = await db.query.transcriptions.findMany({
            where: eq(transcriptions.userId, session.userId),
            orderBy: [desc(transcriptions.createdAt)],
            limit: 50,
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error("History Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
