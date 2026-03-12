# 🦾 ARMATRIX.
**Advanced Personnel Management & Team Page Interface**

![Armatrix Interface](public/images/image.png)

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

> "Experience the intersection of high-fidelity 3D interaction and robust backend architecture."

**Armatrix** is a dynamic, cinematic personnel directory and management interface. It merges full-stack engineering with procedural 3D graphics and fluid motion design to create a highly immersive, sci-fi-inspired user experience.

---

## 🔗 Live Deployments

* 🌐 **Frontend (Vercel):** [armatrix-team-page.vercel.app](https://armatrix-team-page-delta.vercel.app)
* ⚙️ **Backend API (Railway):** [armatrixteampage.up.railway.app](https://armatrixteampage-production.up.railway.app)
* 📖 **API Docs:** [FastAPI Swagger UI](https://armatrixteampage-production.up.railway.app/docs)

---

## 🚀 Setup

For detailed setup instructions, please refer to the [Setup Guide](setup_guide.md).

---

## ✨ Key Features

### 💎 The Interaction Layer
* **Mechanical Shutter Cards:** Each team member is housed in a custom-built card featuring a mechanical iris reveal effect, meticulously implemented using SVG paths and Framer Motion keyframes.
* **Cinematic Intro Sequence:** A state-machine approach orchestrates a dramatic typographic entrance and layout transition before revealing the main directory.
* **Smart Layout Morphing:** The interface automatically switches between a fanned "deck" layout and a 360-degree "Iris Array" depending on the size of the team roster, utilizing Framer Motion's `layoutId` for seamless morphing.

![Robotic Arm Interface](public/images/image-1.png)

### 🐍 The 3D Engine (React Three Fiber)
* **Procedural Slithering Probe:** A mathematically calculated, endless 3D ring track that spans the exact width of the user's screen.
* **Recursive Kinematics:** The robotic arm dynamically "shoots out" onto the screen upon load using recursive, segment-by-segment scaling (original hierarchical logic), before locking into an endless, heavy, menacing orbit over the personnel files.
* **Endless Slithering Orbit:** The arm completes a full 360-degree loop hidden beneath the viewport, allowing for a continuous, perfectly rigid rotation without the need for wobbly sine-wave fakes.

### 🛡️ The Admin Uplink (Full CRUD)
* **Database Management:** A secure, in-theme Admin Panel allows for real-time creation, deletion, and modification of personnel records.
* **Live Synchronization:** Changes dispatched via the Admin Uplink hit the Python/FastAPI backend and instantly update the 3D-integrated frontend.

![Admin Uplink](public/images/image-2.png)

---

## 🛠️ Technology Stack

| Architecture | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 15, React 19, Tailwind CSS |
| **Animation & Physics** | Framer Motion |
| **3D Graphics** | Three.js, React Three Fiber, `@react-three/drei` |
| **Backend API** | Python 3.12, FastAPI |
| **Data Validation** | Pydantic |
| **Deployment & Hosting** | Vercel (Client), Railway (Server) |

---

## 🧠 Key Technical Challenges Overcome

* **Mathematical 3D Rigging:** Calculating the exact span of a user's viewport to procedurally generate a perfectly arched 3D ring. This eliminated the need for static 3D models and allowed the geometry to be entirely responsive to mobile and ultrawide screens.
* **Recursive Scaling Logic:** Restoring the hierarchical "shooting" animation where segments compound their transformations, creating a physical growth effect rather than a simple fade-in.
* **Layout Morphing Persistence:** Synchronizing Framer Motion’s `layoutId` with complex React state changes so cards can seamlessly fly out of a carousel and morph into a decrypted overlay profile while maintaining 3D background continuity.

---

<div align="center">
  <b>Architected and Developed by Sreeja Das</b><br>
</div>