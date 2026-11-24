
import * as THREE from 'three';

function createNebulaTexture(color: string): THREE.Texture {
  const size = 128;
  const center = size / 2;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    center, center, 0,
    center, center, center
  );

  grad.addColorStop(0, color);
  grad.addColorStop(0.3, color.replace(/[\d.]+\)$/, '0.4)'));
  grad.addColorStop(0.7, color.replace(/[\d.]+\)$/, '0.1)'));
  grad.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 10; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 10 + Math.random() * 30;

    const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
    g2.addColorStop(0, color.replace(/[\d.]+\)$/, '0.15)'));
    g2.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));

    ctx.fillStyle = g2;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
}

interface NebulaData {
  sprite: THREE.Sprite;
  texture: THREE.Texture;
}

export function createNebulae(): {
  group: THREE.Group;
  dispose: () => void;
} {
  const group = new THREE.Group();

  const colors = [
    'rgba(168, 85, 247, 0.5)',
    'rgba(34, 228, 255, 0.4)',
    'rgba(240, 171, 252, 0.35)',
    'rgba(34, 100, 255, 0.3)',
    'rgba(255, 140, 60, 0.25)',
    'rgba(168, 85, 247, 0.3)',
  ];

  const positions = [
    new THREE.Vector3(-80, 20, -120),
    new THREE.Vector3(100, -15, -90),
    new THREE.Vector3(-60, -30, -200),
    new THREE.Vector3(120, 40, -160),
    new THREE.Vector3(-30, 50, -140),
    new THREE.Vector3(70, -40, -250),
  ];

  const sizes = [120, 100, 140, 110, 90, 130];

  const datas: NebulaData[] = colors.map((color, i) => {
    const texture = createNebulaTexture(color);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.copy(positions[i]);
    sprite.scale.set(sizes[i], sizes[i], 1);

    group.add(sprite);

    return { sprite, texture };
  });

  const dispose = () => {
    datas.forEach((data) => {
      data.texture.dispose();
      (data.sprite.material as THREE.SpriteMaterial).dispose();
    });
  };

  return { group, dispose };
}
