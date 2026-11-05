import * as THREE from 'three';

const WINDOW_COUNT = 24;

export function createSpaceStation(): {
  group: THREE.Group;
  update: (t: number) => void;
  dispose: () => void;
} {
  const group = new THREE.Group();

  const ringGeom = new THREE.TorusGeometry(6, 0.5, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x3a4a6a,
    metalness: 0.8,
    roughness: 0.3,
  });
  const ring = new THREE.Mesh(ringGeom, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const windowGeom = new THREE.BoxGeometry(0.15, 0.35, 0.1);
  const windowMats: THREE.MeshBasicMaterial[] = [];
  for (let i = 0; i < WINDOW_COUNT; i++) {
    const angle = (i / WINDOW_COUNT) * Math.PI * 2;
    const winMat = new THREE.MeshBasicMaterial({
      color: 0x22e4ff,
      transparent: true,
      opacity: 0.8,
    });
    windowMats.push(winMat);
    const win = new THREE.Mesh(windowGeom, winMat);
    win.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, 0.4);
    group.add(win);
  }

  const dockingGeom = new THREE.CylinderGeometry(0.8, 1.2, 2, 12);
  const dockingMat = new THREE.MeshStandardMaterial({
    color: 0x4a5a7a,
    metalness: 0.7,
    roughness: 0.4,
  });
  const docking = new THREE.Mesh(dockingGeom, dockingMat);
  docking.position.set(0, 0, -1.5);
  docking.rotation.x = Math.PI / 2;
  group.add(docking);

  const antennaGeom = new THREE.CylinderGeometry(0.04, 0.04, 3, 6);
  const antennaMat = new THREE.MeshStandardMaterial({
    color: 0x6a7a9a,
    metalness: 0.6,
    roughness: 0.5,
  });
  const antenna = new THREE.Mesh(antennaGeom, antennaMat);
  antenna.position.set(2, 0, 3);
  antenna.rotation.z = Math.PI / 6;
  group.add(antenna);

  const antennaTipGeom = new THREE.SphereGeometry(0.15, 8, 8);
  const antennaTipMat = new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true });
  const antennaTip = new THREE.Mesh(antennaTipGeom, antennaTipMat);
  antennaTip.position.set(2 + 1.5 * Math.sin(Math.PI / 6), 1.5 * Math.cos(Math.PI / 6), 3);
  group.add(antennaTip);

  const panelGeom = new THREE.BoxGeometry(4, 0.05, 2);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x1a2a4a,
    emissive: 0x1a4a8a,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.7,
  });
  const panelL = new THREE.Mesh(panelGeom, panelMat);
  panelL.position.set(-5, 0, 0);
  group.add(panelL);
  const panelR = new THREE.Mesh(panelGeom, panelMat);
  panelR.position.set(5, 0, 0);
  group.add(panelR);

  const cyanLightMat = new THREE.MeshBasicMaterial({
    color: 0x22e4ff,
    transparent: true,
    opacity: 0.6,
  });
  const cyanLightGeom = new THREE.SphereGeometry(0.12, 8, 8);
  const cyanLight = new THREE.Mesh(cyanLightGeom, cyanLightMat);
  cyanLight.position.set(0, 6.5, 0);
  group.add(cyanLight);

  const update = (t: number) => {
    group.rotation.y = t * 0.08;
    group.rotation.z = Math.sin(t * 0.05) * 0.05;
    group.rotation.x = 0.15;

    for (let i = 0; i < WINDOW_COUNT; i++) {
      const blink = Math.sin(t * 3 + i * 0.5) * 0.2 + 0.8;
      windowMats[i].opacity = 0.5 + blink * 0.4;
    }

    antennaTipMat.opacity = Math.sin(t * 4) > 0 ? 1 : 0.2;
    cyanLightMat.opacity = Math.sin(t * 4 + Math.PI) > 0 ? 1 : 0.2;
  };

  const dispose = () => {
    ringGeom.dispose();
    ringMat.dispose();
    windowGeom.dispose();
    windowMats.forEach((m) => m.dispose());
    dockingGeom.dispose();
    dockingMat.dispose();
    antennaGeom.dispose();
    antennaMat.dispose();
    antennaTipGeom.dispose();
    antennaTipMat.dispose();
    panelGeom.dispose();
    panelMat.dispose();
    cyanLightGeom.dispose();
    cyanLightMat.dispose();
  };

  return { group, update, dispose };
}
