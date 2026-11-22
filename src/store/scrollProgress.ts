import { useCallback, useSyncExternalStore } from 'react';

/**
 * Scroll progress lives outside React so the render loop can read it
 * every frame without triggering re-renders.
 */
let progress = 0;
const listeners = new Set<() => void>();

export function setScrollProgress(p: number) {
  progress = p;
  listeners.forEach((l) => l());
}

export function getScrollProgress() {
  return progress;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook — re-renders only when the rounded percentage changes. */
export function useScrollProgressPercent(): number {
  return useSyncExternalStore(
    subscribe,
    () => Math.round(progress * 100),
    () => 0
  );
}

/** Section id -> index in CAMERA_STOPS. Kept in sync with data/cameraStops.ts */
export const SECTION_INDEX: Record<string, number> = {
  hero: 0,
  home: 0,
  about: 1,
  competitions: 2,
  workshops: 3,
  accommodation: 4,
  ca: 5,
};

/**
 * Converts a section index to the scroll progress value that centers
 * the camera on that section's stop. Layout is: hero (100vh) followed
 * by 5 sections (min 100vh each), so the scrollable range spans
 * 5 viewports of travel (0..1). Stop i sits at i/5.
 */
export function progressForSection(index: number, totalStops: number): number {
  const segments = totalStops - 1;
  return Math.min(1, Math.max(0, index / segments));
}

export function useScrollToSection(totalStops: number) {
  return useCallback(
    (sectionId: string) => {
      const index = SECTION_INDEX[sectionId];
      if (index === undefined) {
        document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const target = progressForSection(index, totalStops);
      const scrollY = target * (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    },
    [totalStops]
  );
}
