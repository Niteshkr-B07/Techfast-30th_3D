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
  const globe = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * animationSpeed;
    if (ringA.current) ringA.current.rotation.z = t * 0.35;
    if (ringB.current) {
      ringB.current.rotation.z = -t * 0.5;
      ringB.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.3) * 0.2;
    }
    if (ringC.current) {
      ringC.current.rotation.y = t * 0.25;
      ringC.current.rotation.x = Math.PI / 1.8;
    }
    if (globe.current) globe.current.rotation.y = t * 0.12;
  });

  return (
    <group position={[0, 8.5, -48]}>
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
            <mesh>
              <sphereGeometry args={[1.32, 24, 20]} />
              <meshStandardMaterial
                color="#241a08"
                emissive={GOLD}
                emissiveIntensity={hovered ? 0.9 : 0.35}
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
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.2} emissive={GOLD} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[2.55, 0.035, 10, 96]} />
        <meshStandardMaterial color={GOLD_BRIGHT} metalness={0.95} roughness={0.2} emissive={GOLD_BRIGHT} emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ringC}>
        <torusGeometry args={[3, 0.03, 10, 96]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.2} emissive={GOLD} emissiveIntensity={0.4} />
      </mesh>

      {/* Orbiting motes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.55, Math.sin(a) * 0.4, Math.sin(a) * 2.55]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={2} />
          </mesh>
        );
      })}

      <pointLight intensity={40} distance={24} decay={2} color={GOLD_BRIGHT} />
    </group>
  );
}
