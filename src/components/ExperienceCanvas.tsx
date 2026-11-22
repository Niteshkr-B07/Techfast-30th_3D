import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Scene from './three/Scene';

interface ExperienceCanvasProps {
  immersive: boolean;
  onSelect: (panel: { type: string; id: string } | null) => void;
}

export default function ExperienceCanvas({ immersive, onSelect }: ExperienceCanvasProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={immersive ? [1, 1.75] : [0.75, 1]}
        gl={{ antialias: immersive, powerPreference: 'high-performance', alpha: false }}
        camera={{ position: [0, 4.2, 14.5], fov: 50, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => setFailed(true));
        }}
      >
        <Scene immersive={immersive} onSelect={onSelect} />
        {immersive && (
          <EffectComposer>
            <Bloom intensity={0.55} luminanceThreshold={0.55} luminanceSmoothing={0.5} mipmapBlur />
          </EffectComposer>
        )}
        <Preload all />
        <AdaptiveDpr pixelated />
      </Canvas>
      {failed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#030409]/80">
          <p className="text-sm tracking-[0.25em] text-gold-300/80">
            3D VIEW UNAVAILABLE — CONTENT REMAINS ACCESSIBLE BELOW
          </p>
        </div>
      )}
    </div>
  );
}
