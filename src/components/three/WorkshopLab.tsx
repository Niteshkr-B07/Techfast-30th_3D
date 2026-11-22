import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveObject from './InteractiveObject';
import { SITE_CONTENT } from '../../data/event';

const CYAN = '#3fd9ee';
const CYAN_BRIGHT = '#7ff4ff';
const GOLD = '#d9ac4e';

interface LabProps {
  onSelect: (id: string) => void;
  animationSpeed: number;
}

function LabCore({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.7;
      ref.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial
          color="#0e2430"
          emissive={hovered ? CYAN_BRIGHT : CYAN}
          emissiveIntensity={hovered ? 2.6 : 1.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={hovered ? 0.7 : 0.35} />
      </mesh>
    </group>
  );
}

export default function WorkshopLab({ onSelect, animationSpeed }: LabProps) {
  const categories = SITE_CONTENT.workshops.categories;

  const stations = useMemo(
    () =>
      categories.map((_, i) => {
        const spread = (i - (categories.length - 1) / 2) * 3.2;
        return [spread, 2.8, -26.5] as [number, number, number];
      }),
    [categories.length]
  );

  const platform = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * animationSpeed;
    if (platform.current) platform.current.position.y = Math.sin(t * 0.8) * 0.15;
  });

  return (
    <group>
      {/* Laboratory platform */}
      <mesh position={[0, 0.4, -26.5]}>
        <boxGeometry args={[14, 0.5, 8]} />
        <meshStandardMaterial color="#1a1f33" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Cyan grid lines on platform */}
      <gridHelper args={[14, 14, CYAN, '#123243']} position={[0, 0.68, -26.5]} />

      {/* Central hologram pedestal */}
      <group ref={platform} position={[0, 0, -26.5]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.18, 0.3, 2, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.25} emissive={GOLD} emissiveIntensity={0.3} />
        </mesh>
        <Float speed={1.4} floatIntensity={0.7}>
          <mesh position={[0, 3, 0]}>
            <icosahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial color="#0e2430" emissive={CYAN} emissiveIntensity={2.4} metalness={0.5} roughness={0.2} />
          </mesh>
        </Float>
      </group>

      {/* Workshop stations */}
      {categories.map((ws, i) => (
        <InteractiveObject key={ws.id} position={stations[i]} label={ws.id} onSelect={() => onSelect(ws.id)} hitRadius={1}>
          {(hovered) => (
            <Float speed={1.5} floatIntensity={0.6}>
              <LabCore hovered={hovered} />
            </Float>
          )}
        </InteractiveObject>
      ))}

      {/* Ambient lab lights */}
      <pointLight position={[0, 6, -26.5]} intensity={30} distance={20} decay={2} color={CYAN} />
      <pointLight position={[-5, 3, -24]} intensity={8} distance={12} decay={2} color={GOLD} />
      <pointLight position={[5, 3, -29]} intensity={8} distance={12} decay={2} color={GOLD} />
    </group>
  );
}
