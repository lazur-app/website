"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

const USERS = [
    { rank: 1, name: "leifstrand", invites: 183, color: "bg-stone-900" },
    { rank: 2, name: "victortenold", invites: 156, color: "bg-stone-200" },
    { rank: 3, name: "AlexG", invites: 23, color: "bg-stone-100" },
    { rank: 4, name: "SarahConnor", invites: 18 },
    { rank: 5, name: "MarcusAurelius", invites: 15 },
    { rank: 6, name: "ElenaFisher", invites: 12 },
    { rank: 7, name: "ArthurMorgan", invites: 8 },
    { rank: 8, name: "JoelMiller", invites: 5 },
];

export const LeaderboardTable = () => {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-12">
            {/* Podium */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 pt-20">
                {/* 2nd */}
                <div className="order-2 md:order-1 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">$350</span>
                        <span className="block font-black text-stone-900 leading-none">{USERS[1].name}</span>
                        <span className="block text-xs font-medium text-stone-400 mt-1">{USERS[1].invites} invites</span>
                    </div>
                    <div className="w-48 h-32 bg-stone-200 rounded-t-3xl flex items-center justify-center text-4xl font-black text-white">2</div>
                </div>

                {/* 1st */}
                <div className="order-1 md:order-2 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <span className="block text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">$500</span>
                        <span className="block font-black text-stone-900 text-lg leading-none">{USERS[0].name}</span>
                        <span className="block text-xs font-medium text-stone-400 mt-1">{USERS[0].invites} invites</span>
                    </div>
                    <div className="w-56 h-48 bg-stone-900 rounded-t-[40px] flex items-center justify-center text-5xl font-black text-white relative shadow-2xl">
                        1
                        <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg rotate-12 shadow-lg">WINNER</div>
                    </div>
                </div>

                {/* 3rd */}
                <div className="order-3 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">$150</span>
                        <span className="block font-black text-stone-900 leading-none">{USERS[2].name}</span>
                        <span className="block text-xs font-medium text-stone-400 mt-1">{USERS[2].invites} invites</span>
                    </div>
                    <div className="w-48 h-24 bg-stone-100 rounded-t-3xl border-x border-t border-stone-200 flex items-center justify-center text-3xl font-black text-stone-300">3</div>
                </div>
            </div>

            {/* Search */}
            <div className="relative group max-w-2xl mx-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-14 pr-6 font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-sm"
                />
            </div>

            {/* List */}
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 px-8 py-4 bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-8">User</div>
                    <div className="col-span-3 text-right">Invites</div>
                </div>
                <div className="divide-y divide-stone-100">
                    {USERS.map((user) => (
                        <div key={user.rank} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-stone-50 transition-colors group">
                            <div className="col-span-1 font-black text-stone-300 group-hover:text-stone-900 transition-colors">{user.rank}</div>
                            <div className="col-span-8 font-black text-stone-900 tracking-tight">{user.name}</div>
                            <div className="col-span-3 text-right font-bold text-stone-400 group-hover:text-orange-500 transition-colors">{user.invites}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
