"use client";

import { motion } from "framer-motion";
import { Mic, ChevronRight } from "lucide-react";
import { useState } from "react";

export const EarlyAccessHero = () => {
    const [username, setUsername] = useState("");

    return (
        <section className="pt-44 pb-20 px-6 flex flex-col items-center">
            {/* Logo and Center Icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-white border border-stone-200 rounded-3xl shadow-xl flex items-center justify-center mb-8 relative p-4"
            >
                <img src="/logo.png" alt="Lazur Logo" className="w-full h-full object-contain" />
            </motion.div>

            {/* Status Badge */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-600 text-xs font-semibold mb-10 shadow-sm"
            >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Available in early 2026
            </motion.div>

            {/* Headline */}
            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-black text-stone-900 mb-6 text-center tracking-tight"
            >
                Get early access
            </motion.h1>

            {/* Subtext */}
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-stone-500 text-lg mb-12 text-center max-w-lg leading-relaxed"
            >
                Be amongst the first to experience Lazur. Claim your username before launch and skip the queue.
            </motion.p>

            {/* Username Selection */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md relative group"
            >
                <div className="flex items-center gap-2 p-1.5 bg-white border border-stone-200 rounded-2xl shadow-sm focus-within:border-orange-500/50 transition-colors">
                    <div className="pl-4 text-stone-400 font-medium">@</div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="flex-1 bg-transparent border-none outline-none text-stone-900 font-medium placeholder:text-stone-300"
                    />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-[14px] font-bold text-sm transition-all active:scale-95 shadow-lg shadow-orange-500/20">
                        Claim username
                    </button>
                </div>

                {/* Floating Avatars (Mock) */}
                <div className="absolute -left-32 top-0 hidden lg:block">
                    <CursorAvatar name="Travis" color="bg-blue-500" />
                </div>
                <div className="absolute -right-32 bottom-0 hidden lg:block">
                    <CursorAvatar name="John" color="bg-emerald-500" />
                </div>
            </motion.div>

            {/* Whitelist Count */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col items-center gap-3"
            >
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafaf9] bg-stone-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#fafaf9] bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                        2.6K
                    </div>
                </div>
                <p className="text-stone-400 text-sm font-medium">
                    2674+ users have already joined the whitelist.
                </p>
            </motion.div>

            {/* Countdown */}
            <div className="mt-16 flex gap-12 text-center">
                <CountdownItem value="25" label="Days" />
                <div className="w-px h-12 bg-stone-200 self-center" />
                <CountdownItem value="11" label="Hours" />
                <div className="w-px h-12 bg-stone-200 self-center" />
                <CountdownItem value="42" label="Minutes" />
                <div className="w-px h-12 bg-stone-200 self-center" />
                <CountdownItem value="42" label="Seconds" />
            </div>
        </section>
    );
};

const CountdownItem = ({ value, label }: { value: string, label: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-3xl font-black text-stone-900 tabular-nums tracking-tighter">{value}</span>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
);

const CursorAvatar = ({ name, color }: { name: string, color: string }) => (
    <div className="flex items-center gap-2 p-1.5 bg-white border border-stone-200 rounded-xl shadow-lg animate-bounce duration-[2000ms]">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white text-[10px]`}>
            {name[0]}
        </div>
        <span className="text-sm font-bold text-stone-800 pr-2">{name}</span>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-stone-800 rotate-45" />
    </div>
);
