"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, PanInfo } from "framer-motion";
import { TeamMember } from "@/types/team";
import { fetchTeamMembers } from "@/lib/api";
import TeamCard from "@/components/TeamCard";
import ArmScene from "@/components/RoboticArm"; 
import LongRoboticArm from "@/components/LongRoboticArm"; 
import AdminPanel from "@/components/AdminPanel";
import SearchTerminal from "@/components/SearchTerminal"; // Keep this import

// --- KEEP DECRYPTION OVERLAY EXACTLY HERE (Top Level) ---
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
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-2 md:mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] flex flex-wrap justify-center md:justify-start gap-x-3 md:gap-x-5">
              {selectedMember.name.split(' ').map((word, idx) => (
                <span 
                  key={idx} 
                  className="pb-[0.1em]" 
                  style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #D1D5DB 40%, #111827 50%, #4B5563 52%, #F3F4F6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}
                >
                  {word}
                </span>
              ))}
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
  const [activeIndex, setActiveIndex] = useState(0); 
  const [selectedId, setSelectedId] = useState<number | null>(null); 
  const [searchQuery, setSearchQuery] = useState(""); // Added Search State
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const refreshData = () => {
    fetchTeamMembers().then(setMembers).catch(console.error);
  };

  useEffect(() => {
    refreshData();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const loadTimer = setTimeout(() => setIsInitialLoad(false), 3000);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(loadTimer);
    };
  }, []);

  // Filter logic added back properly
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Reset index when searching
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedId !== null || filteredMembers.length === 0) return;
    if (e.key === "ArrowLeft") setActiveIndex(prev => Math.max(0, prev - 1));
    else if (e.key === "ArrowRight") setActiveIndex(prev => Math.min(filteredMembers.length - 1, prev + 1));
  }, [selectedId, filteredMembers.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const selectedMember = members.find((m) => m.id === selectedId);

  const handleCardClick = (index: number, id: number) => {
    if (index === activeIndex) setSelectedId(id);
    else setActiveIndex(index);
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent, { offset }: PanInfo) => {
    if (offset.x < -50) setActiveIndex(prev => Math.min(filteredMembers.length - 1, prev + 1)); 
    else if (offset.x > 50) setActiveIndex(prev => Math.max(0, prev - 1)); 
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col font-sans overflow-hidden selection:bg-[#d4ff32] selection:text-black relative">
      <nav className="w-full p-6 md:p-8 flex justify-between items-center z-50 border-b border-white/5 relative">
        <div className="font-black text-xl md:text-2xl tracking-tighter">ARMATRIX<span className="text-[#d4ff32]">.</span></div>
        <div className="flex items-center">
          <div className="relative group rounded-none md:rounded-full overflow-hidden p-[1px] cursor-pointer shadow-[0_0_10px_rgba(212,255,50,0.1)] hover:shadow-[0_0_20px_rgba(212,255,50,0.4)] transition-shadow duration-500" onClick={() => setShowAdmin(true)}>
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#d4ff32_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-center bg-[#0a0a0a] group-hover:bg-[#111] transition-colors rounded-none md:rounded-full px-4 md:px-8 py-2 md:py-2.5 w-full h-full">
              <span className="text-[#d4ff32] font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] z-10">{isMobile ? "Admin" : "Admin Uplink"}</span>
            </div>
            <span className="absolute inset-0 rounded-none md:rounded-full border border-[#d4ff32]/40 group-hover:border-transparent transition-colors duration-500 pointer-events-none" />
          </div>
        </div>
      </nav>

      {/* --- ADD SEARCH TERMINAL HERE --- */}
      {!selectedId && (
        <SearchTerminal onSearch={setSearchQuery} />
      )}

      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
        
        {!selectedId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 1.5, ease: "easeOut" }} 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <h1 
              className="text-[120px] md:text-[260px] font-black tracking-tighter uppercase drop-shadow-2xl opacity-30" 
              style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #A3A3A3 40%, #111827 75%, transparent 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}
            >
              TEAM
            </h1>
          </motion.div>
        )}

        {!selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute inset-0 z-[5] pointer-events-none"
          >
            <LongRoboticArm isMobile={isMobile} />
          </motion.div>
        )}

        <div className={`relative w-full max-w-6xl h-[500px] md:h-[600px] flex justify-center items-center z-10 transition-opacity duration-1000 ${selectedId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <AnimatePresence>
            {!selectedId && isInitialLoad && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 2.5 }} className="absolute bottom-4 z-50 text-[#d4ff32] font-mono text-xs uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full border border-[#d4ff32]/30 backdrop-blur-md">
                {isMobile ? "[ Swipe to Inspect ]" : "[ Use Arrow Keys to Inspect ]"}
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedId && activeIndex > 0 && !isMobile && filteredMembers.length > 0 && (
            <button onClick={() => setActiveIndex(prev => prev - 1)} className="absolute left-0 z-50 p-4 text-zinc-500 hover:text-[#d4ff32] transition-colors"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg></button>
          )}

          {!selectedId && activeIndex < filteredMembers.length - 1 && !isMobile && filteredMembers.length > 0 && (
            <button onClick={() => setActiveIndex(prev => prev + 1)} className="absolute right-0 z-50 p-4 text-zinc-500 hover:text-[#d4ff32] transition-colors"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></button>
          )}

          <motion.div className="absolute inset-0 flex items-center justify-center w-full h-full" drag={isMobile && !selectedId ? "x" : false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd}>
            {filteredMembers.map((member, i) => {
              const offset = i - activeIndex;
              const isVisible = Math.abs(offset) <= 1;
              const xPos = offset * (isMobile ? 120 : 340);
              const yPos = Math.abs(offset) * (isMobile ? 20 : 40);
              const scale = offset === 0 ? 1 : (isMobile ? 0.7 : 0.85);
              const rotate = offset * (isMobile ? 8 : 5);
              const zIndex = 50 - Math.abs(offset);
              const entranceDelay = isInitialLoad ? 1.2 + (i * 0.1) : 0;

              return (
                <motion.div 
                  key={member.id}
                  className="absolute origin-bottom"
                  initial={{ x: 1000, y: 500, opacity: 0, rotate: 20 }}
                  animate={{ x: xPos, y: yPos, rotate: rotate, scale: scale, opacity: isVisible ? (offset === 0 ? 1 : 0.5) : 0, zIndex: zIndex }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: entranceDelay }}
                  style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                >
                  <motion.div 
                    animate={{ y: offset === 0 ? [0, -10, 0] : 0 }} 
                    transition={offset === 0 ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <TeamCard member={member} isSelected={false} isMobile={isMobile} isCenter={offset === 0} onClick={() => handleCardClick(i, member.id)} />
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedMember && (
            <DecryptionOverlay selectedMember={selectedMember} isMobile={isMobile} handleClose={() => setSelectedId(null)} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAdmin && <AdminPanel members={members} onClose={() => setShowAdmin(false)} onRefresh={refreshData} />}
      </AnimatePresence>
    </main>
  );
}