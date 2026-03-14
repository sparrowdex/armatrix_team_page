"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TeamMember } from "@/types/team";

const N = 8;        
const CX = 200;       
const CY = 250;       

const bladePath = "M -20,-20 Q 300,-150 700,-20 L 1500,-20 L 1500,1500 Q 250,250 -20,-20 Z";

export default function TeamCard({ 
  member, 
  isSelected, 
  isMobile = false, // Added Mobile detector
  isCenter = false,
  onClick 
}: { 
  member: TeamMember; 
  isSelected: boolean; 
  isMobile?: boolean;
  isCenter?: boolean;
  onClick: () => void 
}) {
  const open = isSelected;

  const bladeVariants = {
    closed: { rotate: 0, x: 0, y: 0 },
    open: { rotate: 85, x: 460, y: 220 } 
  };

  // Shrink base dimensions on mobile
  const widthClass = isSelected 
    ? (isMobile ? 'w-[260px]' : 'w-[360px] md:w-[400px]') 
    : (isMobile ? 'w-[160px]' : 'w-[280px] md:w-[320px]');

  return (
    <motion.div
      layoutId={`card-container-${member.id}`}
      onClick={onClick}
      transition={{ layout: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.6 } }}
      className={`relative rounded-sm overflow-hidden cursor-pointer transform-gpu bg-[#030303] flex-shrink-0 aspect-[4/5] border transition-all duration-500
        ${widthClass}
        ${isSelected ? 'border-[#d4ff32] shadow-[0_0_50px_rgba(212,255,50,0.15)]' : `border-zinc-800 ${isCenter ? 'hover:border-[#d4ff32]/40' : ''}`}
      `}
    >
       <div className="absolute inset-0 w-full h-full">
         
         <div className="absolute inset-0 z-0">
           <motion.img 
             src={member.photo_url} 
             alt={member.name}
             className="w-full h-full object-cover"
             initial={false}
             animate={{
               scale: open ? 1 : 1.15,
               filter: open ? 'grayscale(0%) brightness(100%)' : 'grayscale(100%) brightness(25%)'
             }}
             transition={{ duration: 0.9, ease: [0.34, 1.2, 0.64, 1] }} 
           />
         </div>

         <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full z-20 pointer-events-none">
           <defs>
             <linearGradient id={`bladeMetal-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%"   stopColor="#4a4a4a"/> 
               <stop offset="12%"  stopColor="#1c1c1c"/> 
               <stop offset="60%"  stopColor="#080808"/>
               <stop offset="100%" stopColor="#000000"/>
             </linearGradient>
             <clipPath id="tuck-clip">
               <rect x="-500" y="-1000" width="2000" height="1000" />
             </clipPath>
           </defs>
           <g>
             {Array.from({ length: N }).map((_, i) => {
               const angle = (i * 360) / N;
               return (
                 <g key={i} transform={`translate(${CX}, ${CY}) rotate(${angle})`}>
                   <motion.g
                     initial="closed" animate={open ? "open" : "closed"} variants={bladeVariants} layout={false} 
                     transition={{ duration: 0.9, ease: [0.34, 1.2, 0.64, 1], delay: i * 0.035 }}
                     style={{ originX: 0, originY: 0 }} 
                   >
                     <path d={bladePath} fill={`url(#bladeMetal-${member.id})`} stroke="#2a2a2a" strokeWidth="1" />
                     <path d={bladePath} fill="none" stroke="rgba(212,255,50,0.5)" strokeWidth="0.5" />
                   </motion.g>
                 </g>
               );
             })}
             <g transform={`translate(${CX}, ${CY}) rotate(0)`} clipPath="url(#tuck-clip)">
               <motion.g
                 initial="closed" animate={open ? "open" : "closed"} variants={bladeVariants} layout={false} 
                 transition={{ duration: 0.9, ease: [0.34, 1.2, 0.64, 1], delay: 0 }} 
                 style={{ originX: 0, originY: 0 }} 
               >
                 <path d={bladePath} fill={`url(#bladeMetal-${member.id})`} />
                 <path d={bladePath} fill="none" stroke="rgba(212,255,50,0.5)" strokeWidth="0.5" />
               </motion.g>
             </g>
           </g>
         </svg>

         <AnimatePresence>
             {!open && (
               <motion.div 
                 initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2 }}
                 transition={{ duration: 0.4 }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
               >
                 <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-center">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#d4ff32] rounded-full animate-pulse shadow-[0_0_15px_#d4ff32]" />
                 </div>
               </motion.div>
             )}
         </AnimatePresence>
       </div>
    </motion.div>
  );
}