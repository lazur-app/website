import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Lazur",
    description: "Terms of Service for the Lazur ambient intelligence platform.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 px-8 py-24 md:py-32 flex justify-center">
            <div className="max-w-2xl w-full">
                <h1 className="text-4xl font-black tracking-tight mb-8">Terms of Service</h1>
                <p className="text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-zinc-600 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">1. Acceptance of Terms</h2>
                        <p>By accessing or using Lazur, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you may not access or use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">2. Use of Service</h2>
                        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">3. Privacy and Data</h2>
                        <p>Your use of the Service is also governed by our Privacy Policy. By using Lazur, you consent to the data practices described in the Privacy Policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">4. Modifications</h2>
                        <p>We reserve the right to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
