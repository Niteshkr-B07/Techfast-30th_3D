import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveObject from './InteractiveObject';

const GOLD = '#d9ac4e';
const GOLD_BRIGHT = '#f5dfa0';

interface GlobeProps {
  onSelect: () => void;
  animationSpeed: number;
}

export default function AmbassadorGlobe({ onSelect, animationSpeed }: GlobeProps) {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const ringD = useRef<THREE.Mesh>(null);
  const globe = useRef<THREE.Mesh>(null);
  const globeCore = useRef<THREE.Mesh>(null);
  const outerGlow = useRef<THREE.Mesh>(null);
  const motesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * animationSpeed;
    const raw = clock.getElapsedTime();

    if (ringA.current) ringA.current.rotation.z = t * 0.35;
    if (ringB.current) {
      ringB.current.rotation.z = -t * 0.5;
      ringB.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.3) * 0.2;
    }
    if (ringC.current) {
      ringC.current.rotation.y = t * 0.25;
      ringC.current.rotation.x = Math.PI / 1.8;
    }
    if (ringD.current) {
      ringD.current.rotation.y = -t * 0.18;
      ringD.current.rotation.z = t * 0.1;
    }
    if (globe.current) globe.current.rotation.y = t * 0.12;

    // Pulse globe core emissive
    if (globeCore.current) {
      const m = globeCore.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.4 + Math.sin(raw * 1.6) * 0.2;
    }

    // Outer glow subtle pulse
    if (outerGlow.current) {
      const m = outerGlow.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.06 + Math.sin(raw * 0.9) * 0.03;
    }

    // Animate orbiting motes
    if (motesRef.current) {
      const children = motesRef.current.children;
      const count = children.length;
      for (let i = 0; i < count; i++) {
        const angle = raw * animationSpeed * 0.6 + (i / count) * Math.PI * 2;
        const mote = children[i];
        mote.position.x = Math.cos(angle) * 3.6;
        mote.position.z = Math.sin(angle) * 3.6;
        mote.position.y = Math.sin(angle * 2.1 + i) * 0.5;
      }
    }
  });

  return (
    <group position={[0, 8.5, -48]}>
      {/* Dramatic spotlight from above */}
      <spotLight
        position={[0, 12, 0]}
        angle={0.35}
        penumbra={0.9}
        intensity={80}
        distance={20}
        decay={2}
        color={GOLD_BRIGHT}
      />

      {/* Golden celestial globe */}
      <InteractiveObject position={[0, 0, 0]} label="ca-program" onSelect={onSelect} hitRadius={1.6}>
        {(hovered) => (
          <Float speed={1.1} floatIntensity={0.35}>
            <mesh ref={globe}>
              <icosahedronGeometry args={[1.35, 3]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={hovered ? GOLD_BRIGHT : GOLD}
                emissiveIntensity={hovered ? 1.6 : 0.55}
                metalness={0.95}
                roughness={0.18}
                wireframe
              />
            </mesh>
            <mesh ref={globeCore}>
              <sphereGeometry args={[1.32, 24, 20]} />
              <meshStandardMaterial
                color="#241a08"
                emissive={GOLD}
                emissiveIntensity={hovered ? 0.9 : 0.4}
                metalness={0.7}
                roughness={0.35}
              />
            </mesh>
          </Float>
        )}
      </InteractiveObject>

      {/* Astronomical rings */}
      <mesh ref={ringA}>
        <torusGeometry args={[2.1, 0.045, 10, 96]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.2} emissive={GOLD} emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[2.55, 0.035, 10, 96]} />
        <meshStandardMaterial color={GOLD_BRIGHT} metalness={0.95} roughness={0.2} emissive={GOLD_BRIGHT} emissiveIntensity={1.0} />
      </mesh>
      <mesh ref={ringC}>
        <torusGeometry args={[3, 0.03, 10, 96]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.2} emissive={GOLD} emissiveIntensity={0.8} />
      </mesh>
      {/* 4th outer ring — thinner, tilted differently, slower */}
      <mesh ref={ringD}>
        <torusGeometry args={[3.6, 0.02, 8, 96]} />
        <meshStandardMaterial color={GOLD_BRIGHT} metalness={0.95} roughness={0.25} emissive={GOLD_BRIGHT} emissiveIntensity={0.6} />
      </mesh>

      {/* Outer glow sphere (additive, gold, opacity 0.08) */}
      <mesh ref={outerGlow}>
        <sphereGeometry args={[4.2, 20, 16]} />
        <meshBasicMaterial
          color={GOLD}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 12 tiny motes orbiting at radius 3.6 */}
      <group ref={motesRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={2.5} />
            </mesh>
          );
        })}
      </group>

      {/* Original 6 static motes removed, replaced by animated 12 above */}

      <pointLight intensity={40} distance={24} decay={2} color={GOLD_BRIGHT} />
    </group>
  );
}
