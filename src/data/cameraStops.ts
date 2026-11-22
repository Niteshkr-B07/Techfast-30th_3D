export interface CameraStop {
  id: string;
  position: [number, number, number];
  lookAt: [number, number, number];
}

/**
 * Scroll route through the world. Each environment sits at a
 * different depth so the camera travels forward through space.
 */
export const CAMERA_STOPS: CameraStop[] = [
  { id: 'hero', position: [0, 4.2, 14.5], lookAt: [0, 3.4, 0] },
  { id: 'about', position: [-7.5, 5.2, 7.5], lookAt: [0, 4, 0] },
  { id: 'competitions', position: [0, 3.2, -5.5], lookAt: [0, 2.6, -14] },
  { id: 'workshops', position: [6.5, 4.2, -17.5], lookAt: [-4, 3.2, -24] },
  { id: 'accommodation', position: [-6, 5, -28], lookAt: [4, 2.6, -34.5] },
  { id: 'ca', position: [0, 6, -38.5], lookAt: [0, 8.5, -48] },
];
