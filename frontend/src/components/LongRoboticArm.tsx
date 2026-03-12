"use client";
import { useRef } from "react";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// Global timer guarantees the entrance animation plays exactly once per page load.
// Navigating to other cards won't replay it!
const APP_START_TIME = Date.now();

function LongProbe({ isMobile }: { isMobile: boolean }) {
  const rootGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // --- YOUR EXACT MATH ---
  const numSegments = 40; 
  const spanWidth = viewport.width * (isMobile ? 1.05 : 0.95); 
  const totalBend = Math.PI * (isMobile ? 0.6 : 0.45); 

  const radius = (spanWidth / 2) / Math.sin(totalBend / 2);
  const arcLength = radius * totalBend;
  const segLen = arcLength / numSegments;
  const bendPerSegment = -totalBend / numSegments;

  // --- THE MAGIC UPGRADE: Calculate the full 360-degree ring ---
  // This calculates exactly how many segments are needed to close the loop
  const fullRingSegments = Math.round((Math.PI * 2) / Math.abs(bendPerSegment));

  // Calculate the exact geometric center of the polygon to pivot around without wobbling
  const theta = Math.abs(bendPerSegment);
  const pivotX = -(segLen / 2) / Math.tan(theta / 2);
  const pivotY = -segLen / 2;

  useFrame(() => {
    if (!rootGroup.current || !spinGroup.current) return;
    const t = (Date.now() - APP_START_TIME) / 1000;

    const rotateArm = (obj: THREE.Object3D, depth: number) => {
      // Your exact original timing for the visible segments
      const startDelay = 1.0; 
      
      // Invisible segments (completing the circle) spawn much faster so the ring is ready to spin
      const segmentDelay = depth < numSegments 
        ? depth * 0.05 
        : (numSegments * 0.05) + ((depth - numSegments) * 0.005);
      
      const progress = Math.min(1, Math.max(0, (t - startDelay - segmentDelay) * 2.0));

      obj.rotation.z = bendPerSegment;
      obj.rotation.x = 0; 

      const targetScale = progress > 0.01 ? 1 : 0.001;
      obj.scale.setScalar(THREE.MathUtils.lerp(obj.scale.x, targetScale, 0.3));

      const nextSegment = obj.children.find(c => c.name === "segment");
      if (nextSegment) rotateArm(nextSegment, depth + 1);
    };

    const firstSegment = rootGroup.current.children.find(c => c.name === "segment");
    if (firstSegment) rotateArm(firstSegment, 0);

    // --- ENDLESS SLITHER ---
    // Start rotating the perfect center of the ring after the entrance completes
    const rotationStartTime = 1.0 + (numSegments * 0.05) + 0.5; // ~3.5 seconds
    if (t > rotationStartTime) {
      // THE FIX: Reduced speed from 0.15 to 0.08 for a slower, creepier slither
      spinGroup.current.rotation.z = -(t - rotationStartTime) * 0.08; 
    } else {
      spinGroup.current.rotation.z = 0;
    }
  });

  const Segment = ({ depth }: { depth: number }) => {
    // Stop rendering once the circle is closed to save performance
    if (depth >= fullRingSegments) return null;
    
    return (
      <group name="segment" position={depth === 0 ? [0, 0, 0] : [0, -segLen, 0]}>
        {/* INCREASED THICKNESS: Spheres and Cylinders bumped up by ~33% */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.4} />
        </mesh>
        <mesh position={[0, -segLen / 2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, segLen, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0.2} />
        </mesh>
        
        {/* The head is attached exactly at your original segment index (39) */}
        {depth === numSegments - 1 && (
          <group position={[0, -segLen, 0]}>
            <pointLight color="#d4ff32" intensity={20} distance={10} position={[0, 0.5, 0]} decay={1.5} />
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <torusGeometry args={[0.12, 0.03, 24, 32]} />
              <meshStandardMaterial color="#d4ff32" emissive="#d4ff32" emissiveIntensity={10} toneMapped={false} />
            </mesh>
          </group>
        )}

        {/* Continue building the hidden part of the circle */}
        {depth < fullRingSegments - 1 && <Segment depth={depth + 1} />}
      </group>
    );
  };

  return (
    // The spin group sits perfectly at the geometric center of the ring
    <group ref={spinGroup} position={[pivotX, pivotY, 0]}>
      {/* The root group is offset back so the tail starts exactly where you positioned it */}
      <group position={[-pivotX, -pivotY, 0]} ref={rootGroup}>
        <Segment depth={0} />
      </group>
    </group>
  );
}

function ResponsiveArm({ isMobile }: { isMobile: boolean }) {
  const { viewport } = useThree();

  // YOUR EXACT POSITIONING WRAPPER
  const spanWidth = viewport.width * (isMobile ? 1.05 : 0.95);
  const totalBend = Math.PI * (isMobile ? 0.6 : 0.45);

  const rotZ = Math.PI / 2 + (totalBend / 2);
  const startX = -spanWidth / 2;
  const startY = -viewport.height / 2 - (isMobile ? -0.5 : 1.0);

  return (
    <group position={[startX, startY, -2]} rotation={[0, 0, rotZ]}>
      <LongProbe isMobile={isMobile} />
    </group>
  );
}

export default function LongRoboticArm({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 5, 5]} intensity={0.5} />
        <Environment preset="city" />
        <ResponsiveArm isMobile={isMobile} />
      </Canvas>
    </div>
  );
}