"use client";

import { useEffect, Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

function CallbackContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [copied, setCopied] = useState(false);

    const fireConfetti = useCallback(() => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#f97316', '#0ea5e9', '#22c55e', '#ffffff'],
            spread: 90,
            gravity: 1,
            scalar: 0.7,
            ticks: 300
        };

        function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }, []);

    const triggerDeepLink = useCallback(async () => {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
            console.log("Found tokens, attempting redirect...");

            localStorage.setItem("lazur_access_token", accessToken);
            localStorage.setItem("lazur_refresh_token", refreshToken);

            try {
                const params = `access_token=${accessToken}&refresh_token=${refreshToken}`;
                await fetch(`http://127.0.0.1:1421?${params}`, { mode: 'no-cors' });
            } catch (e) {
                console.log("Local server not reachable");
            }

            const deepLink = `lazur://auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;

            setTimeout(() => {
                window.location.href = deepLink;
            }, 500);
        } else {
            setStatus("error");
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus("success");
            fireConfetti();
            triggerDeepLink();
        }, 1200);

        return () => clearTimeout(timer);
    }, [searchParams, fireConfetti, triggerDeepLink]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf9] text-zinc-900 overflow-hidden relative font-sans">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                    {status === "success" && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-500/[0.08] rounded-full blur-[140px]"
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-500/[0.08] rounded-full blur-[140px]"
                            />
                        </>
                    )}
                </AnimatePresence>
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/[0.04] rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.04] rounded-full blur-[140px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md px-8 text-center"
            >
                {status === "verifying" ? (
                    <div className="space-y-6">
                        <div className="relative inline-block">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full"
                            />
                            <Loader2 className="w-16 h-16 text-orange-500 animate-spin relative" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-black">Syncing Identity</h1>
                        <p className="text-zinc-500 font-medium">Verifying your account...</p>
                    </div>
                ) : status === "success" ? (
                    <div className="space-y-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200 }}
                            className="relative inline-flex items-center justify-center mb-2"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full"
                            />
                            <div className="w-24 h-24 flex items-center justify-center relative">
                                <img src="/logo.png" alt="Lazur Logo" className="w-full h-full object-contain" />
                            </div>
                        </motion.div>

                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-6xl font-black tracking-tighter text-black"
                            >
                                You're in.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-zinc-500 text-xl font-medium leading-tight max-w-[320px] mx-auto"
                            >
                                You're all set. Save hours every week and <br /> get more done with Lazur.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pt-6 space-y-4"
                        >
                            <button
                                onClick={triggerDeepLink}
                                className="group relative w-full flex items-center justify-center gap-3 rounded-[24px] bg-black px-8 py-6 text-xl font-black text-white transition-all duration-300 hover:bg-zinc-900 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] active:scale-[0.98] shadow-2xl shadow-black/20"
                            >
                                <ExternalLink className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors duration-300" />
                                Return to App
                                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                            </button>

                            <p className="text-zinc-400 text-xs font-semibold tracking-wide uppercase">
                                Syncing with Desktop App...
                            </p>
                        </motion.div>
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
        <Suspense fallback={<div className="min-h-screen bg-[#fafaf9] flex items-center justify-center text-zinc-400 font-medium">Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
