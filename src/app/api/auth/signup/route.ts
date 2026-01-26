import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || "default_auth_secret_for_dev_only_replace_me"
);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if user exists
        let user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            // Create user
            const [newUser] = await db
                .insert(users)
                .values({
                    email,
                    authProvider: "email",
                })
                .returning();
            user = newUser;
        }

        // Create a manual session cookie that our desktop-session endpoint can read
        // Note: NextAuth uses its own session management, but we'll use a simple JWT 
        // for this fallback email flow to keep it working without complex Magic Link setup.
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const token = await new SignJWT({ user: { id: user.id, email: user.email }, expires })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set("authjs.session-token", token, { // Use naming similar to Auth.js for simplified detection
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return NextResponse.json({
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
