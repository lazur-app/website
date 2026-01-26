import Link from "next/link";
import { ArrowRight, Sparkles, AudioLines, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-5xl px-6 py-20 relative">

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Hero Header */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-bold text-white/40 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:bg-white/5 transition-all cursor-default tracking-[0.15em] uppercase shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
        New: AI Dictation Engine v2.0
      </div>

      <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 leading-[1.05]">
        Dictation that feels <br className="hidden md:block" /> like magic.
      </h1>

      <p className="text-lg md:text-xl text-white/30 mb-14 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 font-medium">
        Lazur uses state-of-the-art neural engines to transcribe your thoughts into perfect text,
        available across every app on your OS.
      </p>

      <div className="flex flex-col sm:flex-row gap-5 w-full justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 mb-32">
        <Link href="/signin" className="btn-primary px-12 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.3)]">
          Get Started for Free
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <button className="btn-secondary px-12 group">
          <span>Download Desktop App</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
        </button>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="p-10 rounded-[2.5rem] glass group transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] blur-[40px] rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
            <Zap className="w-7 h-7 text-blue-400 group-hover:text-blue-300" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-white tracking-tight">Zero-Latency Sync</h3>
          <p className="text-white/30 leading-relaxed text-[0.9375rem] font-medium">Dictate effortlessly. Watch text appear as you speak, with deep OS-level integration.</p>
        </div>

        <div className="p-10 rounded-[2.5rem] glass group transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.02] blur-[40px] rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
            <AudioLines className="w-7 h-7 text-purple-400 group-hover:text-purple-300" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-white tracking-tight">Neural Intelligence</h3>
          <p className="text-white/30 leading-relaxed text-[0.9375rem] font-medium">Context-aware transcription that adapts to technical jargon and unique user accents.</p>
        </div>

        <div className="p-10 rounded-[2.5rem] glass group transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] blur-[40px] rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
            <ShieldCheck className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-white tracking-tight">Privacy Vault</h3>
          <p className="text-white/30 leading-relaxed text-[0.9375rem] font-medium">Your data stays your data. End-to-end encryption for every syllable spoken.</p>
        </div>
      </div>
    </div>
  );
}
