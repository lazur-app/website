"use client";

import { Navbar } from "@/components/Navbar";
import { GridBackground } from "@/components/GridBackground";
import { LeaderboardTable } from "@/components/Leaderboard";
import { ReferralSystem } from "@/components/ReferralSystem";
import { motion } from "framer-motion";

export default function Leaderboard() {
    return (
        <div className="min-h-screen bg-[#fafaf9] selection:bg-orange-200 selection:text-orange-900">
            <GridBackground />
            <Navbar />

            <main className="pt-44 pb-20">
                <div className="px-6 text-center space-y-4 mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tighter">
                        Climb the <span className="text-white bg-orange-500 px-4 py-1 rounded-2xl rotate-3 inline-block shadow-lg shadow-orange-500/20">Leaderboard</span>
                    </h1>
                    <p className="text-stone-500 text-lg font-medium">Invite friends to earn rewards and win cash prizes.</p>

                    <div className="pt-8">
                        <button className="text-stone-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-stone-900 transition-colors">
                            Explore rewards
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <LeaderboardTable />
                <ReferralSystem />
            </main>

            <footer className="py-20 border-t border-stone-200/50 text-center">
                <p className="text-stone-400 text-sm font-medium">© 2026 Lazur AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
