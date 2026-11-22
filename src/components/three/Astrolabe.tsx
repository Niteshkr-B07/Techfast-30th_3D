import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { setHovered, selectObject, useSelected } from '../../store/interaction';

const setHoveredKey = setHovered;

const GOLD = '#d9ac4e';
const GOLD_BRIGHT = '#f5dfa0';

function Ring({
  radius,
  thickness = 0.045,
  color = GOLD,
  emissiveIntensity = 0.3,
  highlight = false,
}: {
  radius: number;
  thickness?: number;
  color?: string;
  emissiveIntensity?: number;
  highlight?: boolean;
}) {
  return (
    <mesh>
      <torusGeometry args={[radius, thickness, 12, 96]} />
      <meshStandardMaterial
        color={highlight ? GOLD_BRIGHT : color}
        metalness={0.95}
        roughness={highlight ? 0.12 : 0.22}
        emissive={highlight ? GOLD_BRIGHT : color}
        emissiveIntensity={highlight ? emissiveIntensity + 0.9 : emissiveIntensity}
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
  const [hovered, setHovered] = useState(false);
  const selected = useSelected();
  const isSel = !!selected && selected.type === 'about' && selected.id === 'astrolabe';
  const lit = hovered || isSel;

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

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredKey('about:astrolabe');
    document.body.style.cursor = 'pointer';
  };
  const onOut = () => {
    setHovered(false);
    setHoveredKey(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={whole}
      position={[0, 3.4, 0]}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={(e) => {
        e.stopPropagation();
        selectObject({ type: 'about', id: 'astrolabe' });
      }}
    >
      {/* Outer fixed band */}
      <group ref={outer}>
        <Ring radius={2.05} thickness={0.06} highlight={lit} />
        <Ring radius={1.85} thickness={0.03} color={GOLD_BRIGHT} emissiveIntensity={0.5} highlight={lit} />
        <Spokes radius={1.95} count={12} />
      </group>

      {/* Middle tilted ring */}
      <group ref={middle} rotation={[Math.PI / 2.4, 0, 0]}>
        <Ring radius={1.55} thickness={0.045} color={GOLD_BRIGHT} emissiveIntensity={0.45} highlight={lit} />
        <Spokes radius={1.55} count={8} />
      </group>

      {/* Inner gimbal */}
      <group ref={inner} rotation={[0.4, 0, 0]}>
        <Ring radius={1.15} thickness={0.04} emissiveIntensity={0.4} highlight={lit} />
        <Ring radius={0.9} thickness={0.03} color={GOLD_BRIGHT} emissiveIntensity={0.55} highlight={lit} />
      </group>

      {/* Glowing core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#1b3a4a"
          emissive="#3fd9ee"
          emissiveIntensity={lit ? 3.4 : 2.2}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>
      {lit && <pointLight color={GOLD_BRIGHT} intensity={8} distance={7} decay={2} />}
      <pointLight color="#3fd9ee" intensity={12} distance={9} decay={2} />
    </group>
  );
}
