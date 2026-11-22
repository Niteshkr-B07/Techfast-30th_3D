import { useRef, useState, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveObjectProps {
  children: (hovered: boolean) => ReactNode;
  onSelect: () => void;
  position: [number, number, number];
  label: string;
  /** Radius used for the invisible pointer-catcher sphere */
  hitRadius?: number;
}

/**
 * Wraps a 3D object with hover glow state, smooth scale animation,
 * pointer cursor, and click-to-inspect behavior.
 */
export default function InteractiveObject({ children, onSelect, position, label, hitRadius = 1.2 }: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.16 : 1;
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 8, delta);
    group.current.scale.setScalar(s);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const onOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <mesh visible={false}>
        <sphereGeometry args={[hitRadius, 8, 8]} />
      </mesh>
      {children(hovered)}
      {hovered && (
        <pointLight intensity={6} distance={4} decay={2} color="#f5dfa0" />
      )}
      <mesh visible={false} name={`hit-${label}`} />
    </group>
  );
}
