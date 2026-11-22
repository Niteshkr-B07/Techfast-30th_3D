import { createContext, useContext } from 'react';

export type PerfMode = 'immersive' | 'lite';

export interface PerfSettings {
  mode: PerfMode;
  particleCount: number;
  dpr: [number, number];
  bloom: boolean;
  sway: boolean;
  animationSpeed: number;
}

export const PERF_SETTINGS: Record<PerfMode, PerfSettings> = {
  immersive: {
    mode: 'immersive',
    particleCount: 700,
    dpr: [1, 1.75],
    bloom: true,
    sway: true,
    animationSpeed: 1,
  },
  lite: {
    mode: 'lite',
    particleCount: 180,
    dpr: [0.75, 1],
    bloom: false,
    sway: false,
    animationSpeed: 0.45,
  },
};

export function systemPrefersLite(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const PerfModeContext = createContext<PerfMode>('immersive');

export function usePerfMode(): PerfMode {
  return useContext(PerfModeContext);
}
