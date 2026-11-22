import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#3fd9ee';

function HoloPanel({
  position,
  rotationY,
  w = 1.5,
  h = 2.2,
}: {
  position: [number, number, number];
  rotationY: number;
  w?: number;
  h?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const scanMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      const m = ref.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.22 + Math.sin(t * 2 + position[0]) * 0.06;
    }
    // Animate emissive pulse on standard mat
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.5 + Math.sin(t * 1.5 + position[2]) * 0.3;
    }
    // Scan line sweeps up and down within panel
    if (scanRef.current) {
      const sweep = (Math.sin(t * 0.9 + position[0]) * 0.5 + 0.5) * h - h / 2;
      scanRef.current.position.y = sweep;
    }
    if (scanMatRef.current) {
      scanMatRef.current.opacity = 0.4 + Math.sin(t * 2.2) * 0.2;
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0}>
      <group position={position} rotation={[0, rotationY, 0]}>
        {/* Main holographic plane */}
        <mesh ref={ref}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            color={CYAN}
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Outline rings top/bottom */}
        <mesh position={[0, h / 2, 0]}>
          <planeGeometry args={[w, 0.03]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[0, -h / 2, 0]}>
          <planeGeometry args={[w, 0.03]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* Scan line */}
        <mesh ref={scanRef} position={[0, 0, 0.001]}>
          <planeGeometry args={[w, 0.04]} />
          <meshBasicMaterial
            ref={scanMatRef}
            color={CYAN}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
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
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function HoloSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
      ref.current.rotation.x = clock.getElapsedTime() * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={[0, 2, -3]}>
      <sphereGeometry args={[0.6, 16, 12]} />
      <meshBasicMaterial
        color={CYAN}
        wireframe
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
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
      {/* Central holographic sphere in observatory */}
      <HoloSphere />
      {/* Soft cyan rim light from holograms */}
      <pointLight position={[0, 5, -6]} color={CYAN} intensity={18} distance={22} decay={2} />
    </group>
  );
}
