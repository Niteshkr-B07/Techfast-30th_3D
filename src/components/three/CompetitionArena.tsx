import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveObject from './InteractiveObject';
import { SITE_CONTENT } from '../../data/event';

const GOLD = '#d9ac4e';
const GOLD_BRIGHT = '#f5dfa0';
const CYAN = '#3fd9ee';
const STONE = '#4a4438';

interface ArenaProps {
  onSelect: (id: string) => void;
  animationSpeed: number;
}

function Sigil({ color, emissiveIntensity }: { color: string; emissiveIntensity: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.6;
  });
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.55, 0.06, 10, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.2} emissive={color} emissiveIntensity={emissiveIntensity} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.42, 0.05, 10, 48]} />
        <meshStandardMaterial color={GOLD_BRIGHT} metalness={0.95} roughness={0.2} emissive={color} emissiveIntensity={emissiveIntensity * 1.3} />
      </mesh>
      <mesh rotation={[Math.PI / 1.6, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color="#1b3a4a" emissive={color} emissiveIntensity={emissiveIntensity * 2.4} metalness={0.5} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function CompetitionArena({ onSelect, animationSpeed }: ArenaProps) {
  const categories = SITE_CONTENT.competitions.categories;

  const slots = useMemo(() => {
    const n = categories.length;
    return categories.map((_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.PI / n;
      return [Math.cos(a) * 4.4, 2.4, -14 + Math.sin(a) * 4.4] as [number, number, number];
    });
  }, [categories.length]);

  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.getElapsedTime() * 0.15 * animationSpeed;
  });

  return (
    <group>
      {/* Arena floor */}
      <mesh position={[0, 0.6, -14]} receiveShadow>
        <cylinderGeometry args={[5.6, 6.4, 0.5, 40]} />
        <meshStandardMaterial color={STONE} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.9, -14]}>
        <torusGeometry args={[5.6, 0.08, 10, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} emissive={GOLD} emissiveIntensity={0.25} />
      </mesh>

      {/* Floating rune ring above the arena */}
      <mesh ref={ring} position={[0, 5.4, -14]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[4.8, 0.035, 8, 80]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.4} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Central pillar */}
      <Float speed={1.2} floatIntensity={0.4}>
        <mesh position={[0, 3, -14]}>
          <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
          <meshStandardMaterial color={STONE} roughness={0.9} />
        </mesh>
        <mesh position={[0, 5.3, -14]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#0e2430" emissive={CYAN} emissiveIntensity={2} metalness={0.5} roughness={0.2} />
        </mesh>
      </Float>

      {/* Competition sigils */}
      {categories.map((cat, i) => (
        <InteractiveObject key={cat.id} position={slots[i]} label={cat.id} onSelect={() => onSelect(cat.id)} hitRadius={1}>
          {(hovered) => (
            <Float speed={1.6} floatIntensity={0.6}>
              <Sigil color={hovered ? GOLD_BRIGHT : CYAN} emissiveIntensity={hovered ? 2.4 : 1.1} />
            </Float>
          )}
        </InteractiveObject>
      ))}

      <pointLight position={[0, 6.5, -14]} intensity={26} distance={18} decay={2} color={CYAN} />
      <pointLight position={[0, 2, -14]} intensity={14} distance={14} decay={2} color={GOLD} />
    </group>
  );
}
