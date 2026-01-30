"use client";

import { Mic } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md border-b border-stone-200/50">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                    <Mic className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-stone-800">Lazur</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
                <Link href="/#features" className="hover:text-stone-900 transition-colors">Features</Link>
                <Link
                    href="/pricing"
                    className={`transition-colors ${pathname === '/pricing' ? 'text-black font-bold' : 'hover:text-stone-900'}`}
                >
                    Pricing
                </Link>
                <Link href="/login" className="hover:text-stone-900 transition-colors">Log in</Link>
            </div>
            <button className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xl">
                Download
            </button>
        </nav>
    );
}
