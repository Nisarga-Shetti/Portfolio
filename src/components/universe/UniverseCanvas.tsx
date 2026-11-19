import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { navItems } from '@/data/portfolio';
import { createSpaceStation } from './station';
import { createHolographicGlobe } from './globe';
import { createSolarSystem } from './solarSystem';
import { createGalaxies } from './galaxies';
import { createNebulae } from './nebulae';
import { createStarLayers } from './starField';
import { resolveCameraKeys, sampleJourney } from './cameraJourney';

const SECTION_IDS = navItems.map((item) => item.id);
const BASE_FOV = 50;
const WARP_FOV = 20;
const DESKTOP_SUBJECT_SHIFT = 0.15;
const MOBILE_SUBJECT_SHIFT = 0.2;
const MAX_PIXEL_RATIO = 1.5;

interface UniverseCanvasProps {
  activeSection: string;
  reducedMotion: boolean;
  isMobile: boolean;
}

function measureSectionCenters(): number[] {
  return SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY + rect.height / 2;
  });
}

function applySubjectOffset(camera: THREE.PerspectiveCamera) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w < 768;
  camera.setViewOffset(
    w,
    h,
    mobile ? 0 : -DESKTOP_SUBJECT_SHIFT * w,
    mobile ? MOBILE_SUBJECT_SHIFT * h : 0,
    w,
    h
  );
}

export function UniverseCanvas({ activeSection, reducedMotion, isMobile }: UniverseCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const reducedRef = useRef(reducedMotion);
  const warpRef = useRef(0);
  const activeRef = useRef(activeSection);

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    if (activeRef.current === activeSection) return;
    activeRef.current = activeSection;
    warpRef.current = reducedRef.current ? 0 : 1;
  }, [activeSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'h-full w-full';
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false });
    } catch {
      setWebglFailed(true);
      return;
    }
    container.appendChild(canvas);

    renderer.setClearColor(0x05060f, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      BASE_FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    applySubjectOffset(camera);

    const ambient = new THREE.AmbientLight(0x3a4670, 0.9);
    const cyanLight = new THREE.PointLight(0x22e4ff, 14, 45, 1.5);
    cyanLight.position.set(8, 4, 8);
    const purpleLight = new THREE.PointLight(0xa855f7, 12, 45, 1.5);
    purpleLight.position.set(-9, -3, -6);

    const stars = createStarLayers(camera, isMobile);
    const nebulae = createNebulae();
    const station = createSpaceStation();
    const globe = createHolographicGlobe();
    const solar = createSolarSystem(isMobile);
    const galaxies = createGalaxies(isMobile);

    scene.add(
      ambient,
      cyanLight,
      purpleLight,
      stars.farStars,
      stars.nearStars,
      nebulae.group,
      station.group,
      globe.group,
      solar.group,
      galaxies.group
    );

    const camPos = new THREE.Vector3(0, 1.5, 17);
    const camLook = new THREE.Vector3(0, 0, 0);
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();

    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };

    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      applySubjectOffset(camera);
      camera.updateProjectionMatrix();
      centers = measureSectionCenters();
    };

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;

    const keys = resolveCameraKeys(solar, SECTION_IDS);
    let centers = measureSectionCenters();
    void document.fonts.ready.then(() => {
      centers = measureSectionCenters();
    });

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += dt;
      const reduced = reducedRef.current;
      const time = reduced ? 0 : elapsed;

      const scrollCenter = window.scrollY + window.innerHeight / 2;
      const target = sampleJourney(centers, keys, scrollCenter);

      const ease = reduced ? 1 : 1 - Math.exp(-2 * dt);
      camPos.lerp(target.position, ease);
      camLook.lerp(target.look, ease);

      const parallaxEase = reduced ? 1 : 1 - Math.exp(-3 * dt);
      const parallax = reduced ? 0 : 1;
      pointerCurrent.lerp(pointerTarget, parallaxEase);
      camera.position.set(
        camPos.x + pointerCurrent.x * 1.2 * parallax,
        camPos.y + pointerCurrent.y * 0.8 * parallax,
        camPos.z
      );
      camera.lookAt(camLook);

      warpRef.current = reduced ? 0 : warpRef.current * Math.exp(-3 * dt);
      const fov = BASE_FOV + WARP_FOV * warpRef.current;
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      stars.update();
      station.update(time);
      globe.update(time);
      solar.update(time);
      galaxies.update(time);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf !== 0) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
      stars.dispose();
      nebulae.dispose();
      station.dispose();
      globe.dispose();
      solar.dispose();
      galaxies.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [isMobile]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {webglFailed && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 30%, rgba(168,85,247,0.28), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(34,228,255,0.18), transparent 50%), #05060F',
          }}
        />
      )}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
