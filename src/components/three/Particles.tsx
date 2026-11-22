import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  /** Depth range of the world the dust should span */
  spreadZ?: number;
  /** Center offset along Z so particles cover the whole route */
  offsetZ?: number;
  immersive?: boolean;
}

function GoldenDust({
  count,
  spreadZ,
  offsetZ,
}: {
  count: number;
  spreadZ: number;
  offsetZ: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = Math.random() * 16 - 2;
      positions[i * 3 + 2] = offsetZ + Math.random() * spreadZ;
      speeds[i] = 0.03 + Math.random() * 0.08; // slower
    }
    return { positions, speeds };
  }, [count, spreadZ, offsetZ]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const attr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * delta;
      if (y > 14) y = -2;
      attr.setY(i, y);
      // Gentle horizontal sway
      const x = attr.getX(i) + Math.sin(t * 0.3 + i * 0.7) * 0.001;
      attr.setX(i, x);
    }
    attr.needsUpdate = true;
    ref.current.rotation.y = t * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#f5dfa0"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function CyanSpecks({
  count,
  spreadZ,
  offsetZ,
}: {
  count: number;
  spreadZ: number;
  offsetZ: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = Math.random() * 14 - 2;
      positions[i * 3 + 2] = offsetZ + Math.random() * spreadZ;
      speeds[i] = 0.1 + Math.random() * 0.22; // faster
    }
    return { positions, speeds };
  }, [count, spreadZ, offsetZ]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const attr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * delta;
      if (y > 12) y = -2;
      attr.setY(i, y);
      // faster sway
      const x = attr.getX(i) + Math.sin(t * 0.6 + i * 1.2) * 0.0015;
      attr.setX(i, x);
    }
    attr.needsUpdate = true;
    ref.current.rotation.y = -t * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3fd9ee"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function StarField({
  count,
  spreadZ,
  offsetZ,
}: {
  count: number;
  spreadZ: number;
  offsetZ: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 30 + 5; // higher up
      positions[i * 3 + 2] = offsetZ + Math.random() * spreadZ;
    }
    return positions;
  }, [count, spreadZ, offsetZ]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Particles({
  count = 700,
  spreadZ = 70,
  offsetZ = -40,
  immersive = true,
}: ParticlesProps) {
  // Split: golden 60%, cyan 25%, stars 15%
  const scale = immersive ? 1 : 0.4;
  const totalCount = Math.floor(count * scale);
  const goldenCount = Math.floor(totalCount * 0.6);
  const cyanCount = Math.floor(totalCount * 0.25);
  const starCount = Math.floor(totalCount * 0.15);

  return (
    <group>
      <GoldenDust count={goldenCount} spreadZ={spreadZ} offsetZ={offsetZ} />
      <CyanSpecks count={cyanCount} spreadZ={spreadZ} offsetZ={offsetZ} />
      <StarField count={starCount} spreadZ={spreadZ} offsetZ={offsetZ} />
    </group>
  );
}
