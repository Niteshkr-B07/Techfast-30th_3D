import { useSyncExternalStore } from 'react';

/**
 * Centralized 3D interaction state — outside React so pointer events
 * never trigger re-renders of the scene tree. Components subscribe to
 * only the slice they need.
 */

export interface Selection {
  type: string;
  id: string;
}

interface InteractionState {
  hovered: string | null;
  selected: Selection | null;
}

let state: InteractionState = { hovered: null, selected: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setHovered(key: string | null) {
  if (state.hovered === key) return;
  state = { ...state, hovered: key };
  emit();
}

export function selectObject(selection: Selection) {
  state = { ...state, selected: selection };
  emit();
}

export function clearSelection() {
  if (!state.selected) return;
  state = { ...state, selected: null };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Currently hovered object key ('type:id') or null. */
export function useHoveredKey(): string | null {
  return useSyncExternalStore(subscribe, () => state.hovered);
}

/** Currently selected object (opens the detail panel) or null. */
export function useSelected(): Selection | null {
  return useSyncExternalStore(
    subscribe,
    () => state.selected,
    () => null
  );
}

export function isSelected(selected: Selection | null, type: string, id: string): boolean {
  return !!selected && selected.type === type && selected.id === id;
}

export function objectKey(type: string, id: string): string {
  return `${type}:${id}`;
}
