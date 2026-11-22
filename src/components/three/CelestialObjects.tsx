import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const GOLD = '#d9ac4e';
const CYAN_GLOW = '#3fd9ee';

function Planet({ radius, color, emissive, distance, speed, offset }: {
  radius: number;
  color: string;
  emissive: string;
  distance: number;
  speed: number;
  offset: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * distance,
        Math.sin(t * 0.7) * 1.4 + 4.2,
        Math.sin(t) * distance
      );
    }
  });
  return (
    <group ref={ref}>
      <Float speed={1.4} floatIntensity={0.5} rotationIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[radius, 2]} />
          <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} emissive={emissive} emissiveIntensity={0.35} />
        </mesh>
        <mesh>
          <sphereGeometry args={[radius * 1.5, 16, 12]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </Float>
    </group>
  );
}

function Shard({ position, size }: { position: [number, number, number]; size: number }) {
  return (
    <Float speed={1.8} floatIntensity={0.9} rotationIntensity={1.4}>
      <mesh position={position} rotation={[0.4, 0.7, 0.2]}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.2} emissive={GOLD} emissiveIntensity={0.3} />
      </mesh>
    </Float>
  );
}

export default function CelestialObjects() {
  const shards = useMemo(() => {
    const arr: { position: [number, number, number]; size: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 6.5 + Math.random() * 6;
      arr.push({
        position: [Math.cos(a) * d, 1.5 + Math.random() * 7, Math.sin(a) * d],
        size: 0.08 + Math.random() * 0.18,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      <Planet radius={0.85} color="#c8b28a" emissive={GOLD} distance={11} speed={0.07} offset={0} />
      <Planet radius={0.5} color="#8fb8c9" emissive={CYAN_GLOW} distance={14} speed={-0.05} offset={2.4} />
      <Planet radius={0.32} color="#b7a37e" emissive={GOLD} distance={9} speed={0.11} offset={4.6} />
      {shards.map((s, i) => (
        <Shard key={i} position={s.position} size={s.size} />
      ))}
    </group>
  );
}
