import * as THREE from 'three';
import { createRadialTexture } from './sceneHelpers';

export function createStarLayers(camera: THREE.Camera, isMobile: boolean): {
  nearStars: THREE.Points;
  farStars: THREE.Points;
  update: () => void;
  dispose: () => void;
} {
  const nearCount = isMobile ? 600 : 1500;
  const farCount = isMobile ? 800 : 2000;

  const nearGeom = new THREE.BufferGeometry();
  const nearPositions = new Float32Array(nearCount * 3);
  const nearColors = new Float32Array(nearCount * 3);

  for (let i = 0; i < nearCount; i++) {
    const r = 60 + Math.random() * 120;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nearPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    nearPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    nearPositions[i * 3 + 2] = r * Math.cos(phi);

    const c = 0.6 + Math.random() * 0.4;
    const tint = Math.random();
    nearColors[i * 3] = c * (0.8 + tint * 0.2);
    nearColors[i * 3 + 1] = c * (0.9 + tint * 0.1);
    nearColors[i * 3 + 2] = c;
  }

  nearGeom.setAttribute('position', new THREE.BufferAttribute(nearPositions, 3));
  nearGeom.setAttribute('color', new THREE.BufferAttribute(nearColors, 3));

  const starTexture = createRadialTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.2, 'rgba(255,255,255,0.8)'],
    [0.5, 'rgba(255,255,255,0.2)'],
    [1, 'rgba(255,255,255,0)'],
  ], 32);

  const nearMat = new THREE.PointsMaterial({
    size: 1.5,
    map: starTexture,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const nearStars = new THREE.Points(nearGeom, nearMat);

  const farGeom = new THREE.BufferGeometry();
  const farPositions = new Float32Array(farCount * 3);
  const farColors = new Float32Array(farCount * 3);

  for (let i = 0; i < farCount; i++) {
    const r = 250 + Math.random() * 300;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    farPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    farPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    farPositions[i * 3 + 2] = r * Math.cos(phi);

    const c = 0.3 + Math.random() * 0.5;
    farColors[i * 3] = c * 0.8;
    farColors[i * 3 + 1] = c * 0.85;
    farColors[i * 3 + 2] = c;
  }

  farGeom.setAttribute('position', new THREE.BufferAttribute(farPositions, 3));
  farGeom.setAttribute('color', new THREE.BufferAttribute(farColors, 3));

  const farMat = new THREE.PointsMaterial({
    size: 1,
    map: starTexture,
    transparent: true,
    opacity: 0.7,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const farStars = new THREE.Points(farGeom, farMat);

  const update = () => {
    nearStars.position.copy(camera.position);
    farStars.position.copy(camera.position);
  };

  const dispose = () => {
    nearGeom.dispose();
    farGeom.dispose();
    nearMat.dispose();
    farMat.dispose();
    starTexture.dispose();
  };

  return { nearStars, farStars, update, dispose };
}

