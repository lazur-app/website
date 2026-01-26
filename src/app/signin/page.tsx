"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async (isSignUp: boolean) => {
        setLoading(true);
        setError("");
        const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Authentication failed");
            }

            // If we came from a desktop flow (check search params might be useful later)
            router.push("/desktop-auth");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass p-10 rounded-3xl w-full max-w-md space-y-8 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full" />

                <div className="text-center space-y-2 relative">
                    <h1 className="text-4xl font-bold tracking-tight">Lazur</h1>
                    <p className="text-white/60">The next generation voice assistant</p>
                </div>

                <div className="space-y-4 relative">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={() => handleAuth(false)}
                            disabled={loading || !email}
                            className="btn btn-primary w-full py-3"
                        >
                            {loading ? "Please wait..." : "Continue"}
                        </button>
                        <button
                            onClick={() => handleAuth(true)}
                            disabled={loading || !email}
                            className="text-white/40 hover:text-white/60 text-sm transition-colors py-2"
                        >
                            Don't have an account? Sign Up
                        </button>
                    </div>
                </div>

                <div className="text-center relative">
                    <p className="text-xs text-white/30 truncate">
                        MOCK AUTH MODE ACTIVE
                    </p>
                </div>
            </div>
        </div>
    );
}
