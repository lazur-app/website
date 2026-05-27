"use client";

import { motion as m } from "framer-motion";
import { Check, Sparkles, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        price: "$0",
        description:
            "Try Lazur without a meter running on minutes — a generous monthly word budget for light use.",
        buttonText: "Current Plan",
        features: [
            "5,000 AI-polished words / month",
            "Standard rewriting & formatting",
            "Magic Mode preview (included in word budget)",
            "1 Mac · community support",
        ],
        icon: Zap,
        popular: false,
    },
    {
        name: "Basic",
        price: "$10",
        period: "/ month",
        description:
            "For people who speak all day — a large monthly word allowance so you rarely think about limits.",
        buttonText: "Upgrade to Basic",
        features: [
            "150,000 AI-polished words / month",
            "Magic Mode™ context-aware rewrites",
            "Unlimited devices",
            "High-priority cloud polish",
            "Custom vocabulary support",
            "Priority support",
        ],
        icon: Sparkles,
        popular: true,
    },
];

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async (planName: string) => {
        if (planName === "Free") return;

        setLoading(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("lazur_access_token") : null;
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase}/billing/create-checkout-session?plan_type=basic`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const { url } = await response.json();
                if (url) {
                    window.location.href = url;
                }
            } else {
                // If token expired or unauthorized
                window.location.href = "/login";
            }
        } catch (err) {
            console.error("Billing error:", err);
            window.location.href = "/login";
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] grain selection:bg-orange-100">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <m.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-6xl"
                    >
                        Simple, transparent{" "}
                        <span className="gradient-word">pricing</span>.
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[var(--foreground-muted)] text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Pay for polished output — word counts reset each month so you always know where you stand.
                    </m.p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
                    {plans.map((plan, idx) => (
                        <m.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className={`relative group bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-stone-200 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl ${plan.popular ? 'border-orange-500/20 ring-4 ring-orange-500/5' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed pr-8">{plan.description}</p>
                                </div>
                                <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-600'}`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-10">
                                <span className="text-6xl font-bold text-stone-900">{plan.price}</span>
                                {plan.period && (
                                    <span className="text-stone-400 font-medium text-xl">{plan.period}</span>
                                )}
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className={`p-0.5 rounded-full ${plan.popular ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-600'}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-stone-600 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade(plan.name)}
                                disabled={loading || plan.name === "Free"}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${plan.name === "Free"
                                    ? 'bg-stone-100 text-stone-400 cursor-default'
                                    : 'bg-stone-900 text-white hover:bg-black shadow-lg shadow-stone-900/10'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Redirecting..." : plan.buttonText}
                            </button>
                        </m.div>
                    ))}
                </div>

                {/* Bottom Trust Section */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 flex flex-wrap justify-center gap-12 text-stone-400"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Secure SSL Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Privacy First AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Worldwide Support</span>
                    </div>
                </m.div>
            </main>
        </div>
    );
}
