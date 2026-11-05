import * as THREE from 'three';
import { createRadialTexture, disposeTree } from './sceneHelpers';

export const MAIN_GALAXY_POSITION = new THREE.Vector3(60, 30, -360);

interface GalaxySpec {
  position: THREE.Vector3;
  radius: number;
  arms: number;
  count: number;
  tilt: number;
  roll: number;
}

const CORE_COLOR = new THREE.Color(0xffe2b0);
const MID_COLOR = new THREE.Color(0x7fb4ff);
const EDGE_COLOR = new THREE.Color(0xa855f7);

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

function gaussianish(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) * 0.66;
}

function buildSpiral(spec: GalaxySpec, glow: THREE.Texture): THREE.Points {
  const positions = new Float32Array(spec.count * 3);
  const colors = new Float32Array(spec.count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < spec.count; i++) {
    const f = Math.pow(Math.random(), 1.6);
    const arm = i % spec.arms;
    const angle =
      ((arm / spec.arms) * Math.PI * 2) + f * 4.2 + gaussianish() * 0.3 * (0.3 + f);
    const r = spec.radius * f + gaussianish() * spec.radius * 0.06 * (0.3 + f);

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = gaussianish() * spec.radius * 0.02 * (1.2 - f);
    positions[i * 3 + 2] = Math.sin(angle) * r;

    color.copy(CORE_COLOR).lerp(MID_COLOR, clamp01(f / 0.4));
    color.lerp(EDGE_COLOR, clamp01((f - 0.45) / 0.55));
    const brightness = (1 - 0.45 * f) * (0.55 + 0.45 * Math.random());
    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geom,
    new THREE.PointsMaterial({
      size: spec.radius * 0.025,
      map: glow,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
}

export function createGalaxies(isMobile: boolean): {
  group: THREE.Group;
  update: (t: number) => void;
  dispose: () => void;
} {
  const group = new THREE.Group();
  const glow = createRadialTexture([
    [0, 'rgba(255, 255, 255, 1)'],
    [0.2, 'rgba(255, 255, 255, 0.5)'],
    [1, 'rgba(255, 255, 255, 0)'],
  ]);

  const specs: GalaxySpec[] = [
    {
      position: MAIN_GALAXY_POSITION.clone(),
      radius: 60,
      arms: 4,
      count: isMobile ? 3000 : 9000,
      tilt: 1.0,
      roll: 0.3,
    },
    {
      position: new THREE.Vector3(-150, 60, -300),
      radius: 22,
      arms: 2,
      count: isMobile ? 800 : 2000,
      tilt: 0.5,
      roll: -0.2,
    },
    {
      position: new THREE.Vector3(180, -80, -420),
      radius: 26,
      arms: 3,
      count: isMobile ? 800 : 2000,
      tilt: -0.6,
      roll: 0.4,
    },
  ];

  const spinners: THREE.Object3D[] = [];
  specs.forEach((spec, i) => {
    const tiltGroup = new THREE.Group();
    tiltGroup.position.copy(spec.position);
    tiltGroup.rotation.set(spec.tilt, 0, spec.roll);
    const points = buildSpiral(spec, glow);
    tiltGroup.add(points);
    group.add(tiltGroup);
    spinners.push(points);
    points.userData.speed = 0.03 + i * 0.01;
  });

  const update = (t: number) => {
    spinners.forEach((p) => {
      p.rotation.y = t * (p.userData.speed as number);
    });
  };

  const dispose = () => disposeTree(group);

  return { group, update, dispose };
}
