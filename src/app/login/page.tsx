"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
    const handleLogin = (provider: "google" | "github") => {
        // In Phase 1, we redirect to the backend's OAuth endpoint
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        window.location.href = `${backendUrl}/auth/login/${provider}?source=desktop`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] text-zinc-900 selection:bg-orange-200 overflow-hidden relative font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/[0.04] rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/[0.04] rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-sm px-6"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ rotate: -5, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-4 rounded-[28px] bg-white border border-stone-200 shadow-sm mb-8 relative group"
                    >
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <img src="/logo.png" alt="Lazur Logo" className="w-full h-full object-contain" />
                        </div>
                    </motion.div>

                    <h1 className="text-4xl font-bold tracking-tighter mb-4 text-black">
                        Welcome to Lazur
                    </h1>
                    <p className="text-zinc-500 text-base font-medium leading-relaxed">
                        Sign in to sync your superpower <br />
                        <span className="text-zinc-400 italic font-normal">Across all your devices</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin("google")}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-[16px] bg-white border border-stone-200 px-4 py-4 text-sm font-bold text-zinc-900 transition-all hover:bg-stone-50 hover:shadow-md active:scale-[0.98] shadow-sm"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="mt-12 text-center border-t border-stone-200/60 pt-8">
                    <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
                        By continuing, you agree to Lazur's <br />
                        <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-semibold hover:underline cursor-pointer transition-colors">Terms of Service</Link> and <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-semibold hover:underline cursor-pointer transition-colors">Privacy Policy</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
