import { db } from "@/db";
import { desktopAuthTokens, users, appSessions } from "@/db/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing token" }, { status: 400, headers: corsHeaders });
        }

        const token = authHeader.split(" ")[1];

        // Find valid token
        const authToken = await db.query.desktopAuthTokens.findFirst({
            where: and(
                eq(desktopAuthTokens.token, token),
                gt(desktopAuthTokens.expiresAt, new Date()),
                isNull(desktopAuthTokens.usedAt)
            ),
        });

        if (!authToken) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders });
        }

        // Mark token as used
        await db
            .update(desktopAuthTokens)
            .set({ usedAt: new Date() })
            .where(eq(desktopAuthTokens.id, authToken.id));

        // Get user details
        const user = await db.query.users.findFirst({
            where: eq(users.id, authToken.userId),
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
        }

        // Generate long-lived session token for the app
        const sessionToken = uuidv4();
        await db.insert(appSessions).values({
            userId: user.id,
            sessionToken,
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
            },
            session_token: sessionToken,
        }, { headers: corsHeaders });
    } catch (error) {
        console.error("Verify desktop error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
    }
}
