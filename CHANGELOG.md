# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-14

### Added

- **Initial Project Structure**: Set up a monorepo-style project with a Next.js frontend and a Python/FastAPI backend.
- **Core Components**:
  - `TeamCard`: An interactive card with a mechanical SVG iris effect.
  - `AdminPanel`: A full CRUD interface for managing team members.
  - `RoboticArm`: A recursive 3D robotic arm component for the decryption view.
  - `LongRoboticArm`: A procedurally generated 3D arm for the main carousel background.
  - `SearchTerminal`: A specialized terminal UI component for real-time filtering of personnel by name or role.
- **Full CRUD Functionality**: Implemented API endpoints and frontend logic for creating, reading, updating, and deleting team members.
- **Cinematic UI/UX**:
  - Orchestrated a dramatic typographic entrance and layout transition on initial load.
  - Utilized Framer Motion's `layoutId` for seamless morphing transitions between the carousel and the detail view.
- **Deployment**: Configured live deployments on Vercel (Frontend) and Railway (Backend) with CI/CD.

### Changed

- **3D Arm Animation**: Refactored the `LongRoboticArm` to generate a complete, hidden 360-degree ring. This allows for a continuous, perfectly rigid rotation ("endless slither") without visual tricks.
- **Animation Logic**: Restored hierarchical scaling logic for the arm's "shooting" entrance, creating a more physical growth effect.
- **Interaction Model**: Refined the team card carousel to improve animation performance and user experience during interaction.

### Fixed

- **Carousel Animation Stutter**: Resolved a visual glitch where hover effects on non-centered cards in the carousel caused a staggering animation. Hover states are now restricted to the active (centered) card.
- **Carousel Animation Persistence**: Corrected a bug where non-centered cards would retain an infinite floating animation loop, causing judder. The `transition` prop in Framer Motion is now conditionally swapped to a `spring` type to bring the element to a resting state immediately.

---

*This changelog documents the initial public release and subsequent refinements.*