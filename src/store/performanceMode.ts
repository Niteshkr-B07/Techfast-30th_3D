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
  if (typeof window === 'undefined') return false;

  // Respect OS reduced motion preference
  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  // Device capability heuristics (low core count or low device memory)
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  if (nav) {
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4 && window.innerWidth < 768) {
      return true;
    }
    const mem = (nav as unknown as { deviceMemory?: number }).deviceMemory;
    if (typeof mem === 'number' && mem <= 4) {
      return true;
    }
  }

  return false;
}

export const PerfModeContext = createContext<PerfMode>('immersive');

export function usePerfMode(): PerfMode {
  return useContext(PerfModeContext);
}
