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

function EnergyPylon({ position }: { position: [number, number, number] }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      const m = sphereRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 2.5 + position[0]) * 0.8;
    }
  });
  return (
    <group position={position}>
      {/* Pylon shaft */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 3, 8]} />
        <meshStandardMaterial color={STONE} roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Glowing top sphere */}
      <mesh ref={sphereRef} position={[0, 3.1, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color="#0a1a2a"
          emissive={CYAN}
          emissiveIntensity={1.5}
          metalness={0.6}
          roughness={0.2}
        />
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
  }, [categories]);

  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring.current) ring.current.rotation.z = t * 0.15 * animationSpeed;
    if (ring2.current) ring2.current.rotation.z = -t * 0.22 * animationSpeed;
    if (ring3.current) {
      ring3.current.rotation.z = t * 0.1 * animationSpeed;
      ring3.current.rotation.x = t * 0.08 * animationSpeed;
    }
    if (ring4.current) ring4.current.rotation.y = t * 0.18 * animationSpeed;
    if (haloRef.current) {
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.12 + Math.sin(t * 1.4) * 0.07;
    }
  });

  // 4 cardinal energy pylon positions
  const pylonPositions: [number, number, number][] = [
    [5, 0.6, -14],
    [-5, 0.6, -14],
    [0, 0.6, -14 + 5],
    [0, 0.6, -14 - 5],
  ];

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

      {/* Floor emissive grid lines (3 concentric rings) */}
      <mesh position={[0, 0.92, -14]}>
        <torusGeometry args={[2.8, 0.025, 6, 64]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.92, -14]}>
        <torusGeometry args={[4.2, 0.02, 6, 64]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Primary floating rune ring */}
      <mesh ref={ring} position={[0, 5.4, -14]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[4.8, 0.035, 8, 80]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.4} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Additional rune rings at different heights/tilts */}
      <mesh ref={ring2} position={[0, 7.2, -14]} rotation={[Math.PI / 3, 0.5, 0]}>
        <torusGeometry args={[3.5, 0.025, 8, 72]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.9} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={ring3} position={[0, 4.0, -14]} rotation={[Math.PI / 1.8, 1.0, 0]}>
        <torusGeometry args={[5.4, 0.02, 8, 72]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh ref={ring4} position={[0, 6.0, -14]} rotation={[0.6, 0, Math.PI / 4]}>
        <torusGeometry args={[2.8, 0.03, 8, 64]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={1.1} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Energy pylons at cardinal points */}
      {pylonPositions.map((pos, i) => (
        <EnergyPylon key={i} position={pos} />
      ))}

      {/* 4 spotlights aimed at sigil positions from above */}
      {slots.map((pos, i) => (
        <spotLight
          key={i}
          position={[pos[0] * 0.5, 10, pos[2]]}
          angle={0.3}
          penumbra={0.8}
          intensity={30}
          distance={20}
          decay={2}
          color={i % 2 === 0 ? CYAN : GOLD}
        />
      ))}

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
        {/* Secondary glow halo for icosahedron */}
        <mesh ref={haloRef} position={[0, 5.3, -14]}>
          <sphereGeometry args={[0.75, 16, 12]} />
          <meshBasicMaterial
            color={CYAN}
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
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
