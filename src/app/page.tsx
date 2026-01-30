"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles, Command, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function Home() {
    return (
        <div className="min-h-screen bg-aurora selection:bg-orange-200 selection:text-orange-900">
            <Navbar />

            <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Hero Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-orange-700 text-xs font-semibold uppercase tracking-wider mb-8"
                >
                    <Sparkles className="w-3 h-3" />
                    <span>v0.1 Public Beta</span>
                </motion.div>

                {/* Hero Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 max-w-4xl text-balance"
                >
                    The AI dictation tool that <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">reads your mind</span>.
                </motion.h1>

                {/* Hero Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-stone-500 mb-10 max-w-2xl text-balance"
                >
                    Lazur replaces your keyboard with your voice. Speak freely, and let our AI
                    rewrite your rambling thoughts into clear, professional text instantly.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-20"
                >
                    <button className="group relative flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-2xl shadow-stone-900/20">
                        {/* Custom Apple Logo SVG */}
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M17.72 17.51c-.68 1.05-1.4 2.1-2.52 2.13-.98.03-1.33-.58-2.52-.58-1.18 0-1.57.59-2.52.59-1.05-.03-1.85-1.07-2.52-2.15-1.41-2.15-2.48-6.1-1.03-8.62.72-1.25 2.01-2.04 3.42-2.07 1.07-.03 2.09.72 2.75.72.66 0 1.93-.9 3.23-.76 1.1.09 2.13.56 2.76 1.48-2.43 1.25-2.03 4.95.42 6.01-.18.57-.44 1.13-.73 1.69h.01.01l-.03.06zM15.42 5.09c.58-.72.96-1.72.84-2.73-1.01.05-2.07.6-2.73 1.34-.58.68-1.03 1.66-.9 2.65 1.12.09 2.22-.53 2.79-1.26z" />
                        </svg>
                        Download for Mac
                        <span className="absolute -top-3 -right-3 flex h-6 w-6">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 text-[10px] items-center justify-center font-bold border-2 border-white">M1</span>
                        </span>
                    </button>

                    <button className="flex items-center gap-2 text-stone-600 font-medium px-6 py-4 hover:bg-stone-100 rounded-full transition-colors">
                        See how it works <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>

                {/* Visual Demo Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative w-full max-w-5xl aspect-[16/10] bg-white rounded-3xl shadow-2xl shadow-stone-200 border border-stone-200 overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-12 bg-stone-50 border-b border-stone-100 flex items-center px-4 gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                        </div>
                    </div>

                    <div className="mt-12 p-12 grid md:grid-cols-2 gap-12 h-full">
                        {/* Left: Input */}
                        <div className="text-left space-y-4 opacity-50 blur-[1px]">
                            <div className="flex items-center gap-2 text-stone-400 uppercase text-xs font-bold tracking-widest">
                                <Mic className="w-4 h-4" /> Raw Input
                            </div>
                            <p className="text-2xl font-serif leading-relaxed text-stone-800">
                                &quot;Uh hi yeah so I think we should probably maybe try to launch safely like next tuesday if testing is good you know?&quot;
                            </p>
                        </div>

                        {/* Right: Output */}
                        <div className="text-left space-y-4">
                            <div className="flex items-center gap-2 text-orange-500 uppercase text-xs font-bold tracking-widest">
                                <Sparkles className="w-4 h-4" /> Lazur Rewrite
                            </div>
                            <p className="text-2xl font-medium leading-relaxed text-stone-900">
                                &quot;We should aim to launch next Tuesday, provided that testing goes well.&quot;
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                                <Command className="w-3 h-3" /> Copied to clipboard
                            </div>
                        </div>
                    </div>

                    {/* Gradient Overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                </motion.div>

            </main>
        </div>
    );
}
