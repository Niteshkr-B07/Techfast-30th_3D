import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InteractiveObject from './InteractiveObject';
import { SITE_CONTENT } from '../../data/event';

const GOLD = '#d9ac4e';
const GOLD_BRIGHT = '#f5dfa0';
const GOLD_DARK = '#6b511f';
const STONE = '#4a4438';
const STONE_DARK = '#2b2721';

function Column({ position, height = 3.2 }: { position: [number, number, number]; height?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, height, 12]} />
        <meshStandardMaterial color={STONE} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.16, 12]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      <mesh position={[0, height + 0.08, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.16, 12]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Arch({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const segments = 7;
  const arcs = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = [];
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const angle = Math.PI * t;
      arr.push({
        pos: [Math.cos(angle) * 1.4, Math.sin(angle) * 1.6, 0],
        rot: -angle,
      });
    }
    return arr;
  }, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {arcs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, 0, s.rot]}>
          <boxGeometry args={[0.16, 0.55, 0.4]} />
          <meshStandardMaterial color={STONE} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function Observatory() {
  const domeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (domeRef.current) {
      domeRef.current.position.y = 0.05 * Math.sin(t * 0.5);
    }
  });

  return (
    <group>
      {/* Tiered stone base */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[5.4, 6.2, 0.5, 48]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[4.6, 5.4, 0.4, 48]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[4.6, 0.09, 10, 64]} />
        <meshStandardMaterial color={GOLD_DARK} metalness={0.85} roughness={0.35} />
      </mesh>

      {/* Perimeter columns */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <Column key={i} position={[Math.cos(a) * 4.1, 0.6, Math.sin(a) * 4.1]} />;
      })}

      {/* Column ring capital ring */}
      <mesh position={[0, 4.05, 0]}>
        <torusGeometry args={[4.1, 0.12, 10, 64]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      {/* Arches over the ring */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <Arch key={i} position={[Math.cos(a) * 4.1, 4.2, Math.sin(a) * 4.1]} rotationY={-a} />;
      })}

      {/* Armillary dome skeleton above */}
      <group ref={domeRef} position={[0, 5.4, 0]}>
        <mesh>
          <sphereGeometry args={[2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={GOLD_DARK} metalness={0.9} roughness={0.3} wireframe />
        </mesh>
        <mesh rotation={[0.4, 0, 0.2]}>
          <torusGeometry args={[2.5, 0.04, 8, 64]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.25} />
        </mesh>
        <mesh rotation={[1.2, 0.6, -0.3]}>
          <torusGeometry args={[2.2, 0.04, 8, 64]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* Interactive historical artifacts on the platform rim */}
      {SITE_CONTENT.about.history.map((item, i) => {
        const a = (i / SITE_CONTENT.about.history.length) * Math.PI * 2 + Math.PI / 6;
        return (
          <InteractiveObject
            key={item.title}
            type="history"
            id={String(i)}
            tooltip={item.title}
            position={[Math.cos(a) * 2.6, 1.3, Math.sin(a) * 2.6]}
            hitRadius={0.55}
          >
            {(hovered, sel) => (
              <mesh rotation={[0.3, 0.5, 0.1]}>
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                  color={GOLD}
                  emissive={hovered || sel ? GOLD_BRIGHT : GOLD}
                  emissiveIntensity={hovered || sel ? 1.8 : 0.35}
                  metalness={0.92}
                  roughness={0.22}
                />
              </mesh>
            )}
          </InteractiveObject>
        );
      })}
    </group>
  );
}
