import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#d9ac4e';
const GOLD_BRIGHT = '#f5dfa0';

function Ring({
  radius,
  thickness = 0.045,
  color = GOLD,
  emissiveIntensity = 0.3,
}: {
  radius: number;
  thickness?: number;
  color?: string;
  emissiveIntensity?: number;
}) {
  return (
    <mesh>
      <torusGeometry args={[radius, thickness, 12, 96]} />
      <meshStandardMaterial
        color={color}
        metalness={0.95}
        roughness={0.22}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

function Spokes({ radius, count, color = GOLD }: { radius: number; count: number; color?: string }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} rotation={[0, 0, a]}>
            <boxGeometry args={[radius * 2, 0.02, 0.02]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} emissive={color} emissiveIntensity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Astrolabe() {
  const outer = useRef<THREE.Group>(null);
  const middle = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const whole = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outer.current) outer.current.rotation.z = t * 0.12;
    if (middle.current) middle.current.rotation.z = -t * 0.2;
    if (inner.current) {
      inner.current.rotation.z = t * 0.32;
      inner.current.rotation.x = Math.sin(t * 0.4) * 0.35;
    }
    if (core.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.06;
      core.current.scale.setScalar(s);
    }
    if (whole.current) {
      whole.current.rotation.y = Math.sin(t * 0.15) * 0.25;
      whole.current.position.y = 3.4 + Math.sin(t * 0.6) * 0.08;
    }
  });

  return (
    <group ref={whole} position={[0, 3.4, 0]}>
      {/* Outer fixed band */}
      <group ref={outer}>
        <Ring radius={2.05} thickness={0.06} />
        <Ring radius={1.85} thickness={0.03} color={GOLD_BRIGHT} emissiveIntensity={0.5} />
        <Spokes radius={1.95} count={12} />
      </group>

      {/* Middle tilted ring */}
      <group ref={middle} rotation={[Math.PI / 2.4, 0, 0]}>
        <Ring radius={1.55} thickness={0.045} color={GOLD_BRIGHT} emissiveIntensity={0.45} />
        <Spokes radius={1.55} count={8} />
      </group>

      {/* Inner gimbal */}
      <group ref={inner} rotation={[0.4, 0, 0]}>
        <Ring radius={1.15} thickness={0.04} emissiveIntensity={0.4} />
        <Ring radius={0.9} thickness={0.03} color={GOLD_BRIGHT} emissiveIntensity={0.55} />
      </group>

      {/* Glowing core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#1b3a4a"
          emissive="#3fd9ee"
          emissiveIntensity={2.2}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>
      <pointLight color="#3fd9ee" intensity={12} distance={9} decay={2} />
    </group>
  );
}
