import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InteractiveObject from './InteractiveObject';
import { SITE_CONTENT } from '../../data/event';

const GOLD = '#d9ac4e';
const STONE = '#3d382e';
const STONE_DARK = '#26221b';
const WARM = '#f8ecc4';

interface CampusProps {
  onSelect: () => void;
  animationSpeed: number;
}

function HostelBlock({ position, height, lit }: { position: [number, number, number]; height: number; lit: boolean }) {
  const windows = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let y = 0.8; y < height - 0.4; y += 0.7) {
      for (let z = -0.3; z <= 0.3; z += 0.6) {
        arr.push([0.46, y, z]);
      }
    }
    return arr;
  }, [height]);

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.9, height, 1.6]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      <mesh position={[0, height + 0.06, 0]}>
        <boxGeometry args={[1, 0.12, 1.7]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
      {lit &&
        windows.map((w, i) => (
          <mesh key={i} position={w}>
            <planeGeometry args={[0.16, 0.24]} />
            <meshBasicMaterial color={WARM} transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
        ))}
    </group>
  );
}

export default function CampusEnvironment({ onSelect, animationSpeed }: CampusProps) {
  const beacons = SITE_CONTENT.accommodation.plans;

  const beaconPositions = useMemo(
    () =>
      beacons.map((_, i) => {
        const spread = (i - (beacons.length - 1) / 2) * 2.4;
        return [spread, 3.1, -34.5] as [number, number, number];
      }),
    [beacons.length]
  );

  const lantern = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * animationSpeed;
    if (lantern.current) {
      lantern.current.children.forEach((child, i) => {
        child.position.y = 4.5 + Math.sin(t * 1.2 + i * 2.1) * 0.2;
      });
    }
  });

  return (
    <group>
      {/* Campus green */}
      <mesh position={[0, 0.2, -34.5]} receiveShadow>
        <boxGeometry args={[16, 0.4, 9]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>

      {/* Walkway */}
      <mesh position={[0, 0.45, -34.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 9]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      {/* Hostel blocks flanking the walkway */}
      {[-4.2, -2.6, 2.6, 4.2].map((x, i) => (
        <HostelBlock key={i} position={[x, 0.4, -34.5 + (i % 2 ? -1.2 : 1.2)]} height={2.4 + (i % 3) * 0.8} lit={i % 2 === 0} />
      ))}

      {/* Golden lanterns along the walkway */}
      <group ref={lantern}>
        {[-3, 0, 3].map((z, i) => (
          <group key={i} position={[0, 4.5, -34.5 + z]}>
            <mesh>
              <sphereGeometry args={[0.14, 12, 12]} />
              <meshStandardMaterial color={GOLD} emissive={WARM} emissiveIntensity={2} metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Accommodation plan beacons (interactive) */}
      {beacons.map((plan, i) => (
        <InteractiveObject key={plan.id} position={beaconPositions[i]} label={plan.id} onSelect={() => onSelect()} hitRadius={1}>
          {(hovered) => (
            <mesh>
              <octahedronGeometry args={[0.35, 0]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={hovered ? WARM : GOLD}
                emissiveIntensity={hovered ? 2.4 : 1}
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>
          )}
        </InteractiveObject>
      ))}

      <pointLight position={[0, 7, -34.5]} intensity={20} distance={18} decay={2} color={WARM} />
      <pointLight position={[0, 1.5, -32]} intensity={7} distance={10} decay={2} color={GOLD} />
    </group>
  );
}
