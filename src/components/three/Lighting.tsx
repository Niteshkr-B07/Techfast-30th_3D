import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#d9ac4e';

export default function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (key.current) {
      key.current.position.set(Math.cos(t * 0.05) * 10, 12, Math.sin(t * 0.05) * 10);
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} color="#8ea0c0" />
      <hemisphereLight args={['#3a4a6b', '#120d06', 0.35]} />
      <directionalLight ref={key} position={[8, 12, 6]} intensity={1.1} color={GOLD} />
      <spotLight
        position={[0, 14, 2]}
        angle={0.6}
        penumbra={0.9}
        intensity={140}
        distance={30}
        decay={2}
        color="#f8ecc4"
      />
      <pointLight position={[0, 0.6, 0]} intensity={20} distance={12} decay={2} color={GOLD} />
      <pointLight position={[0, 7, 10]} intensity={8} distance={20} decay={2} color="#3fd9ee" />
    </>
  );
}
