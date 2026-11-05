import * as THREE from 'three';
import { MAIN_GALAXY_POSITION } from './galaxies';
import { SUN_POSITION, type SolarSystem } from './solarSystem';

export interface CameraKey {
  position: THREE.Vector3;
  look: THREE.Vector3;
}

type KeyResolver = (solar: SolarSystem) => CameraKey;

const vec = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const orbitView = (body: THREE.Vector3, offset: THREE.Vector3): CameraKey => ({
  position: body.clone().add(offset),
  look: body.clone(),
});

const KEY_RESOLVERS: Record<string, KeyResolver> = {
  home: () => ({ position: vec(0, 1.5, 17), look: vec(0, 0, 0) }),
  about: () => ({
    position: SUN_POSITION.clone().add(vec(0, 95, 45)),
    look: SUN_POSITION.clone(),
  }),
  skills: (solar) => orbitView(solar.getBodyPosition('saturn'), vec(-7, 5, 17)),
  education: (solar) => {
    const mars = solar.getBodyPosition('mars');
    return {
      position: mars.clone().add(vec(5, 5, 12)),
      look: SUN_POSITION.clone().lerp(mars, 1.35),
    };
  },
  projects: (solar) => orbitView(solar.getBodyPosition('jupiter'), vec(0, 5, 16)),
  certifications: (solar) => {
    const mid = solar.getBodyPosition('uranus').lerp(solar.getBodyPosition('neptune'), 0.5);
    return orbitView(mid, vec(0, 9, 20));
  },
  resume: () => orbitView(MAIN_GALAXY_POSITION, vec(0, 40, 150)),
  contact: () => ({ position: vec(-7, 3, 15), look: vec(0, 0, 0) }),
};

export function resolveCameraKeys(solar: SolarSystem, sectionIds: string[]): CameraKey[] {
  return sectionIds.map((id) => KEY_RESOLVERS[id](solar));
}

const smoothstep = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
};

export function sampleJourney(centers: number[], keys: CameraKey[], y: number): CameraKey {
  const last = keys.length - 1;
  if (y <= centers[0]) return keys[0];
  if (y >= centers[last]) return keys[last];

  let i = 0;
  while (i < last - 1 && y > centers[i + 1]) i++;
  const f = smoothstep((y - centers[i]) / (centers[i + 1] - centers[i]));

  return {
    position: keys[i].position.clone().lerp(keys[i + 1].position, f),
    look: keys[i].look.clone().lerp(keys[i + 1].look, f),
  };
}
