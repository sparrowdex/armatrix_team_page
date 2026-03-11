"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-8 font-sans selection:bg-[#d4ff32] selection:text-black">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4ff32]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl w-full z-10"
      >
        <header className="mb-16 border-l-4 border-[#d4ff32] pl-8">
          <div className="font-mono text-[#d4ff32] text-sm tracking-[0.3em] uppercase mb-2 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff32] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff32]"></span>
            </span>
            System Status: Operational
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Armatrix<span className="text-[#d4ff32]">.</span>
          </h1>
          <p className="text-zinc-400 text-xl md:text-2xl mt-4 font-light max-w-2xl">
            {/* UPDATED: Changed to Team Page to match your task requirement */}
            Advanced Personnel Management & Team Page Interface.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <section className="space-y-6">
            <div className="group">
              <h3 className="text-[#d4ff32] font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-[#d4ff32] rounded-full" />
                01. Interaction
              </h3>
              <p className="text-zinc-300">
                Experience the <span className="text-white font-medium">Mechanical Shutter</span> card system and a real-time <span className="text-white font-medium">3D Robotic Arm</span> probe.
              </p>
            </div>
            
            <div className="group">
              <h3 className="text-[#d4ff32] font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-[#d4ff32] rounded-full" />
                02. Backend Connectivity
              </h3>
              <p className="text-zinc-300">
                Fully integrated <span className="text-white font-medium">FastAPI</span> backend with in-memory persistence and comprehensive CRUD capabilities via the Admin Uplink.
              </p>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-center backdrop-blur-sm relative overflow-hidden group hover:border-[#d4ff32]/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-700 uppercase">
              Ref: PRT-COL // 080
            </div>
            <p className="text-sm text-zinc-400 font-mono mb-8 italic">
              &quot;Access the secure directory to manage the elite Armatrix operational team members.&quot;
            </p>
            <Link 
              href="/team" 
              className="w-full bg-[#d4ff32] text-black text-center py-4 font-black uppercase tracking-widest hover:bg-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Enter Directory
            </Link>
          </section>
        </div>

        <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 font-mono text-[10px] uppercase tracking-tighter">
          <div className="flex gap-6">
            <span>Built with Next.js 15</span>
            <span>FastAPI v0.115</span>
            <span>Three.js / Fiber</span>
          </div>
          <a 
            href="https://github.com/sparrowdex" 
            target="_blank" 
            className="hover:text-[#d4ff32] transition-colors"
          >
            [ Source: Github ]
          </a>
        </footer>
      </motion.div>
    </main>
  );
}