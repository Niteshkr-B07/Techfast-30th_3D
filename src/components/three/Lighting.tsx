import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getScrollProgress } from '../../store/scrollProgress';

const GOLD = '#d9ac4e';
const GOLD_BRIGHT = '#f5dfa0';

/** Zone center positions along the route (matches cameraStops). */
const ZONES = [
  { z: 2, color: '#f8ecc4' }, // hero / about — observatory
  { z: -14, color: '#3fd9ee' }, // competitions — arena
  { z: -26.5, color: '#3fd9ee' }, // workshops — lab
  { z: -34.5, color: '#f8ecc4' }, // accommodation — campus
  { z: -46, color: '#d9ac4e' }, // ca — globe
];

interface ZoneLight {
  light: THREE.PointLight;
  color: THREE.Color;
  baseIntensity: number;
}

/**
 * One roaming point light per zone plus a fill that follows the
 * camera. Each zone light brightens as the camera nears it and dims
 * as it departs — smooth lighting transitions, no steps.
 */
export default function Lighting({ immersive }: { immersive: boolean }) {
  const { camera } = useThree();
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const rimGold = useRef<THREE.DirectionalLight>(null);
  const domeSpot = useRef<THREE.SpotLight>(null);
  const zoneRefs = useRef<(THREE.PointLight | null)[]>([]);
  const zoneMeta = useRef<ZoneLight[]>([]);

  if (zoneMeta.current.length === 0) {
    zoneMeta.current = ZONES.map((z) => ({
      light: null as unknown as THREE.PointLight,
      color: new THREE.Color(z.color),
      baseIntensity: immersive ? 26 : 34,
    }));
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const camZ = camera.position.z;
    const progress = getScrollProgress();

    if (key.current) {
      key.current.position.set(Math.cos(t * 0.05) * 10, 12, -20 + Math.sin(t * 0.05) * 10);
      key.current.intensity = immersive ? 1.4 : 1.4;
    }

    // Warm golden rim from above-behind
    if (rimGold.current) {
      rimGold.current.position.set(-6, 14, 8);
    }

    // Dome spotlight slow drift
    if (domeSpot.current) {
      domeSpot.current.position.set(Math.sin(t * 0.07) * 2, 18, 2 + Math.cos(t * 0.07) * 1.5);
    }

    // Fill light travels just ahead of the camera
    if (fill.current) {
      fill.current.position.set(camera.position.x, camera.position.y + 2, camZ - 3);
      fill.current.intensity = 10 + Math.sin(t * 0.7) * 2;
    }

    const damp = 1 - Math.exp(-4 * Math.min(delta, 0.05));
    zoneMeta.current.forEach((meta, i) => {
      const light = zoneRefs.current[i];
      if (!light) return;
      const z = ZONES[i].z;
      // 1 when camera is at the zone, fades over ~9 world units
      const near = Math.max(0, 1 - Math.abs(camZ - z) / 9);
      const flicker = Math.sin(t * (0.8 + i * 0.17) + i * 2.4) * 0.12;
      const target = meta.baseIntensity * (0.25 + near * 0.75) * (1 + flicker * (immersive ? 1 : 0));
      light.intensity = THREE.MathUtils.lerp(light.intensity, target, damp);
      // Subtle golden<->cyan hue drift near transitions
      light.color.lerp(meta.color, damp);
    });
    void progress;
  });

  return (
    <>
      {/* Reduced ambient for more drama in immersive */}
      <ambientLight intensity={immersive ? 0.12 : 0.3} color="#8ea0c0" />
      {/* Cool blue hemisphere from below */}
      <hemisphereLight args={['#3a4a6b', '#0a1230', immersive ? 0.3 : 0.5]} />
      {/* Key directional */}
      <directionalLight ref={key} position={[8, 12, -14]} intensity={immersive ? 1.4 : 1.4} color={GOLD} />
      {/* Warm golden rim from above-behind */}
      <directionalLight ref={rimGold} position={[-6, 14, 8]} intensity={immersive ? 0.6 : 0.3} color={GOLD_BRIGHT} />
      {/* Fill follows camera */}
      <pointLight ref={fill} position={[0, 6, 0]} intensity={10} distance={26} decay={2} color="#8ea0c0" />

      {/* Observatory / about */}
      <spotLight position={[0, 14, 2]} angle={0.6} penumbra={0.9} intensity={immersive ? 140 : 80} distance={30} decay={2} color="#f8ecc4" />
      <pointLight position={[0, 0.6, 0]} intensity={20} distance={12} decay={2} color={GOLD} />

      {/* Subtle dome spotlight */}
      {immersive && (
        <spotLight
          ref={domeSpot}
          position={[0, 18, 2]}
          target-position={[0, 5.4, 0]}
          angle={0.25}
          penumbra={0.85}
          intensity={60}
          distance={28}
          decay={2}
          color={GOLD_BRIGHT}
        />
      )}

      {/* Zone point lights */}
      {ZONES.map((z, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            zoneRefs.current[i] = el;
          }}
          position={[0, 6, z.z]}
          intensity={6}
          distance={22}
          decay={2}
          color={z.color}
        />
      ))}

      {/* Accent point lights at arena z=-14 and lab z=-26.5 */}
      <pointLight position={[-4, 4, -14]} intensity={immersive ? 18 : 10} distance={16} decay={2} color="#3fd9ee" />
      <pointLight position={[4, 4, -26.5]} intensity={immersive ? 18 : 10} distance={16} decay={2} color="#3fd9ee" />
    </>
  );
}
