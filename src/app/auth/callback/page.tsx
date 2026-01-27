"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";

function CallbackContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

    const [copied, setCopied] = useState(false);

    const triggerDeepLink = async () => {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
            console.log("Found tokens, attempting redirect...");

            // Priority 1: Local HTTP Server (Silent & Instant)
            try {
                const params = `access_token=${accessToken}&refresh_token=${refreshToken}`;
                // We use a small timeout so we don't block the deep link if local fails
                await fetch(`http://127.0.0.1:1421?${params}`, { mode: 'no-cors' });
                console.log("Local server ping sent");
            } catch (e) {
                console.log("Local server not reachable");
            }

            // Priority 2: Custom Protocol (Triggers the "Open Lazur?" popup)
            const deepLink = `lazur://auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;

            // Short delay ensures the fetch doesn't get cancelled by the navigation
            setTimeout(() => {
                window.location.href = deepLink;
            }, 100);
        } else {
            setStatus("error");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus("success");
            triggerDeepLink();
        }, 1500);

        return () => clearTimeout(timer);
    }, [searchParams]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md px-8 text-center"
            >
                {status === "verifying" ? (
                    <div className="space-y-6">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
                            <Loader2 className="w-16 h-16 text-orange-500 animate-spin relative" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Syncing Identity</h1>
                        <p className="text-zinc-400">Verifying your account with Google...</p>
                    </div>
                ) : status === "success" ? (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex p-4 bg-green-500/10 rounded-full border border-green-500/20 mb-2"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </motion.div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight">Success!</h1>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                You're signed in to Lazur. The desktop app should open automatically.
                            </p>
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                onClick={triggerDeepLink}
                                className="group relative w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-lg font-bold text-zinc-950 transition-all hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Open Lazur Desktop
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>

                            <p className="text-zinc-500 text-sm">
                                Not working? Ensure Lazur is running on your Mac.
                            </p>

                            {/* Debug Section */}
                            <div className="mt-12 pt-8 border-t border-white/5 text-left">
                                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Debug Info (Development Only)</p>
                                <div className="space-y-2 font-mono text-[10px] bg-black/40 p-4 rounded-xl border border-white/5">
                                    <p className="text-zinc-500">Access Token: <span className="text-orange-500/80">{searchParams.get("access_token")?.substring(0, 15)}...</span></p>
                                    <p className="text-zinc-500">Refresh Token: <span className="text-orange-500/80">{searchParams.get("refresh_token")?.substring(0, 15)}...</span></p>
                                    <p className="text-zinc-500">Scheme: <span className="text-green-500/80">lazur://</span></p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(searchParams.get("access_token") || "")}
                                    className="mt-4 text-[10px] bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    {copied ? "Copied Access Token!" : "Copy Access Token"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
                        <p className="text-zinc-400">Tokens were not received correctly. Please try signing in again.</p>
                        <a href="/login" className="text-orange-500 underline">Back to Login</a>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
