"use client";

import { Navbar } from "@/components/Navbar";
import { GridBackground } from "@/components/GridBackground";
import { EarlyAccessHero } from "@/components/EarlyAccessHero";
import { Features } from "@/components/Features";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#fafaf9] selection:bg-orange-200 selection:text-orange-900">
            <GridBackground />
            <Navbar />

            <main>
                <EarlyAccessHero />
                <Features />
            </main>

            <footer className="py-20 border-t border-stone-200/50 text-center">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:opacity-100 transition-all duration-500">
                    <div className="w-8 h-8 bg-white border border-stone-200 rounded-lg flex items-center justify-center p-1 shadow-sm">
                        <img src="/logo.png" alt="Lazur Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-stone-900">Lazur</span>
                </div>
                <p className="text-stone-400 text-sm">© 2026 Lazur AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
