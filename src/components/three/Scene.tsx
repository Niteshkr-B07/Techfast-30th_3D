import { Suspense } from 'react';
import Observatory from './Observatory';
import Astrolabe from './Astrolabe';
import Holograms from './Holograms';
import CelestialObjects from './CelestialObjects';
import Particles from './Particles';
import Lighting from './Lighting';

export default function Scene() {
  return (
    <>
      <fog attach="fog" args={['#030409', 12, 34]} />
      <color attach="background" args={['#030409']} />

      <Lighting />
      <Suspense fallback={null}>
        <Observatory />
        <Astrolabe />
        <Holograms />
        <CelestialObjects />
        <Particles />
      </Suspense>
    </>
  );
}
