"use client";

import { motion } from "framer-motion";

export const Features = () => {
    return (
        <section className="py-24 px-6 max-w-5xl mx-auto space-y-32">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">From Rambling To Results</h2>
                <p className="text-stone-500 text-lg">The only dictation tool that understands intention, not just words.</p>
            </div>

            <FeatureBlock
                label="Dictate"
                title="Speak Naturally"
                description="No need to be articulate. Just speak your thoughts as they come. Lazur filters out the 'umms', 'ahhs', and verbal clutter in real-time."
                image="/features/dictate.png" // We'll need a placeholder or I can generate something
            />

            <FeatureBlock
                label="Rewrite"
                title="AI-Powered Precision"
                description="Our model analyzes your flow and transforms it into the format you need. Emails, slack messages, or documentation—instantly."
                image="/features/rewrite.png"
                reverse
            />

            <FeatureBlock
                label="Refine"
                title="Perfect the Tone"
                description="Easily adjust the tone and style. Make it more professional, more casual, or shorter with a single click."
                image="/features/refine.png"
            />
        </section>
    );
};

const FeatureBlock = ({ label, title, description, image, reverse = false }: any) => (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
        <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-stone-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                {label}
            </div>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">{title}</h3>
            <p className="text-stone-500 text-lg leading-relaxed">{description}</p>
        </div>
        <div className="flex-1 w-full aspect-video bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xl shadow-stone-200/50 group relative">
            {image ? (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full p-8 bg-stone-50 flex flex-col gap-4">
                    <div className="w-1/2 h-4 bg-stone-200 rounded-full animate-pulse" />
                    <div className="w-full h-4 bg-stone-100 rounded-full animate-pulse delay-75" />
                    <div className="w-3/4 h-4 bg-stone-100 rounded-full animate-pulse delay-150" />
                    <div className="mt-auto flex gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl" />
                        <div className="flex-1 h-12 bg-white border border-stone-200 rounded-xl" />
                    </div>
                </div>
            )}
        </div>
    </div>
);
