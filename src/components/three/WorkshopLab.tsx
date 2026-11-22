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
  const haloRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.7;
      ref.current.rotation.y = t * 0.5;
    }
    if (haloRef.current) {
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.1 + Math.sin(t * 1.8) * 0.06;
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
      {/* Outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.8, 14, 10]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function HoloGridPanel({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 1.3 + position[0]) * 0.06;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[2.5, 2]} />
      <meshBasicMaterial
        color={CYAN}
        wireframe
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function DataNode({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.8;
      ref.current.rotation.y = clock.getElapsedTime() * 0.6;
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.8;
    }
  });
  return (
    <Float speed={1.8} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <tetrahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#0a1a2a"
          emissive={CYAN}
          emissiveIntensity={1.5}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

function ScanBeam({ boundsZ }: { boundsZ: [number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const dir = useRef(1);
  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const speed = 2.5;
    ref.current.position.y += dir.current * speed * delta;
    if (ref.current.position.y > 5) dir.current = -1;
    if (ref.current.position.y < 0.7) dir.current = 1;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
  });
  return (
    <mesh ref={ref} position={[0, 2, (boundsZ[0] + boundsZ[1]) / 2]}>
      <planeGeometry args={[14, 0.08]} />
      <meshBasicMaterial
        color={CYAN}
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
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
    [categories]
  );

  const platform = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * animationSpeed;
    if (platform.current) platform.current.position.y = Math.sin(t * 0.8) * 0.15;
  });

  // Data nodes scattered around the lab
  const dataNodes: [number, number, number][] = [
    [-5.5, 3.5, -25],
    [5.5, 4, -26],
    [-3, 5, -28],
    [4, 3.2, -27.5],
    [-6, 4.5, -27],
    [6.5, 3.8, -25.5],
    [0, 5.5, -24.5],
    [2.5, 4.8, -29],
  ];

  return (
    <group>
      {/* Laboratory platform */}
      <mesh position={[0, 0.4, -26.5]}>
        <boxGeometry args={[14, 0.5, 8]} />
        <meshStandardMaterial color="#1a1f33" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Cyan grid lines on platform */}
      <gridHelper args={[14, 14, CYAN, '#123243']} position={[0, 0.68, -26.5]} />

      {/* Holographic grid panels */}
      <HoloGridPanel position={[-6.5, 3, -26.5]} rotation={[0, Math.PI / 2, 0]} />
      <HoloGridPanel position={[6.5, 3, -26.5]} rotation={[0, -Math.PI / 2, 0]} />
      <HoloGridPanel position={[0, 4, -30]} rotation={[0, 0, 0]} />

      {/* Scanning beam */}
      <ScanBeam boundsZ={[-30, -23]} />

      {/* Floating data nodes */}
      {dataNodes.map((pos, i) => (
        <DataNode key={i} position={pos} />
      ))}

      {/* Corner accent lights */}
      <pointLight position={[-7, 2, -24]} intensity={8} distance={8} decay={2} color={CYAN} />
      <pointLight position={[7, 2, -24]} intensity={8} distance={8} decay={2} color={CYAN} />
      <pointLight position={[-7, 2, -29]} intensity={8} distance={8} decay={2} color={GOLD} />
      <pointLight position={[7, 2, -29]} intensity={8} distance={8} decay={2} color={GOLD} />

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
