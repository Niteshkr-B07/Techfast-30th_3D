import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_STOPS } from '../../data/cameraStops';

const tmpTarget = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

/**
 * Drives the camera along CAMERA_STOPS based on overall scroll
 * progress (0..1) written to window.__scrollProgress by ScrollTrigger.
 * Uses damping for smooth interpolation plus gentle procedural sway.
 */
export default function CameraRig({ sway }: { sway: boolean }) {
  const { camera } = useThree();
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    const raw = (window as unknown as { __scrollProgress?: number }).__scrollProgress ?? 0;
    progressRef.current = THREE.MathUtils.damp(progressRef.current, raw, 4, delta);

    const stops = CAMERA_STOPS;
    const t = progressRef.current * (stops.length - 1);
    const i = Math.min(Math.floor(t), stops.length - 2);
    const local = t - i;

    const ease = local * local * (3 - 2 * local);
    const a = stops[i];
    const b = stops[i + 1];

    tmpTarget.set(
      THREE.MathUtils.lerp(a.position[0], b.position[0], ease),
      THREE.MathUtils.lerp(a.position[1], b.position[1], ease),
      THREE.MathUtils.lerp(a.position[2], b.position[2], ease)
    );
    lookTarget.set(
      THREE.MathUtils.lerp(a.lookAt[0], b.lookAt[0], ease),
      THREE.MathUtils.lerp(a.lookAt[1], b.lookAt[1], ease),
      THREE.MathUtils.lerp(a.lookAt[2], b.lookAt[2], ease)
    );

    if (sway) {
      const time = performance.now() / 1000;
      tmpTarget.x += Math.sin(time * 0.35) * 0.22;
      tmpTarget.y += Math.cos(time * 0.28) * 0.14;
    }

    camera.position.lerp(tmpTarget, 1 - Math.exp(-6 * delta));
    camera.lookAt(lookTarget);
  });

  return null;
}
