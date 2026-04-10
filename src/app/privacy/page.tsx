import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Lazur",
    description: "Privacy Policy detailing data usage and security for the Lazur ambient intelligence platform.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 px-8 py-24 md:py-32 flex justify-center">
            <div className="max-w-2xl w-full">
                <h1 className="text-4xl font-black tracking-tight mb-8">Privacy Policy</h1>
                <p className="text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-zinc-600 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">1. Information Collection</h2>
                        <p>Lazur collects ambient intelligence data required to deliver productivity features securely. This includes analytics, transcribed input data locally processed where possible, and account details necessary for functionality.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">2. Use of Information</h2>
                        <p>We use the information we collect to operate, maintain, and improve our services, as well as to develop new features that enhance user productivity.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">3. Data Security</h2>
                        <p>We implement industry-standard encryption and security measures to ensure your data remains protected from unauthorized access at all times.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-3 tracking-tight">4. Third-Party Sharing</h2>
                        <p>We do not sell your personal data. Data is shared with trusted partners only when strictly necessary to provide our service under controlled security protocols.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
