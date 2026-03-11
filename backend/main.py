from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Armatrix Team API")

# Enable CORS so Next.js (port 3000) can talk to FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Team Member Data Model
class TeamMember(BaseModel):
    id: int
    name: str
    role: str
    bio: str
    photo_url: str
    linkedin_url: Optional[str] = None

# In-memory Database
team_data = [
    {
        "id": 1,
        "name": "Sreeja Das",
        "role": "Creative Developer",
        "bio": "Building high-fidelity 3D interfaces and bridging the gap between logic and art.",
        "photo_url": "https://github.com/sparrowdex.png", 
        "linkedin_url": "https://linkedin.com/in/sreejadas"
    },
    {
        "id": 2,
        "name": "Marcus Thorne",
        "role": "Systems Architect",
        "bio": "Specializing in low-latency neural networks and distributed armatrix clusters.",
        "photo_url": "https://i.pravatar.cc/400?img=11", # Explicitly points to a male placeholder face
        "linkedin_url": "https://linkedin.com/in/marcusthorne"
    },
    {
        "id": 3,
        "name": "Elena Vance",
        "role": "Security Researcher",
        "bio": "Decrypting the encrypted. Elena leads our offensive security and penetration testing division.",
        "photo_url": "https://i.pravatar.cc/400?img=5", # Explicitly points to a female placeholder face
        "linkedin_url": "https://linkedin.com/in/elenavance"
    }
  ]


@app.get("/members", response_model=List[TeamMember])
def get_members():
    """Fetch all team members"""
    return team_data

@app.post("/members")
def add_member(member: TeamMember):
    """Add a new team member"""
    team_data.append(member.dict())
    return {"message": "Member added successfully", "member": member}

@app.put("/members/{member_id}")
def update_member(member_id: int, updated_member: TeamMember):
    """Update an existing team member"""
    for i, member in enumerate(team_data):
        if member["id"] == member_id:
            team_data[i] = updated_member.dict()
            return {"message": "Member updated", "member": updated_member}
    raise HTTPException(status_code=404, detail="Member not found")

@app.delete("/members/{member_id}")
def delete_member(member_id: int):
    """Delete a team member"""
    global team_data
    team_data = [m for m in team_data if m["id"] != member_id]
    return {"message": f"Member {member_id} deleted"}

@app.get("/")
def read_root():
    return {"status": "Armatrix API is online"}