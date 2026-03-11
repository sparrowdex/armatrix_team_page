"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { addTeamMember, deleteTeamMember, updateTeamMember } from "@/lib/api";
import { TeamMember } from "@/types/team";

export default function AdminPanel({ 
  members, onClose, onRefresh 
}: { 
  members: TeamMember[]; onClose: () => void; onRefresh: () => void;
}) {
  const [formData, setFormData] = useState({ name: "", role: "", bio: "", photo_url: "", linkedin_url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW: State to track if we are editing an existing member
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
      if (editingId === id) resetForm(); // Clear form if we delete the person we are editing
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
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-8"
    >
      <div className="bg-[#0a0a0a] border border-[#d4ff32]/30 w-full max-w-4xl h-[80vh] rounded-2xl flex overflow-hidden shadow-[0_0_50px_rgba(212,255,50,0.1)]">
        
        {/* Left Side: Form */}
        <div className="w-1/2 p-8 border-r border-white/10 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black uppercase tracking-widest text-[#d4ff32]">
              {editingId ? "Modify Record" : "Database Uplink"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs font-mono text-zinc-500 hover:text-white uppercase">Cancel Edit</button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-white/10 p-3 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-colors" />
            <input required placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-black border border-white/10 p-3 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-colors" />
            <input required placeholder="Photo URL" value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="bg-black border border-white/10 p-3 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-colors" />
            <input placeholder="LinkedIn URL (Optional)" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="bg-black border border-white/10 p-3 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-colors" />
            <textarea required placeholder="Bio" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="bg-black border border-white/10 p-3 text-white focus:border-[#d4ff32] outline-none font-mono text-sm transition-colors flex-1 resize-none" />
            
            <button type="submit" disabled={isSubmitting} className="bg-[#d4ff32] text-black font-bold uppercase tracking-widest p-4 hover:bg-white transition-colors disabled:opacity-50 mt-4">
              {isSubmitting ? "Processing..." : editingId ? "Update Personnel" : "Inject Data"}
            </button>
          </form>
        </div>

        {/* Right Side: Active Roster */}
        <div className="w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold uppercase text-white">Active Roster</h2>
             <button onClick={onClose} className="text-zinc-500 hover:text-[#d4ff32] font-mono text-xs uppercase tracking-widest">Close Uplink</button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {members.map(member => (
              <div key={member.id} className="bg-white/5 border border-white/5 p-4 flex justify-between items-center group hover:border-[#d4ff32]/40 transition-colors">
                <div>
                  <div className="font-bold text-white">{member.name}</div>
                  <div className="text-xs text-[#d4ff32] font-mono">{member.role}</div>
                </div>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(member)} className="text-xs text-blue-400 font-mono uppercase hover:text-blue-300">Modify</button>
                  <button onClick={() => handleDelete(member.id)} className="text-xs text-red-500 font-mono uppercase hover:text-red-400">Purge</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}