"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeamMember } from "@/types/team";
import { fetchTeamMembers } from "@/lib/api";
import TeamCard from "@/components/TeamCard";
import ArmScene from "@/components/RoboticArm";
import AdminPanel from "@/components/AdminPanel";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  
  const [pullingId, setPullingId] = useState<number | null>(null); 
  const [selectedId, setSelectedId] = useState<number | null>(null); 
  
  const [showIntro, setShowIntro] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const refreshData = () => {
    fetchTeamMembers().then(setMembers).catch(console.error);
  };

  useEffect(() => {
    refreshData();
    // Extended to 5.5 seconds to let the entire cinematic sequence breathe
    const timer = setTimeout(() => setShowIntro(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  const selectedMember = members.find((m) => m.id === selectedId);

  const handleCardClick = (id: number) => {
    setPullingId(id);
    // THE FIX: Increased to 1000ms for a slow, dramatic, deliberate card draw
    setTimeout(() => setSelectedId(id), 1000); 
  };

  const handleClose = () => {
    setSelectedId(null);
    setPullingId(null); 
  };

  const isCircleLayout = members.length > 7;

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col font-sans overflow-hidden selection:bg-[#d4ff32] selection:text-black relative">
      <nav className="w-full p-8 flex justify-between items-center z-50 border-b border-white/5 relative">
        <div className="font-black text-2xl tracking-tighter">ARMATRIX<span className="text-[#d4ff32]">.</span></div>
        <div className="flex gap-8 items-center">
          <button 
            onClick={() => setShowAdmin(true)} 
            className="font-mono text-xs text-zinc-600 hover:text-[#d4ff32] uppercase tracking-widest transition-colors"
          >
            [ Admin Uplink ]
          </button>
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Personnel // Directory</div>
        </div>
      </nav>

      <div className="flex-1 relative flex items-center justify-center p-8">
        
        {/* --- 1. THE CINEMATIC INTRO SEQUENCE --- */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              className="absolute inset-0 z-[200] flex items-center justify-center bg-[#030303]"
              // Master fade out for the entire intro container at the very end
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 5, duration: 0.5 }} 
            >
              <div className="relative flex items-center justify-center">
                
                {/* MEET (Rises up late) */}
                <motion.span
                  className="absolute text-3xl md:text-5xl font-black text-zinc-400 uppercase right-[130%]"
                  initial={{ opacity: 0, y: 30 }}
                  // Appears at 3s, stays, rises up and out at 4.5s
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [30, 30, 0, 0, -20] }}
                  transition={{ times: [0, 0.55, 0.65, 0.9, 1], duration: 5.5 }}
                >
                  Meet
                </motion.span>

                {/* THE (The Anchor Point) */}
                <motion.span
                  className="text-5xl md:text-7xl font-black text-[#d4ff32] uppercase z-10 drop-shadow-[0_0_20px_rgba(212,255,50,0.4)]"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 1, 0], // Fades in instantly
                    x: [0, 0, -80, -80, 0, 0], // Center -> Shift Left -> Wait -> Shift Center
                    y: [0, 0, 0, 0, 0, -20]
                  }}
                  transition={{ times: [0, 0.1, 0.25, 0.4, 0.55, 1], duration: 5.5, ease: "easeInOut" }}
                >
                  THE
                </motion.span>

                {/* TEAM (Slides in, fades out early) */}
                <motion.span
                  className="absolute text-5xl md:text-7xl font-black text-white uppercase left-1/2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: [0, 0, 1, 1, 0, 0], // Fades in next to THE, then fades out early
                    x: [20, 20, 50, 50, 50, 50]
                  }}
                  transition={{ times: [0, 0.15, 0.3, 0.45, 0.55, 1], duration: 5.5, ease: "easeOut" }}
                >
                  TEAM
                </motion.span>

                {/* MEMBERS (Rises up late) */}
                <motion.span
                  className="absolute text-3xl md:text-5xl font-black text-zinc-400 uppercase left-[130%]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [30, 30, 0, 0, -20] }}
                  transition={{ times: [0, 0.55, 0.65, 0.9, 1], duration: 5.5 }}
                >
                  Members
                </motion.span>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 2. THE DYNAMIC LAYOUT --- */}
        <div className={`relative w-full max-w-6xl h-[700px] flex justify-center items-center z-10 transition-opacity duration-700 ${selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {!showIntro && isCircleLayout && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <h1 className="text-[100px] md:text-[140px] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 via-zinc-600 to-[#030303] drop-shadow-2xl opacity-40">
                THE TEAM
              </h1>
            </motion.div>
          )}

          {!showIntro && members.map((member, i) => {
            const isPulled = pullingId === member.id && !selectedId;
            let rotate = 0, x = 0, y = 0;

            if (isCircleLayout) {
              const angle = (i / members.length) * (Math.PI * 2) - Math.PI / 2; 
              const radius = 260 + (isPulled ? 60 : 0); 
              x = Math.cos(angle) * radius;
              y = Math.sin(angle) * radius;
              rotate = angle * (180 / Math.PI) + 90; 
            } else {
              const midIndex = (members.length - 1) / 2;
              const offset = i - midIndex; 
              rotate = offset * 12; 
              x = offset * 140; 
              y = Math.abs(offset) * 20 - (isPulled ? 100 : 0); 
            }

            return (
              <motion.div 
                key={member.id}
                className="absolute origin-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: selectedId && selectedId !== member.id ? 0 : 1, 
                  x: selectedId ? 0 : x,
                  y: selectedId ? 0 : y,
                  rotate: selectedId ? 0 : rotate,
                  scale: isPulled ? 1.05 : (selectedId && selectedId !== member.id ? 0.8 : 1),
                  zIndex: isPulled || selectedId === member.id ? 50 : 10 + i
                }}
                transition={{ 
                  // THE FIX: isPulled duration extended to match the slow 1-second setTimeout
                  duration: isPulled ? 1.0 : 0.85, 
                  ease: [0.16, 1, 0.3, 1], 
                  delay: (selectedId || pullingId) ? 0 : i * 0.1 
                }}
                style={{ pointerEvents: (selectedId || pullingId) ? 'none' : 'auto' }}
              >
                <motion.div 
                  animate={{ y: (selectedId || pullingId) ? 0 : [0, -10, 0] }} 
                  transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                >
                  <TeamCard member={member} isSelected={false} onClick={() => handleCardClick(member.id)} />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* --- 3. THE DECRYPTION VIEW --- */}
        <AnimatePresence>
          {selectedMember && (
            <div className="absolute inset-0 flex items-center justify-center w-full max-w-6xl mx-auto px-8 z-[60]">
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 z-[100] pointer-events-none"
              >
                <ArmScene isAlert={isAlert} />
              </motion.div>

              <div className="w-1/2 flex justify-end pr-12 relative z-[120]">
                <TeamCard member={selectedMember} isSelected={true} onClick={() => {}} />
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-1/2 flex flex-col relative z-[120] max-h-full justify-center"
                onMouseEnter={() => setIsAlert(true)} onMouseLeave={() => setIsAlert(false)}
              >
                <button 
                  onClick={handleClose}
                  className="group self-start mb-12 flex items-center gap-4 text-zinc-500 hover:text-[#d4ff32] transition-colors cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                >
                  <svg width="30" height="12" viewBox="0 0 40 12" className="overflow-visible">
                    <path d="M0,6 C10,-4 30,16 40,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                  <span className="font-mono text-xs uppercase tracking-widest text-white group-hover:text-[#d4ff32] transition-colors">
                    Close Interface
                  </span>
                  <svg width="30" height="12" viewBox="0 0 40 12" className="overflow-visible scale-x-[-1]">
                    <path d="M0,6 C10,-4 30,16 40,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                </button>
                
                {/* THE FIX: Real Metallic Silver Chrome Text Effect */}
                <h1 
                  className="text-6xl font-black tracking-tighter uppercase leading-none mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  style={{
                    background: "linear-gradient(to bottom, #FFFFFF 0%, #D1D5DB 40%, #111827 50%, #4B5563 52%, #F3F4F6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {selectedMember.name}
                </h1>
                
                <h2 className="text-2xl font-mono uppercase tracking-widest text-[#d4ff32] mb-8">{selectedMember.role}</h2>
                
                {/* THE FIX: Bio text wrapping and strict 4-line truncation */}
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-light break-words whitespace-normal overflow-hidden text-ellipsis line-clamp-4">
                  {selectedMember.bio}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAdmin && <AdminPanel members={members} onClose={() => setShowAdmin(false)} onRefresh={refreshData} />}
      </AnimatePresence>
    </main>
  );
}