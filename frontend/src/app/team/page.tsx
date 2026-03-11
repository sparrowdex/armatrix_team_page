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
  
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
  const [isAlert, setIsAlert] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const refreshData = () => {
    fetchTeamMembers().then(setMembers).catch(console.error);
  };

  useEffect(() => {
    refreshData();
    
    const t1 = setTimeout(() => setIntroStep(1), 600);    
    const t2 = setTimeout(() => setIntroStep(2), 2200);   
    const t3 = setTimeout(() => setIntroStep(3), 4000);   
    const t4 = setTimeout(() => setIntroStep(4), 5200);   
    const t5 = setTimeout(() => setIntroStep(5), 7000);   
    const t6 = setTimeout(() => setShowIntro(false), 7600); 

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
    };
  }, []);

  const selectedMember = members.find((m) => m.id === selectedId);

  const handleCardClick = (id: number) => {
    setPullingId(id);
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
        
        <div className="flex items-center">
          {/* THE FIX: Chasing Light Border Effect */}
          <div 
            className="relative group rounded-full overflow-hidden p-[1px] cursor-pointer shadow-[0_0_10px_rgba(212,255,50,0.1)] hover:shadow-[0_0_20px_rgba(212,255,50,0.4)] transition-shadow duration-500"
            onClick={() => setShowAdmin(true)}
          >
            {/* The Spinning Light Beam (Hidden until hover) */}
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#d4ff32_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* The Actual Button Surface */}
            <div className="relative flex items-center justify-center bg-[#0a0a0a] group-hover:bg-[#111] transition-colors rounded-full px-8 py-2.5 w-full h-full">
              <span className="text-[#d4ff32] font-mono text-xs uppercase tracking-[0.15em] z-10">
                Admin Uplink
              </span>
            </div>

            {/* Static Border (Fades out when the spinning light flares up) */}
            <span className="absolute inset-0 rounded-full border border-[#d4ff32]/40 group-hover:border-transparent transition-colors duration-500 pointer-events-none" />
          </div>
        </div>

      </nav>

      <div className="flex-1 relative flex items-center justify-center p-8">
        
        {/* --- 1. THE CINEMATIC INTRO SEQUENCE --- */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              className="absolute inset-0 z-[200] flex items-center justify-center bg-[#030303]"
              animate={{ opacity: introStep >= 5 ? 0 : 1 }}
              transition={{ duration: 0.8 }} 
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center gap-4 md:gap-6 overflow-hidden px-8">
                 
                 <AnimatePresence mode="popLayout">
                   
                   {/* MEET */}
                   {introStep >= 4 && (
                     <motion.span
                       key="meet"
                       layout
                       initial={{ opacity: 0, y: 50 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 1.2, ease: "easeOut" }}
                       className="text-5xl md:text-8xl font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap"
                     >
                       MEET
                     </motion.span>
                   )}

                   {/* THE */}
                   {introStep >= 1 && (
                     <motion.span
                       key="the"
                       layout
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 1.2, ease: "easeOut" }}
                       className="text-5xl md:text-8xl font-black uppercase tracking-tighter whitespace-nowrap drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                       style={{
                         background: "linear-gradient(to bottom, #FFFFFF 0%, #D1D5DB 40%, #111827 50%, #4B5563 52%, #F3F4F6 100%)",
                         WebkitBackgroundClip: "text",
                         WebkitTextFillColor: "transparent"
                       }}
                     >
                       THE
                     </motion.span>
                   )}

                   {/* TEAM */}
                   {introStep === 2 && (
                     <motion.span
                       key="team"
                       layout
                       initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                       animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                       exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                       transition={{ duration: 1.2, ease: "easeOut" }}
                       className="text-5xl md:text-8xl font-black uppercase tracking-tighter whitespace-nowrap text-[#d4ff32] drop-shadow-[0_0_30px_rgba(212,255,50,0.3)]"
                     >
                       TEAM
                     </motion.span>
                   )}

                   {/* MEMBERS */}
                   {introStep >= 4 && (
                     <motion.span
                       key="members"
                       layout
                       initial={{ opacity: 0, y: 50 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 1.2, ease: "easeOut" }}
                       className="text-5xl md:text-8xl font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap"
                     >
                       MEMBERS
                     </motion.span>
                   )}

                 </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 2. THE DYNAMIC LAYOUT --- */}
        <div className={`relative w-full max-w-6xl h-[700px] flex justify-center items-center z-10 transition-opacity duration-1000 ${selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {!showIntro && isCircleLayout && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <h1 className="text-[100px] md:text-[140px] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#d4ff32] to-[#030303] drop-shadow-2xl opacity-20">
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