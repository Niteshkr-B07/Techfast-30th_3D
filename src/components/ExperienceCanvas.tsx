import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import Scene from './three/Scene';

interface ExperienceCanvasProps {
  immersive: boolean;
  onSelect: (panel: { type: string; id: string } | null) => void;
}

export default function ExperienceCanvas({ immersive, onSelect }: ExperienceCanvasProps) {
  const [failed, setFailed] = useState(false);
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.0003, 0.0003), []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={immersive ? [1, 1.75] : [0.75, 1]}
        gl={{ antialias: immersive, powerPreference: 'high-performance', alpha: false }}
        camera={{ position: [0, 4.2, 14.5], fov: 50, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          const handleLost = (e: Event) => {
            e.preventDefault();
            setFailed(true);
          };
          const handleRestored = () => {
            setFailed(false);
          };
          dom.addEventListener('webglcontextlost', handleLost);
          dom.addEventListener('webglcontextrestored', handleRestored);
        }}
      >
        <Scene immersive={immersive} onSelect={onSelect} />
        {immersive && (
          <EffectComposer>
            <Bloom intensity={0.75} luminanceThreshold={0.45} luminanceSmoothing={0.6} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
            <ChromaticAberration
              offset={chromaticOffset}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
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
