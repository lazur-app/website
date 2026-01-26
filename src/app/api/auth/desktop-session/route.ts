import { db } from "@/db";
import { desktopAuthTokens } from "@/db/schema";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";

const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || "default_auth_secret_for_dev_only_replace_me"
);

export async function POST() {
    try {
        // 1. Try NextAuth session
        const session = await auth();
        let userId = session?.user?.id;

        // 2. If no NextAuth session, check for manual fallback cookie
        if (!userId) {
            const cookieStore = await cookies();
            const manualToken = cookieStore.get("authjs.session-token")?.value;
            if (manualToken) {
                try {
                    const { payload } = await jwtVerify(manualToken, secret);
                    userId = (payload as any).user?.id;
                } catch (e) {
                    console.error("Manual token verification failed", e);
                }
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        await db.insert(desktopAuthTokens).values({
            userId,
            token,
            expiresAt,
        });

        return NextResponse.json({
            desktop_token: token,
            deep_link: `lazur://auth?token=${token}`,
        });
    } catch (error) {
        console.error("Desktop session error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
