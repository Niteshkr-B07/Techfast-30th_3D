import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#d9ac4e';

/** Camera travels to z≈-48, so lights follow along the route. */
export default function Lighting({ immersive }: { immersive: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (key.current) {
      key.current.position.set(Math.cos(t * 0.05) * 10, 12, -20 + Math.sin(t * 0.05) * 10);
    }
  });

  return (
    <>
      <ambientLight intensity={immersive ? 0.18 : 0.3} color="#8ea0c0" />
      <hemisphereLight args={['#3a4a6b', '#120d06', immersive ? 0.35 : 0.5]} />
      <directionalLight ref={key} position={[8, 12, -14]} intensity={immersive ? 1.1 : 1.4} color={GOLD} />

      {/* Observatory / about */}
      <spotLight position={[0, 14, 2]} angle={0.6} penumbra={0.9} intensity={immersive ? 140 : 80} distance={30} decay={2} color="#f8ecc4" />
      <pointLight position={[0, 0.6, 0]} intensity={20} distance={12} decay={2} color={GOLD} />
      <pointLight position={[0, 7, 10]} intensity={8} distance={20} decay={2} color="#3fd9ee" />
      {!immersive && <pointLight position={[0, 6, -14]} intensity={30} distance={22} decay={2} color="#3fd9ee" />}

      {/* Workshops */}
      <pointLight position={[0, 6, -26.5]} intensity={immersive ? 0 : 24} distance={22} decay={2} color="#3fd9ee" />

      {/* Campus */}
      <pointLight position={[0, 7, -34.5]} intensity={immersive ? 0 : 18} distance={20} decay={2} color="#f8ecc4" />

      {/* CA globe */}
      <pointLight position={[0, 9, -46]} intensity={immersive ? 0 : 26} distance={26} decay={2} color={GOLD} />
    </>
  );
}
