"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DesktopAuthPage() {
    const [loading, setLoading] = useState(true);
    const [deepLink, setDeepLink] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const initDesktopSession = async () => {
            try {
                const res = await fetch("/api/auth/desktop-session", {
                    method: "POST",
                });

                if (!res.ok) {
                    throw new Error("Failed to create desktop session. Please sign in again.");
                }

                const data = await res.json();
                setDeepLink(data.deep_link);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initDesktopSession();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    <p className="text-white/60 animate-pulse">Preparing your session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass p-12 rounded-[2.5rem] w-full max-w-lg text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <div className="space-y-4">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-500/20">
                        <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold">You're Signed In</h1>
                    <p className="text-white/60 text-lg max-w-sm mx-auto">
                        Ready to return to Lazur and start using your voice.
                    </p>
                </div>

                {error ? (
                    <p className="text-red-400 bg-red-400/10 py-3 px-4 rounded-xl">{error}</p>
                ) : (
                    <div className="space-y-4">
                        <a
                            href={deepLink}
                            className="btn btn-primary w-full py-4 text-lg inline-block"
                        >
                            Open Lazur App
                        </a>
                        <p className="text-xs text-white/30 italic">
                            Clicking the button will trigger a deep link: {deepLink}
                        </p>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        onClick={() => window.location.href = "/signin"}
                        className="text-white/40 hover:text-white/60 text-sm transition-colors"
                    >
                        Not you? Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}
