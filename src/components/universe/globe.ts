import * as THREE from 'three';

export function createHolographicGlobe(): {
  group: THREE.Group;
  update: (t: number) => void;
  dispose: () => void;
} {
  const group = new THREE.Group();

  const wireGeom = new THREE.IcosahedronGeometry(3.5, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x22e4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const wireframe = new THREE.Mesh(wireGeom, wireMat);
  group.add(wireframe);

  const glowMat = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x22e4ff) },
      uColor2: { value: new THREE.Color(0xa855f7) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        vec3 color = mix(uColor1, uColor2, fresnel);
        float scanline = sin(vPos.y * 8.0 + uTime * 2.0) * 0.5 + 0.5;
        float pulse = sin(uTime * 1.5) * 0.15 + 0.85;
        gl_FragColor = vec4(color, fresnel * scanline * pulse * 0.7);
      }
    `,
  });

  const glowGeom = new THREE.IcosahedronGeometry(4.2, 3);
  const glowMesh = new THREE.Mesh(glowGeom, glowMat);
  group.add(glowMesh);

  const dataPoints: THREE.Mesh[] = [];
  const pointGeom = new THREE.SphereGeometry(0.08, 8, 8);
  for (let i = 0; i < 12; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3.6;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const mat = new THREE.MeshBasicMaterial({
      color: 0xf0abfc,
      transparent: true,
      opacity: 0.8,
    });
    const point = new THREE.Mesh(pointGeom, mat);
    point.position.set(x, y, z);
    point.userData.baseOpacity = 0.4 + Math.random() * 0.5;
    point.userData.phase = Math.random() * Math.PI * 2;
    dataPoints.push(point);
    group.add(point);
  }

  const ring1 = createOrbitRing(5.5, 0x22e4ff);
  const ring2 = createOrbitRing(6.8, 0xa855f7);
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.z = Math.PI / 6;
  group.add(ring1, ring2);

  const update = (t: number) => {
    glowMat.uniforms.uTime.value = t;
    wireframe.rotation.y = t * 0.1;
    glowMesh.rotation.y = t * 0.1;
    ring1.rotation.z = t * 0.3;
    ring2.rotation.z = -t * 0.2;

    dataPoints.forEach((p) => {
      const pulse = Math.sin(t * 2 + p.userData.phase) * 0.3 + 0.7;
      (p.material as THREE.MeshBasicMaterial).opacity = p.userData.baseOpacity * pulse;
      p.scale.setScalar(0.8 + pulse * 0.5);
    });
  };

  const dispose = () => {
    wireGeom.dispose();
    wireMat.dispose();
    glowGeom.dispose();
    glowMat.dispose();
    pointGeom.dispose();
    dataPoints.forEach((p) => (p.material as THREE.Material).dispose());
    ring1.geometry.dispose();
    (ring1.material as THREE.Material).dispose();
    ring2.geometry.dispose();
    (ring2.material as THREE.Material).dispose();
  };

  return { group, update, dispose };
}

function createOrbitRing(radius: number, color: number): THREE.Mesh {
  const geom = new THREE.TorusGeometry(radius, 0.03, 8, 64);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(geom, mat);
  ring.rotation.x = Math.PI / 2;
  return ring;
}
