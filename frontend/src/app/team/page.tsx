"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { TeamMember } from "@/types/team";
import { fetchTeamMembers } from "@/lib/api";
import TeamCard from "@/components/TeamCard";
import ArmScene from "@/components/RoboticArm";
import AdminPanel from "@/components/AdminPanel";

function DecryptionOverlay({ 
  selectedMember, 
  isMobile, 
  handleClose 
}: { 
  selectedMember: TeamMember; 
  isMobile: boolean; 
  handleClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  const cardScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const cardY = useTransform(scrollY, [0, 200], [0, -30]);
  const cardOpacity = useTransform(scrollY, [0, 200], [1, 0.4]);

  const [isAlert, setIsAlert] = useState(false);

  return (
    <motion.div key="decryption-view" className="absolute inset-0 z-[60]">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute inset-0 z-[100] pointer-events-none"
      >
        <ArmScene isAlert={isAlert} isMobile={isMobile} />
      </motion.div>

      <div ref={scrollRef} className="absolute inset-0 z-[120] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="min-h-full w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center px-4 md:px-8 pt-12 md:pt-24 pb-24 md:pb-12 gap-8 md:gap-0">
          
          <motion.div 
            className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-12 relative flex-shrink-0 origin-top"
            style={{ scale: isMobile ? cardScale : 1, y: isMobile ? cardY : 0, opacity: isMobile ? cardOpacity : 1 }}
          >
            <TeamCard member={selectedMember} isSelected={true} isMobile={isMobile} onClick={() => {}} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 40 : 0 }} 
            animate={{ opacity: 1, x: 0, y: 0 }} 
            exit={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 flex flex-col relative z-[130] items-center text-center md:items-start md:text-left flex-shrink-0"
            onMouseEnter={() => setIsAlert(true)} onMouseLeave={() => setIsAlert(false)}
          >
            <button onClick={handleClose} className="group mb-6 md:mb-12 flex items-center gap-2 md:gap-4 text-zinc-500 hover:text-[#d4ff32] transition-colors cursor-pointer" style={{ pointerEvents: 'auto' }}>
              <svg width="20" height="12" viewBox="0 0 40 12" className="overflow-visible hidden md:block">
                <path d="M0,6 C10,-4 30,16 40,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white group-hover:text-[#d4ff32] transition-colors">
                Close Interface
              </span>
              <svg width="20" height="12" viewBox="0 0 40 12" className="overflow-visible hidden md:block scale-x-[-1]">
                <path d="M0,6 C10,-4 30,16 40,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
            </button>
            
            <h1 
              className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-2 md:mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #D1D5DB 40%, #111827 50%, #4B5563 52%, #F3F4F6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {selectedMember.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-mono uppercase tracking-widest text-[#d4ff32] mb-6 md:mb-8">{selectedMember.role}</h2>
            
            <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-md font-light break-words whitespace-normal pb-12 md:pb-0">
              {selectedMember.bio}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  
  const [pullingId, setPullingId] = useState<number | null>(null); 
  const [selectedId, setSelectedId] = useState<number | null>(null); 
  
  const [introStep, setIntroStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const refreshData = () => {
    fetchTeamMembers().then(setMembers).catch(console.error);
  };

  useEffect(() => {
    refreshData();
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const t1 = setTimeout(() => setIntroStep(1), 600);    
    const t2 = setTimeout(() => setIntroStep(2), 2200);   
    const t3 = setTimeout(() => setIntroStep(3), 4000);   
    const t4 = setTimeout(() => setIntroStep(4), 5200);   
    const t5 = setTimeout(() => setIntroStep(5), 7000);   
    const t6 = setTimeout(() => setShowIntro(false), 7600); 

    return () => {
      window.removeEventListener('resize', checkMobile);
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
      <nav className="w-full p-6 md:p-8 flex justify-between items-center z-50 border-b border-white/5 relative">
        <div className="font-black text-xl md:text-2xl tracking-tighter">ARMATRIX<span className="text-[#d4ff32]">.</span></div>
        
        <div className="flex items-center">
          <div 
            className="relative group rounded-none md:rounded-full overflow-hidden p-[1px] cursor-pointer shadow-[0_0_10px_rgba(212,255,50,0.1)] hover:shadow-[0_0_20px_rgba(212,255,50,0.4)] transition-shadow duration-500"
            onClick={() => setShowAdmin(true)}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#d4ff32_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center bg-[#0a0a0a] group-hover:bg-[#111] transition-colors rounded-none md:rounded-full px-4 md:px-8 py-2 md:py-2.5 w-full h-full">
              <span className="text-[#d4ff32] font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] z-10">
                {isMobile ? "Admin" : "Admin Uplink"}
              </span>
            </div>
            <span className="absolute inset-0 rounded-none md:rounded-full border border-[#d4ff32]/40 group-hover:border-transparent transition-colors duration-500 pointer-events-none" />
          </div>
        </div>
      </nav>

      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
        
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              className="absolute inset-0 z-[200] flex items-center justify-center bg-[#030303]"
              animate={{ opacity: introStep >= 5 ? 0 : 1 }}
              transition={{ duration: 0.8 }} 
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center gap-2 md:gap-6 overflow-hidden px-4 md:px-8">
                 <AnimatePresence mode="popLayout">
                   {introStep >= 4 && (
                     <motion.span key="meet" layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="text-3xl md:text-8xl font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap">
                       MEET
                     </motion.span>
                   )}
                   {introStep >= 1 && (
                     <motion.span key="the" layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="text-4xl md:text-8xl font-black uppercase tracking-tighter whitespace-nowrap drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #D1D5DB 40%, #111827 50%, #4B5563 52%, #F3F4F6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                       THE
                     </motion.span>
                   )}
                   {introStep === 2 && (
                     <motion.span key="team" layout initial={{ opacity: 0, x: 20, filter: "blur(10px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 20, filter: "blur(10px)" }} transition={{ duration: 1.2, ease: "easeOut" }} className="text-4xl md:text-8xl font-black uppercase tracking-tighter whitespace-nowrap text-[#d4ff32] drop-shadow-[0_0_30px_rgba(212,255,50,0.3)]">
                       TEAM
                     </motion.span>
                   )}
                   {introStep >= 4 && (
                     <motion.span key="members" layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="text-3xl md:text-8xl font-black text-zinc-400 uppercase tracking-tighter whitespace-nowrap">
                       MEMBERS
                     </motion.span>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative w-full max-w-6xl h-[500px] md:h-[700px] flex justify-center items-center z-10 transition-opacity duration-1000 ${selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {!showIntro && isCircleLayout && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeOut" }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              {/* THE FIX: Changed to "TEAM" and bumped the size to text-[160px] to make it a bold centerpiece */}
              <h1 className="text-8xl md:text-[160px] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#d4ff32] to-[#030303] drop-shadow-2xl opacity-20">
                TEAM
              </h1>
            </motion.div>
          )}

          {!showIntro && members.map((member, i) => {
            const isPulled = pullingId === member.id && !selectedId;
            let rotate = 0, x = 0, y = 0;
            let baseScale = 1;

            if (isCircleLayout) {
              const angle = (i / members.length) * (Math.PI * 2) - Math.PI / 2; 
              
              // THE FIX: Expanded base radius from 260 -> 300 so the circle is naturally wider.
              // Also increased the dynamic multiplier so it pushes out more as cards are added.
              const dynamicRadius = (isMobile ? 150 : 300) + Math.min((members.length - 8) * 12, 100);
              const radius = dynamicRadius + (isPulled ? 40 : 0); 
              x = Math.cos(angle) * radius;
              y = Math.sin(angle) * radius;
              rotate = angle * (180 / Math.PI) + 90; 
              
              // THE FIX: Scaled down the cards more aggressively (6.0 instead of 6.5)
              baseScale = isMobile ? Math.max(0.3, 4.0 / members.length) : Math.max(0.35, 6.0 / members.length);
            } else {
              const midIndex = (members.length - 1) / 2;
              const offset = i - midIndex; 
              
              const spread = members.length > 4 ? 8 : 12;
              rotate = offset * spread; 
              x = offset * (isMobile ? 50 : 100); 
              y = Math.pow(offset, 2) * (isMobile ? 6 : 12) - (isPulled ? 80 : 0); 
            }

            let currentScale = baseScale;
            if (isPulled) currentScale = baseScale * 1.1;
            else if (selectedId && selectedId !== member.id) currentScale = baseScale * 0.8;

            return (
              <motion.div 
                key={member.id}
                className="absolute origin-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: selectedId && selectedId !== member.id ? 0 : 1, x: selectedId ? 0 : x, y: selectedId ? 0 : y, rotate: selectedId ? 0 : rotate, scale: selectedId === member.id ? 1 : currentScale, zIndex: isPulled || selectedId === member.id ? 50 : 10 + i }}
                transition={{ duration: isPulled ? 1.0 : 0.85, ease: [0.16, 1, 0.3, 1], delay: (selectedId || pullingId) ? 0 : i * 0.05 }}
                style={{ pointerEvents: (selectedId || pullingId) ? 'none' : 'auto' }}
              >
                <motion.div animate={{ y: (selectedId || pullingId) ? 0 : [0, -8, 0] }} transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}>
                  <TeamCard member={member} isSelected={false} isMobile={isMobile} onClick={() => handleCardClick(member.id)} />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {selectedMember && (
            <DecryptionOverlay 
              selectedMember={selectedMember} 
              isMobile={isMobile} 
              handleClose={handleClose} 
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAdmin && <AdminPanel members={members} onClose={() => setShowAdmin(false)} onRefresh={refreshData} />}
      </AnimatePresence>
    </main>
  );
}