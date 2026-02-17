"use client";

import { motion } from "framer-motion";
import { Copy, Users, Trophy, MessageSquare } from "lucide-react";

export const ReferralSystem = () => {
    return (
        <section className="py-24 px-6 max-w-4xl mx-auto space-y-20">
            {/* Step Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <StepCard
                    icon={<Copy className="w-5 h-5 text-stone-600" />}
                    number="1"
                    title="Share your link"
                    description="Share your referral link with friends and on social media."
                />
                <StepCard
                    icon={<Users className="w-5 h-5 text-emerald-600" />}
                    symbol="✓"
                    number="2"
                    title="Friends join"
                    description="When they sign up with your link, you get 30% of their purchase."
                />
                <StepCard
                    icon={<Trophy className="w-5 h-5 text-orange-600" />}
                    number="3"
                    title="Earn rewards"
                    description="Unlock perks at each milestone you reach."
                />
            </div>

            {/* Milestones Table */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-stone-400 uppercase tracking-widest leading-none">Milestones</h3>
                    <span className="text-sm font-black text-stone-400 uppercase tracking-widest leading-none">Rewards</span>
                </div>

                <div className="divide-y divide-stone-100 border-y border-stone-100">
                    <MilestoneRow threshold="5 invites" reward="Day 1 Badge" />
                    <MilestoneRow threshold="25 invites" reward="1 Month Ultra" />
                    <MilestoneRow threshold="50 invites" reward="Founding Member" />
                    <MilestoneRow threshold="100 invites" reward="3 Months Ultra" />
                    <MilestoneRow threshold="250 invites" reward="4% Lifetime Earning" />
                    <MilestoneRow threshold="1000 invites" reward="Get Hired" isSpecial />
                </div>
                <p className="text-xs text-stone-400 font-medium">* Referrals must subscribe to a Basic plan or higher for the invite to qualify.</p>
            </div>

            {/* Paid to Promote */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 space-y-6">
                <h4 className="text-sm font-black text-stone-900 uppercase tracking-widest">Get Paid to Promote</h4>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-black text-stone-900 leading-tight">Promote on X</p>
                            <p className="text-sm text-stone-500 mt-1">Post about Lazur on X and earn $1 for every 1000 views.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-black text-stone-900 leading-tight">Creator Program</p>
                            <p className="text-sm text-stone-500 mt-1">Have 10k+ followers? You qualify to promote on these platforms too.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ icon, number, title, description, symbol }: any) => (
    <div className="bg-white border border-stone-200 rounded-3xl p-8 space-y-4">
        <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center">
                {icon}
            </div>
            {symbol ? (
                <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{symbol}</div>
            ) : null}
        </div>
        <div className="space-y-2">
            <p className="text-sm font-black text-stone-900 leading-none">{number}. {title}</p>
            <p className="text-sm text-stone-500 leading-relaxed font-medium">{description}</p>
        </div>
    </div>
);

const MilestoneRow = ({ threshold, reward, isSpecial = false }: any) => (
    <div className="flex items-center justify-between py-6">
        <span className="font-black text-stone-900">{threshold}</span>
        <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight ${isSpecial ? 'text-orange-500' : 'text-stone-900'}`}>{reward}</span>
            <div className="w-3.5 h-3.5 border border-stone-300 rounded-full flex items-center justify-center text-stone-300 text-[8px] font-bold">i</div>
        </div>
    </div>
);
