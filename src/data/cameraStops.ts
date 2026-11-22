export interface CameraStop {
  id: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  /** Camera roll in radians at this stop (subtle cinematic tilt) */
  roll: number;
  /** Field of view at this stop — wider for establishing shots, tighter for focus */
  fov: number;
  /** Slow drifting motion while idle at this stop */
  drift: [number, number, number];
}

/**
 * Scroll route through the world. Each environment sits at a
 * different depth so the camera travels forward through space.
 * Positions frame each environment so it stays recognizable while
 * HTML content sits over it.
 */
export const CAMERA_STOPS: CameraStop[] = [
  // HERO — wide establishing shot of the observatory
  {
    id: 'hero',
    position: [0, 4.2, 14.5],
    lookAt: [0, 3.4, 0],
    roll: 0,
    fov: 50,
    drift: [0.5, 0.25, 0.3],
  },
  // ABOUT — travels in, angled view revealing architecture depth
  {
    id: 'about',
    position: [-6.5, 5.4, 8.2],
    lookAt: [0.8, 4, 0],
    roll: -0.03,
    fov: 48,
    drift: [0.4, 0.2, 0.25],
  },
  // COMPETITIONS — slight rotation reveal of the arena
  {
    id: 'competitions',
    position: [1.8, 3.6, -5.2],
    lookAt: [-0.6, 2.6, -14],
    roll: 0.035,
    fov: 52,
    drift: [0.45, 0.2, 0.3],
  },
  // WORKSHOPS — inside the holographic lab
  {
    id: 'workshops',
    position: [6.2, 4.4, -17.2],
    lookAt: [-4, 3.2, -24],
    roll: -0.03,
    fov: 50,
    drift: [0.35, 0.3, 0.25],
  },
  // ACCOMMODATION — cinematic angle over the campus
  {
    id: 'accommodation',
    position: [-5.5, 5.4, -27.5],
    lookAt: [3.5, 2.6, -34.5],
    roll: 0.03,
    fov: 48,
    drift: [0.4, 0.25, 0.3],
  },
  // CA — final approach to the golden globe
  {
    id: 'ca',
    position: [0, 7.2, -37.5],
    lookAt: [0, 8.5, -48],
    roll: 0,
    fov: 46,
    drift: [0.3, 0.35, 0.2],
  },
];
