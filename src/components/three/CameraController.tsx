import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_STOPS } from '../../data/cameraStops';
import { getScrollProgress } from '../../store/scrollProgress';

// Scratch objects — reused every frame, never reallocated.
const posTarget = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const arcA = new THREE.Vector3();
const arcB = new THREE.Vector3();
const midPoint = new THREE.Vector3();
const camUp = new THREE.Vector3(0, 1, 0);

/** Smoothstep keeps velocity at zero at each stop — no visible jumps. */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

interface CameraControllerProps {
  /** Procedural sway enabled (immersive mode, motion allowed) */
  sway: boolean;
  /** Global animation speed multiplier from the performance mode */
  animationSpeed: number;
}

/**
 * Centralized cinematic camera controller.
 *
 * Per frame, all inside useFrame — zero React re-renders:
 *   1. Read scroll progress from the external store.
 *   2. Damp a smoothed value toward it (no sudden jumps, works both ways).
 *   3. Interpolate position along a bowed quadratic arc between stops
 *      so transitions sweep outward instead of cutting straight lines.
 *   4. Interpolate lookAt, roll (up-vector tilt) and fov.
 *   5. Procedural sway is a small offset added AFTER the base path and
 *      fades out mid-flight, so it never fights the scroll animation.
 */
export default function CameraController({ sway, animationSpeed }: CameraControllerProps) {
  const { camera } = useThree();
  const smooth = useRef(0);
  const driftPhase = useRef(Math.random() * Math.PI * 2);
  const initialized = useRef(false);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const raw = getScrollProgress();
    smooth.current = THREE.MathUtils.damp(smooth.current, raw, 4, clampedDelta);

    const stops = CAMERA_STOPS;
    const t = smooth.current * (stops.length - 1);
    const i = Math.min(Math.floor(t), stops.length - 2);
    const local = t - i;
    const a = stops[i];
    const b = stops[i + 1];
    const e = smoothstep(local);

    // --- Position: bowed arc between the two stops -----------------
    arcA.set(...a.position);
    arcB.set(...b.position);
    midPoint.lerpVectors(arcA, arcB, 0.5);
    // Lift and side-bend the control point so the path arcs in 3D
    midPoint.y += 0.55;
    midPoint.x += (midPoint.x >= 0 ? 1 : -1) * 0.4;

    const ie = 1 - e;
    posTarget
      .copy(arcA).multiplyScalar(ie * ie)
      .addScaledVector(midPoint, 2 * ie * e)
      .addScaledVector(arcB, e * e);

    // --- Idle drift while resting at a stop -------------------------
    const time = state.clock.elapsedTime * animationSpeed + driftPhase.current;
    const rest = 1 - Math.sin(Math.PI * local); // 1 at stops, 0 mid-flight
    if (sway) {
      const dx = a.drift[0] * ie + b.drift[0] * e;
      const dy = a.drift[1] * ie + b.drift[1] * e;
      const dz = a.drift[2] * ie + b.drift[2] * e;
      posTarget.x += Math.sin(time * 0.32) * dx * rest;
      posTarget.y += Math.sin(time * 0.21 + 1.3) * dy * rest;
      posTarget.z += Math.cos(time * 0.27 + 2.1) * dz * rest;
    }

    // --- Look-at ----------------------------------------------------
    lookTarget.set(
      THREE.MathUtils.lerp(a.lookAt[0], b.lookAt[0], e),
      THREE.MathUtils.lerp(a.lookAt[1], b.lookAt[1], e),
      THREE.MathUtils.lerp(a.lookAt[2], b.lookAt[2], e)
    );
    if (sway) {
      lookTarget.x += Math.sin(time * 0.17) * 0.35 * rest;
      lookTarget.y += Math.cos(time * 0.13) * 0.2 * rest;
    }

    // --- Apply with damping (handles nav clicks + fast scroll) ------
    if (!initialized.current) {
      camera.position.copy(posTarget);
      initialized.current = true;
    } else {
      camera.position.lerp(posTarget, 1 - Math.exp(-7 * clampedDelta));
    }

    const cam = camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, e);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, fov, 4, clampedDelta);
      cam.updateProjectionMatrix();
    }

    // Roll applied via up-vector tilt so it composes with lookAt smoothly
    const roll = THREE.MathUtils.lerp(a.roll, b.roll, e);
    camUp.set(Math.sin(roll), Math.cos(roll), 0);
    camera.up.copy(camUp);
    camera.lookAt(lookTarget);
  });

  return null;
}
