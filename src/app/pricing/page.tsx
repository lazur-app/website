"use client";

import { motion as m } from "framer-motion";
import { Check, Sparkles, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { hasValidSessionToken } from "@/lib/auth";
import { loginPathWithReturn } from "@/lib/returnTo";

const plans = [
    {
        name: "Free",
        price: "$0",
        planType: null,
        description:
            "Try Lazur without a meter running on minutes — a generous monthly word budget for light use.",
        buttonText: "Current Plan",
        features: [
            "5,000 AI-polished words / month",
            "Standard rewriting & formatting",
            "Smart Rewrite preview (included in word budget)",
            "1 Mac · community support",
        ],
        icon: Zap,
        popular: false,
    },
    {
        name: "Pro",
        price: "$10",
        period: "/ month",
        planType: "pro",
        description:
            "For daily knowledge workers — large word allowance plus Command Mode for voice-driven writing.",
        buttonText: "Upgrade to Pro",
        features: [
            "150,000 AI-polished words / month",
            "Command Mode — 30 voice commands / month",
            "Smart Rewrite — context-aware rewrites",
            "Unlimited devices",
            "Priority support",
        ],
        icon: Sparkles,
        popular: true,
    },
    {
        name: "Power",
        price: "$25",
        period: "/ month",
        planType: "power",
        description:
            "For heavy writers and engineers — maximum words and Command Mode for all-day use.",
        buttonText: "Upgrade to Power",
        features: [
            "500,000 AI-polished words / month",
            "Command Mode — 200 voice commands / month",
            "Smart Rewrite — context-aware rewrites",
            "Unlimited devices",
            "Priority support",
        ],
        icon: Cpu,
        popular: false,
    },
];

export default function PricingPage() {
    const handleUpgrade = (planType: string | null) => {
        if (!planType) return;

        if (!hasValidSessionToken()) {
            window.location.href = loginPathWithReturn("/billing");
            return;
        }

        window.location.href = `/billing?plan=${planType}`;
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
                <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
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
                                onClick={() => handleUpgrade(plan.planType)}
                                disabled={!plan.planType}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${!plan.planType
                                    ? 'bg-stone-100 text-stone-400 cursor-default'
                                    : 'bg-stone-900 text-white hover:bg-black shadow-lg shadow-stone-900/10'
                                    }`}
                            >
                                {plan.buttonText}
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
