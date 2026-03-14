"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function SearchTerminal({ onSearch }: { onSearch: (val: string) => void }) {
  return (
    <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4">
      <motion.div 
        initial={{ width: "40px", opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1], 
          delay: 1.5 
        }}
        className="relative group mx-auto overflow-hidden"
      >
        {/* Outer Glow */}
        <div className="absolute -inset-0.5 bg-[#d4ff32]/10 blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        
        <div className="relative flex items-center bg-black/90 border border-white/10 group-focus-within:border-[#d4ff32]/40 backdrop-blur-xl px-4 py-2.5 transition-all">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="flex items-center w-full"
          >
            <Search className="w-4 h-4 text-[#d4ff32] mr-3 opacity-70 group-focus-within:opacity-100 flex-shrink-0" />
            
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="SCAN BY NAME OR ROLE"
                onChange={(e) => onSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] md:text-xs font-mono tracking-[0.2em] text-[#d4ff32] placeholder:text-white/40 w-full uppercase"
              />
              
              {/* Blinking Terminal Cursor - Only shows when not typing */}
              <motion.div 
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  times: [0, 0.5, 0.5, 1],
                }}
                className="w-1.5 h-3 bg-[#d4ff32]/60 ml-1 hidden group-focus-within:block"
              />
            </div>
          </motion.div>

          {/* Top Left Bracket */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4ff32]/80" />
          
          {/* Bottom Right Bracket */}
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4ff32]/80" />
        </div>
        
        {/* Scanning Line */}
        <motion.div 
          animate={{ x: ["-100%", "400%"] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 h-[1px] w-1/4 bg-gradient-to-r from-transparent via-[#d4ff32] to-transparent opacity-30 pointer-events-none"
        />
      </motion.div>
    </div>
  );
}