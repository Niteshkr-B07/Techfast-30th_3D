import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import Scene from './three/Scene';

export default function ExperienceCanvas() {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      camera={{ position: [0, 4.2, 14.5], fov: 50, near: 0.1, far: 80 }}
    >
      <Scene />
      <Preload all />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
