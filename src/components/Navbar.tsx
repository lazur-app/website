"use client";

import { Mic } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const isLeaderboard = pathname === '/leaderboard';

    return (
        <div className="fixed top-8 left-0 right-0 z-50 px-6 pointer-events-none">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl border border-stone-200/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] pointer-events-auto"
            >
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-white border border-stone-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden p-1.5">
                        <img src="/logo.png" alt="Lazur Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-stone-900 uppercase">Lazur</span>
                </Link>

                <div className="flex items-center gap-2">
                    {isLeaderboard ? (
                        <Link
                            href="/"
                            className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95"
                        >
                            Whitelist
                        </Link>
                    ) : (
                        <Link
                            href="/leaderboard"
                            className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95"
                        >
                            Leaderboard
                        </Link>
                    )}
                </div>
            </motion.nav>
        </div>
    );
}
