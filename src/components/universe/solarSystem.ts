import * as THREE from 'three';
import { createBandTexture, createRadialTexture, disposeTree } from './sceneHelpers';

export type PlanetKey = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export const SUN_POSITION = new THREE.Vector3(40, -6, -70);

interface PlanetSpec {
  key: PlanetKey;
  radius: number;
  orbit: number;
  speed: number;
  phase: number;
  color: number;
  bands?: string[];
}

const PLANETS: PlanetSpec[] = [
  { key: 'mercury', radius: 0.5, orbit: 6, speed: 1.6, phase: 0.4, color: 0x9d9186 },
  { key: 'venus', radius: 0.9, orbit: 9, speed: 1.1, phase: 2.1, color: 0xe6c08a },
  { key: 'mars', radius: 0.7, orbit: 12.5, speed: 0.8, phase: 4.0, color: 0xc0532b },
  {
    key: 'jupiter',
    radius: 2.4,
    orbit: 22,
    speed: 0.35,
    phase: 1.2,
    color: 0xd9b38c,
    bands: ['#d9b38c', '#b5835a', '#f2e3c6', '#8c5e3c', '#e6cfa8'],
  },
  {
    key: 'saturn',
    radius: 1.9,
    orbit: 30,
    speed: 0.25,
    phase: 5.2,
    color: 0xe2c98f,
    bands: ['#e9d7a6', '#c9ae74', '#f4e7c1', '#b8995f'],
  },
  { key: 'uranus', radius: 1.3, orbit: 37, speed: 0.17, phase: 3.1, color: 0x8fe3f0 },
  { key: 'neptune', radius: 1.2, orbit: 44, speed: 0.12, phase: 0.9, color: 0x3b6fff },
];

const TAIL_LENGTH = 48;

interface Spinner {
  pivot: THREE.Object3D;
  phase: number;
  speed: number;
}

export interface SolarSystem {
  group: THREE.Group;
  getBodyPosition: (key: PlanetKey) => THREE.Vector3;
  update: (t: number) => void;
  dispose: () => void;
}

function createOrbitLine(radius: number): THREE.LineLoop {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x22e4ff, transparent: true, opacity: 0.12, depthWrite: false })
  );
}

function createSaturnRings(radius: number): THREE.Group {
  const rings = new THREE.Group();
  rings.rotation.x = Math.PI / 2 - 0.35;
  const specs = [
    { inner: 1.5, outer: 2.0, color: 0xf4e2b0, opacity: 0.45 },
    { inner: 2.1, outer: 2.5, color: 0xc9b68a, opacity: 0.3 },
  ];
  specs.forEach((s) => {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(radius * s.inner, radius * s.outer, 96),
      new THREE.MeshBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: s.opacity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    rings.add(mesh);
  });
  return rings;
}

export function createSolarSystem(isMobile: boolean): SolarSystem {
  const group = new THREE.Group();
  group.position.copy(SUN_POSITION);
  group.rotation.set(0.12, 0, -0.08);

  const bodies = {} as Record<PlanetKey, THREE.Object3D>;
  const spinners: Spinner[] = [];
  const moonSpinners: Spinner[] = [];

  const coronaTexture = createRadialTexture([
    [0, 'rgba(255, 214, 150, 1)'],
    [0.2, 'rgba(255, 160, 80, 0.6)'],
    [0.5, 'rgba(168, 85, 247, 0.15)'],
    [1, 'rgba(168, 85, 247, 0)'],
  ]);
  const coronaMat = new THREE.SpriteMaterial({
    map: coronaTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  [9, 16, 28].forEach((scale) => {
    const corona = new THREE.Sprite(coronaMat);
    corona.scale.setScalar(scale);
    group.add(corona);
  });

  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0xffc46b })
  );
  group.add(sunMesh);

  const sunLight = new THREE.PointLight(0xffe0b0, 40, 0, 1.1);
  group.add(sunLight);

  PLANETS.forEach((spec) => {
    const pivot = new THREE.Group();
    pivot.rotation.y = spec.phase;
    group.add(pivot);
    group.add(createOrbitLine(spec.orbit));

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(spec.radius, 32, 24),
      new THREE.MeshStandardMaterial({
        color: spec.color,
        map: spec.bands ? createBandTexture(spec.bands) : null,
        roughness: 0.9,
        metalness: 0,
      })
    );
    body.position.x = spec.orbit;
    pivot.add(body);
    bodies[spec.key] = body;
    spinners.push({ pivot, phase: spec.phase, speed: spec.speed });

    if (spec.key === 'saturn') {
      body.add(createSaturnRings(spec.radius));
    }

    if (spec.key === 'jupiter') {
      [3.6, 4.6, 5.6].forEach((orbit, i) => {
        const moonPivot = new THREE.Group();
        moonPivot.rotation.y = i * 2.1;
        body.add(moonPivot);
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(0.3 - i * 0.04, 16, 12),
          new THREE.MeshStandardMaterial({ color: 0xbfbfbf, roughness: 0.8 })
        );
        moon.position.x = orbit;
        moonPivot.add(moon);
        moonSpinners.push({ pivot: moonPivot, phase: i * 2.1, speed: 0.8 - i * 0.15 });
      });
    }
  });

  const beltCount = isMobile ? 600 : 1000;
  const beltPositions = new Float32Array(beltCount * 3);
  for (let i = 0; i < beltCount; i++) {
    const r = 14.5 + Math.random() * 5;
    const a = Math.random() * Math.PI * 2;
    beltPositions[i * 3] = Math.cos(a) * r;
    beltPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
    beltPositions[i * 3 + 2] = Math.sin(a) * r;
  }
  const beltGeom = new THREE.BufferGeometry();
  beltGeom.setAttribute('position', new THREE.BufferAttribute(beltPositions, 3));
  const belt = new THREE.Points(
    beltGeom,
    new THREE.PointsMaterial({ color: 0xc4b5e8, size: 0.12, transparent: true, opacity: 0.75, depthWrite: false })
  );
  group.add(belt);

  const cometHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xe6fbff })
  );
  group.add(cometHead);
  const tailGeom = new THREE.BufferGeometry();
  tailGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TAIL_LENGTH * 3), 3));
  tailGeom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TAIL_LENGTH * 3), 3));
  const tail = new THREE.Line(
    tailGeom,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(tail);

  const cometPoint = (theta: number, out: THREE.Vector3) =>
    out.set(34 * Math.cos(theta), 2.5 * Math.sin(theta * 2), 26 * Math.sin(theta));
  const tmp = new THREE.Vector3();

  const update = (t: number) => {
    spinners.forEach((s) => {
      s.pivot.rotation.y = s.phase + t * s.speed * 0.4;
    });
    moonSpinners.forEach((m) => {
      m.pivot.rotation.y = m.phase + t * m.speed;
    });
    belt.rotation.y = t * 0.02;
    coronaMat.opacity = 0.8 + 0.15 * Math.sin(t * 1.2);

    const theta = t * 0.1 + 2;
    cometPoint(theta, tmp);
    cometHead.position.copy(tmp);

    const positions = tailGeom.attributes.position as THREE.BufferAttribute;
    const colors = tailGeom.attributes.color as THREE.BufferAttribute;
    for (let i = 0; i < TAIL_LENGTH; i++) {
      cometPoint(theta - i * 0.012, tmp);
      positions.setXYZ(i, tmp.x, tmp.y, tmp.z);
      const k = Math.pow(1 - i / TAIL_LENGTH, 2);
      colors.setXYZ(i, 0.55 * k, 0.9 * k, 1.0 * k);
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
  };

  const getBodyPosition = (key: PlanetKey) => bodies[key].getWorldPosition(new THREE.Vector3());

  const dispose = () => disposeTree(group);

  return { group, getBodyPosition, update, dispose };
}
