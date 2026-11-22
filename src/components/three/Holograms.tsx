import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#3fd9ee';

function HoloPanel({ position, rotationY, w = 1.5, h = 2.2 }: { position: [number, number, number]; rotationY: number; w?: number; h?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.22 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.06;
    }
  });
  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0}>
      <mesh ref={ref} position={position} rotation={[0, rotationY, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.22} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </Float>
  );
}

function HoloColumn({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.4;
  });
  return (
    <Float speed={1.6} floatIntensity={0.7} rotationIntensity={0}>
      <mesh ref={ref} position={position}>
        <cylinderGeometry args={[0.35, 0.35, 2.6, 6, 1, true]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.16} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} wireframe />
      </mesh>
    </Float>
  );
}

export default function Holograms() {
  const panels = useMemo(
    () => [
      { position: [-6.2, 3.6, -2.5] as [number, number, number], rotationY: Math.PI / 5 },
      { position: [6.4, 4.2, -1.8] as [number, number, number], rotationY: -Math.PI / 5 },
      { position: [-4.6, 5.4, -5.5] as [number, number, number], rotationY: Math.PI / 6, w: 1.1, h: 1.6 },
      { position: [5.1, 5.8, -5.0] as [number, number, number], rotationY: -Math.PI / 6, w: 1.1, h: 1.6 },
    ],
    []
  );
  const columns = useMemo(
    () => [
      [-7.4, 2.6, -6.5] as [number, number, number],
      [7.6, 2.2, -6.0] as [number, number, number],
      [0, 6.6, -8.5] as [number, number, number],
    ],
    []
  );

  return (
    <group>
      {panels.map((p, i) => (
        <HoloPanel key={i} {...p} />
      ))}
      {columns.map((pos, i) => (
        <HoloColumn key={i} position={pos} />
      ))}
      {/* soft cyan rim light from holograms */}
      <pointLight position={[0, 5, -6]} color={CYAN} intensity={18} distance={22} decay={2} />
    </group>
  );
}
