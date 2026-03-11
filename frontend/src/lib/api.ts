import { TeamMember } from "@/types/team";

const API_URL = "http://localhost:8000"; 

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await fetch(`${API_URL}/members`);
  if (!response.ok) throw new Error("Failed to sync with directory.");
  return response.json();
};

export const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
  const newMember = { ...member, id: Date.now() };
  const response = await fetch(`${API_URL}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMember),
  });
  if (!response.ok) throw new Error("Failed to add personnel.");
  return response.json();
};

// NEW: The Edit/Update function
export const updateTeamMember = async (id: number, member: Omit<TeamMember, 'id'>) => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // FastAPI expects the ID to be inside the body as well based on your schema
    body: JSON.stringify({ ...member, id }), 
  });
  if (!response.ok) throw new Error("Failed to modify personnel.");
  return response.json();
};

export const deleteTeamMember = async (id: number) => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to purge personnel.");
  return response.json();
};