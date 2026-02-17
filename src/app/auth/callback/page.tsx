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

            // Store in localStorage for the website's own use (e.g. Pricing page)
            localStorage.setItem("lazur_access_token", accessToken);
            localStorage.setItem("lazur_refresh_token", refreshToken);

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf9] text-zinc-900 overflow-hidden relative font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/[0.04] rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.04] rounded-full blur-[140px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-sm px-8 text-center"
            >
                {status === "verifying" ? (
                    <div className="space-y-6">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full animate-pulse" />
                            <Loader2 className="w-16 h-16 text-orange-500 animate-spin relative" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-black">Syncing Identity</h1>
                        <p className="text-zinc-500 font-medium">Verifying your account...</p>
                    </div>
                ) : status === "success" ? (
                    <div className="space-y-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex p-4 bg-green-500/[0.06] rounded-[28px] border border-green-500/10 mb-2"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </motion.div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tighter text-black">Success!</h1>
                            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                                You're signed in to Lazur. <br />
                                <span className="text-zinc-400 font-normal">The desktop app should open automatically.</span>
                            </p>
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                onClick={triggerDeepLink}
                                className="group relative w-full flex items-center justify-center gap-3 rounded-[20px] bg-black px-6 py-5 text-lg font-bold text-white transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/10"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Open Lazur Desktop
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>

                            <p className="text-zinc-400 text-sm font-medium">
                                Not working? Ensure Lazur is running on your Mac.
                            </p>
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
