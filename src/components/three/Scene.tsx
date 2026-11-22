import { Suspense } from 'react';
import Observatory from './Observatory';
import Astrolabe from './Astrolabe';
import Holograms from './Holograms';
import CelestialObjects from './CelestialObjects';
import Particles from './Particles';
import Lighting from './Lighting';
import CameraRig from './CameraRig';
import CompetitionArena from './CompetitionArena';
import WorkshopLab from './WorkshopLab';
import CampusEnvironment from './CampusEnvironment';
import AmbassadorGlobe from './AmbassadorGlobe';

interface SceneProps {
  immersive: boolean;
  onSelect: (panel: { type: string; id: string } | null) => void;
}

/**
 * Five environments staged along the -Z axis so the camera travels
 * through them as the visitor scrolls:
 *   z 0    observatory + astrolabe (hero / about)
 *   z -14  competition arena
 *   z -26  workshop laboratory
 *   z -34  campus accommodation
 *   z -48  ambassador globe
 */
export default function Scene({ immersive, onSelect }: SceneProps) {
  const speed = immersive ? 1 : 0.45;

  return (
    <>
      <fog attach="fog" args={['#030409', 12, 36]} />
      <color attach="background" args={['#030409']} />

      <CameraRig sway={immersive} />
      <Lighting immersive={immersive} />

      <Suspense fallback={null}>
        <Observatory />
        <Astrolabe />
        {immersive && <Holograms />}
        <CelestialObjects />

        <CompetitionArena onSelect={(id) => onSelect({ type: 'competition', id })} animationSpeed={speed} />
        <WorkshopLab onSelect={(id) => onSelect({ type: 'workshop', id })} animationSpeed={speed} />
        <CampusEnvironment onSelect={() => onSelect({ type: 'accommodation', id: 'plans' })} animationSpeed={speed} />
        <AmbassadorGlobe onSelect={() => onSelect({ type: 'ca', id: 'program' })} animationSpeed={speed} />

        <Particles count={immersive ? 700 : 180} spreadZ={70} offsetZ={-40} />
      </Suspense>
    </>
  );
}
