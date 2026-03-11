"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addTeamMember, deleteTeamMember, updateTeamMember } from "@/lib/api";
import { TeamMember } from "@/types/team";

export default function AdminPanel({ 
 members, onClose, onRefresh 
}: { 
 members: TeamMember[]; onClose: () => void; onRefresh: () => void;
}) {
 const [formData, setFormData] = useState({ name: "", role: "", bio: "", photo_url: "", linkedin_url: "" });
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [editingId, setEditingId] = useState<number | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsSubmitting(true);
   try {
     if (editingId) {
       await updateTeamMember(editingId, formData);
     } else {
       await addTeamMember(formData);
     }
     onRefresh(); 
     resetForm();
   } catch (error) {
     console.error(error);
   } finally {
     setIsSubmitting(false);
   }
 };

 const handleDelete = async (id: number) => {
   try {
     await deleteTeamMember(id);
     if (editingId === id) resetForm(); 
     onRefresh();
   } catch (error) {
     console.error(error);
   }
 };

 const handleEdit = (member: TeamMember) => {
   setEditingId(member.id);
   setFormData({ 
     name: member.name, role: member.role, bio: member.bio, 
     photo_url: member.photo_url, linkedin_url: member.linkedin_url || "" 
    });
 };

 const resetForm = () => {
   setEditingId(null);
   setFormData({ name: "", role: "", bio: "", photo_url: "", linkedin_url: "" });
 };

 return (
   <motion.div 
     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
     className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
   >
     <div className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-sm overflow-hidden border border-[#d4ff32]/40 shadow-[0_0_80px_rgba(212,255,50,0.15)] flex flex-col md:flex-row">
       
       <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#000]" />
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,255,50,0.1),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(0,17,0,0.3),transparent_50%)]" />
         <div className="absolute inset-0 opacity-[0.02] bg-[url('/noise.png')] bg-repeat" />
       </div>

       <div className="absolute inset-0 z-10 flex flex-col md:flex-row w-full h-full">
         
         <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col border-b md:border-b-0 md:border-r border-white/10 order-1 md:order-2 h-[40%] md:h-full">
           <div className="flex justify-between items-center mb-4 md:mb-8">
             <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff32] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-[#d4ff32]"></span>
                </span>
                <h2 className="text-lg md:text-2xl font-black uppercase text-white tracking-tight">Active Roster</h2>
             </div>
             <button onClick={onClose} className="px-4 py-1.5 md:px-5 md:py-2 border border-[#d4ff32]/30 text-[#d4ff32] hover:bg-[#d4ff32] hover:text-black font-mono text-[10px] md:text-xs uppercase tracking-widest transition-all cursor-pointer rounded-sm">
               Close Uplink
             </button>
           </div>

           <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0 md:pr-3 custom-scrollbar flex-1 items-start md:items-stretch">
             {members.map(member => (
               <div key={member.id} className="relative border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#d4ff32]/50 hover:bg-white/10 min-w-[240px] w-[240px] md:w-auto md:min-w-0 flex-shrink-0 rounded-sm group p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
                  <div>
                    <div className="font-bold text-white text-base md:text-lg tracking-tight truncate">{member.name}</div>
                    <div className="text-[10px] md:text-xs text-[#d4ff32] font-mono uppercase tracking-wider truncate">{member.role}</div>
                  </div>
                  
                  <div className="flex gap-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(member)} className="px-3 py-1 border border-blue-400/40 text-blue-400 font-mono text-[10px] uppercase tracking-widest hover:bg-blue-400/10 transition-colors cursor-pointer rounded-sm">
                      Mod
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="px-3 py-1 border border-red-500/40 text-red-500 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-colors cursor-pointer rounded-sm">
                      Purge
                    </button>
                  </div>
               </div>
             ))}
           </div>
         </div>

         <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col backdrop-blur-[2px] order-2 md:order-1 h-[60%] md:h-full overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-end mb-6 md:mb-8">
             {/* THE FIX: Removed the extreme neon glow, kept it sharp and clean */}
             <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white">
               {editingId ? "Modify Record" : "Database Uplink"}
             </h2>
             {editingId && (
               <button onClick={resetForm} className="px-3 py-1 border border-white/20 text-[10px] font-mono text-zinc-500 hover:text-white hover:border-white/50 uppercase tracking-widest transition-colors cursor-pointer rounded-sm">
                 Cancel
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
             {/* THE FIX: Simplified labels and placeholders for better UX */}
             <div className="flex flex-col gap-1">
               <label className="text-[10px] md:text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Name</label>
               <input required placeholder="E.g., Marcus Vance" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-transparent border-b border-white/20 py-2 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-all placeholder:text-zinc-800 rounded-none" />
             </div>
             
             <div className="flex flex-col gap-1">
               <label className="text-[10px] md:text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Role</label>
               <input required placeholder="E.g., Lead Developer" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-transparent border-b border-white/20 py-2 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-all placeholder:text-zinc-800 rounded-none" />
             </div>

             <div className="flex flex-col gap-1">
               <label className="text-[10px] md:text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Photo URL</label>
               <input required placeholder="https://..." value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="bg-transparent border-b border-white/20 py-2 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-all placeholder:text-zinc-800 rounded-none" />
             </div>
             
             <div className="flex flex-col gap-1">
               <label className="text-[10px] md:text-[11px] font-mono text-zinc-500 uppercase tracking-widest">LinkedIn URL (Optional)</label>
               <input placeholder="https://linkedin.com/in/..." value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="bg-transparent border-b border-white/20 py-2 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-all placeholder:text-zinc-800 rounded-none" />
             </div>
             
             <div className="flex flex-col gap-1 flex-1 min-h-[80px]">
               <label className="text-[10px] md:text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Bio</label>
               <textarea required placeholder="Enter bio..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="bg-transparent border-b border-white/20 py-2 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-all flex-1 resize-none placeholder:text-zinc-800 rounded-none" />
             </div>
             
             <button type="submit" disabled={isSubmitting} className="relative w-full bg-[#d4ff32] text-black font-black uppercase tracking-[0.2em] p-4 hover:bg-white transition-all disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(212,255,50,0.2)] rounded-sm cursor-pointer">
               {isSubmitting ? "Processing..." : editingId ? "Update Personnel" : "Inject Data"}
             </button>
           </form>
         </div>

       </div>
     </div>
   </motion.div>
 );
}