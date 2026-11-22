import { useRef, useState, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  setHovered,
  selectObject,
  useSelected,
  objectKey,
} from '../../store/interaction';

const setHoveredKey = setHovered;

interface InteractiveObjectProps {
  children: (hovered: boolean, selected: boolean) => ReactNode;
  /** Selection payload written to the central store on click */
  type?: string;
  id?: string;
  label?: string;
  onSelect?: () => void;
  position: [number, number, number];
  /** Tooltip text shown in the hotspot marker */
  tooltip?: string;
  hitRadius?: number;
  /** Show a floating HTML hotspot marker (immersive mode only) */
  hotspot?: boolean;
}

/**
 * Reusable interaction wrapper for every interactive 3D object:
 * hover glow state, smooth scale + click-pulse animation, cursor
 * changes, selected emphasis, optional floating hotspot, and
 * click-to-inspect through the central interaction store.
 */
export default function InteractiveObject({
  children,
  type,
  id,
  label,
  onSelect,
  position,
  tooltip,
  hitRadius = 1.2,
  hotspot = true,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(0);
  const group = useRef<THREE.Group>(null);
  const selected = useSelected();
  const isSel = Boolean(
    selected && (
      (type && id && selected.type === type && selected.id === id) ||
      (label && selected.id === label)
    )
  );
  const key = type && id ? objectKey(type, id) : (label || 'item');

  useFrame((_, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 0.05);
    let target = hovered || isSel ? 1.16 : 1;
    if (isSel) target = 1.1 + Math.sin(performance.now() / 400) * 0.04; // gentle breathing when selected
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 8, d);
    // Click feedback: brief extra pop that decays
    const p = 1 + pulse * 0.22;
    group.current.scale.setScalar(s * p);
    if (pulse > 0) setPulse((v) => Math.max(0, v - d * 4));
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredKey(key);
    document.body.style.cursor = 'pointer';
  };
  const onOut = () => {
    setHovered(false);
    setHoveredKey(null);
    document.body.style.cursor = 'auto';
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setPulse(1);
    if (onSelect) {
      onSelect();
    } else if (type && id) {
      selectObject({ type, id });
    }
  };

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
    >
      <mesh visible={false}>
        <sphereGeometry args={[hitRadius, 8, 8]} />
      </mesh>
      {children(hovered, isSel)}
      {hovered && <pointLight intensity={6} distance={4} decay={2} color="#f5dfa0" />}
      {hotspot && (
        <Html center distanceFactor={12} position={[0, hitRadius * 0.9, 0]} zIndexRange={[10, 0]}>
          <div
            className="pointer-events-none flex items-center gap-1.5"
            aria-hidden
          >
            <span
              className={`block h-2 w-2 rounded-full transition-colors duration-300 ${hovered || isSel ? 'bg-aether-300' : 'bg-gold-400'
                }`}
              style={{ boxShadow: '0 0 8px rgba(217,172,78,0.9)', animation: 'hotspot-float 2.4s ease-in-out infinite' }}
            />
            {hovered && (
              <span className="whitespace-nowrap border border-gold-500/40 bg-[#060812]/85 px-2 py-0.5 text-[10px] tracking-[0.2em] text-gold-300">
                {tooltip}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
