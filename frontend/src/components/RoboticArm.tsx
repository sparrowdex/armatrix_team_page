"use client";
import { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function ArmatrixProbe({ isAlert }: { isAlert: boolean }) {
  const group = useRef<THREE.Group>(null);
  const numSegments = 6; 
  const segLen = 0.8; 

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    
    const rotateArm = (obj: THREE.Object3D, depth: number) => {
      const idleZ = (Math.sin(t * 0.6 + depth * 0.4) * 0.03) - 0.08; 
      const idleX = Math.cos(t * 0.5 + depth * 0.3) * 0.03;

      const alertZ = -depth * 0.12; 
      const alertX = depth * 0.04;

      const targetZ = isAlert ? alertZ : idleZ;
      const targetX = isAlert ? alertX : idleX;

      obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, targetZ, 0.08);
      obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, targetX, 0.08);

      const nextSegment = obj.children.find(c => c.name === "segment");
      if (nextSegment) rotateArm(nextSegment, depth + 1);
    };

    const firstSegment = group.current.children.find(c => c.name === "segment");
    if (firstSegment) rotateArm(firstSegment, 0);
  });

  const Segment = ({ depth }: { depth: number }) => {
    if (depth >= numSegments) return null;
    return (
      <group name="segment" position={depth === 0 ? [0, 0, 0] : [0, -segLen, 0]}>
        
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.4} />
        </mesh>

        <mesh position={[0, -segLen / 2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, segLen, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0.2} />
        </mesh>

        {depth === numSegments - 1 ? (
          <group position={[0, -segLen, 0]}>
            
            {/* THE FIX: Upward-facing point light to illuminate the arm's black metal body */}
            <pointLight 
              color="#ff0000" 
              intensity={isAlert ? 25 : 8} 
              distance={3} 
              position={[0, 0.5, 0]} 
              decay={1.5} 
            />

            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            
            {[0.12, 0.06].map((r, i) => (
              <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <torusGeometry args={[r, 0.015, 24, 32]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={isAlert ? 25 : 8} toneMapped={false} />
              </mesh>
            ))}
            
            <mesh position={[0, -0.01, 0]}>
               <cylinderGeometry args={[0.19, 0.19, 0.02, 32]} />
               <meshStandardMaterial color="#ff0000" transparent opacity={0.2} />
            </mesh>
            
            {/* Downward laser light */}
            <spotLight color="#ff0000" intensity={isAlert ? 15 : 4} distance={15} angle={0.6} penumbra={0.5} position={[0, 0, 0]} />
          </group>
        ) : (
          <Segment depth={depth + 1} />
        )}
      </group>
    );
  };

  return <group ref={group}><Segment depth={0} /></group>;
}

export default function ArmScene({ isAlert, isMobile }: { isAlert?: boolean; isMobile?: boolean }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        
        <Float speed={1.5} rotationIntensity={isAlert ? 0.02 : 0.15} floatIntensity={0.05}>
          <group position={isMobile ? [0, 4.5, -2] : [1.5, 3.5, 0]} rotation={[0, 0, 1.2]}>
            <ArmatrixProbe isAlert={isAlert || false} />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}