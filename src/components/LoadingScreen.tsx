import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { loaderLines } from '@/data/portfolio';
import { EARTH_PX, buildEarth } from '@/components/loaderEarth';

interface LoadingScreenProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

const STAGE_PX = 320;
const ORBIT_RADIUS = 132;
const ORBIT_CIRCUMFERENCE = 2 * Math.PI * ORBIT_RADIUS;
const PROGRESS_MS = 3800;
const CHECKPOINTS = [0, 0.25, 0.5, 0.75];
const STAR_COUNT = 48;
const RING_PULSE_MS = 900;
const EXIT_DELAY_MS = 650;
const COMPLETE_DELAY_MS = 1200;
const REDUCED_COMPLETE_MS = 600;
const STAGE_SCALE_BREAKPOINT = 352;
const ROCKET_PATH = 'M12 0 C17.5 6 19 15 19 27 L22 35 L15 32 L12 40 L9 32 L2 35 L5 27 C5 15 6.5 6 12 0 Z';

const KEYFRAMES = `
@keyframes loader-twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.15); }
}
@keyframes loader-shoot {
  0% { opacity: 0; transform: translate3d(0, 0, 0) rotate(35deg); }
  6% { opacity: 1; }
  16%, 100% { opacity: 0; transform: translate3d(240px, 150px, 0) rotate(35deg); }
}
@keyframes loader-breathe {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes loader-flame {
  from { transform: scaleY(0.7); }
  to { transform: scaleY(1.25); }
}
@keyframes loader-pulse {
  0% { transform: scale(1); opacity: 0.9; }
  100% { transform: scale(1.28); opacity: 0; }
}
`;

interface Star {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 4,
  }));
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function RocketSprite({ flameAnimated }: { flameAnimated: boolean }) {
  const clip = `path('${ROCKET_PATH}')`;
  return (
    <div
      aria-hidden="true"
      className="absolute"
      style={{
        left: ORBIT_RADIUS,
        top: 0,
        width: 24,
        height: 40,
        transform: 'translate(-50%, -50%) rotate(180deg) scale(0.85)',
      }}
    >
      <div
        className="absolute -inset-4 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(34,228,255,0.5), transparent 70%)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: clip,
          WebkitClipPath: clip,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(34,228,255,0.45) 55%, rgba(168,85,247,0.6) 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />
      <svg viewBox="0 0 24 40" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="loader-rocket-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6F1FF" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <radialGradient id="loader-porthole" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#E6F1FF" />
            <stop offset="45%" stopColor="#22E4FF" />
            <stop offset="100%" stopColor="#0B3A5C" />
          </radialGradient>
        </defs>
        <path d={ROCKET_PATH} stroke="url(#loader-rocket-edge)" strokeWidth="0.8" />
        <circle cx="12" cy="14" r="3.2" fill="url(#loader-porthole)" />
        <path d="M9.5 9.5 L11 8.5" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
      </svg>
      <div
        className="absolute left-1/2 top-full h-4 w-3 -translate-x-1/2"
        style={{
          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
          background: 'linear-gradient(180deg, #22E4FF 0%, rgba(168,85,247,0) 100%)',
          transformOrigin: 'top center',
          animation: flameAnimated ? 'loader-flame 0.18s ease-in-out infinite alternate' : undefined,
        }}
      />
    </div>
  );
}

export function LoadingScreen({ onComplete, reducedMotion }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [stars] = useState(createStars);
  const [stageScale, setStageScale] = useState(() =>
    typeof window === 'undefined' ? 1 : Math.min(1, window.innerWidth / STAGE_SCALE_BREAKPOINT),
  );

  useEffect(() => {
    const onResize = () => setStageScale(Math.min(1, window.innerWidth / STAGE_SCALE_BREAKPOINT));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const earth = buildEarth();
    const image = ctx.createImageData(EARTH_PX, EARTH_PX);
    const draw = (t: number) => {
      earth.render(image.data, t);
      ctx.putImageData(image, 0, 0);
    };

    let raf = 0;
    let completeTimer: ReturnType<typeof setTimeout> | undefined;

    if (reducedMotion) {
      draw(0);
      setProgress(1);
      setFinished(true);
      completeTimer = setTimeout(onComplete, REDUCED_COMPLETE_MS);
    } else {
      const start = performance.now();
      const frame = (now: number) => {
        const elapsed = now - start;
        const linear = Math.min(elapsed / PROGRESS_MS, 1);
        draw(elapsed / 1000);
        setProgress(easeInOutSine(linear));
        if (linear < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          setFinished(true);
        }
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [onComplete, reducedMotion]);

  useEffect(() => {
    if (!finished || reducedMotion) return;
    const exitTimer = setTimeout(() => setExiting(true), EXIT_DELAY_MS);
    const completeTimer = setTimeout(onComplete, COMPLETE_DELAY_MS);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [finished, onComplete, reducedMotion]);

  const percent = Math.round(progress * 100);
  const lineIndex = Math.min(loaderLines.length - 1, Math.floor(progress * loaderLines.length));
  const statusText = finished ? 'Orbit locked' : loaderLines[lineIndex];
  const rocketAngle = -90 + 360 * progress;
  const stageSize = STAGE_PX * stageScale;

  const stageCenter: CSSProperties = { left: STAGE_PX / 2, top: STAGE_PX / 2 };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-void transition-[opacity,transform] duration-[550ms] ease-out ${
        exiting ? 'scale-[1.06] opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <style>{KEYFRAMES}</style>

      {!reducedMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {stars.map((star, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-text"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                animation: `loader-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
          {[
            { left: '12%', top: '18%', delay: '1.2s' },
            { left: '68%', top: '62%', delay: '4.4s' },
          ].map((shot) => (
            <span
              key={shot.left}
              className="absolute h-px w-24 opacity-0"
              style={{
                left: shot.left,
                top: shot.top,
                background: 'linear-gradient(90deg, transparent, #22E4FF)',
                animation: `loader-shoot 6s ease-in ${shot.delay} infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div
        role="progressbar"
        aria-label="Loading portfolio"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="relative"
        style={{ width: stageSize, height: stageSize }}
      >
        <div
          className="absolute origin-top-left"
          style={{
            width: STAGE_PX,
            height: STAGE_PX,
            transform: `scale(${stageScale})`,
          }}
        >
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-[260px] w-[260px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(34,228,255,0.3) 0%, rgba(34,228,255,0.08) 45%, transparent 70%)',
                animation: reducedMotion ? undefined : 'loader-breathe 4s ease-in-out infinite',
              }}
            />
          </div>

          <svg
            aria-hidden="true"
            viewBox={`0 0 ${STAGE_PX} ${STAGE_PX}`}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="loader-trail" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22E4FF" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#F0ABFC" />
              </linearGradient>
              <filter id="loader-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" />
              </filter>
            </defs>
            <g transform={`rotate(-90 ${STAGE_PX / 2} ${STAGE_PX / 2})`}>
              <circle
                cx={STAGE_PX / 2}
                cy={STAGE_PX / 2}
                r={ORBIT_RADIUS}
                fill="none"
                stroke="rgba(34,228,255,0.45)"
                strokeWidth="1"
                strokeDasharray="1 5"
                strokeLinecap="round"
              />
              <circle
                cx={STAGE_PX / 2}
                cy={STAGE_PX / 2}
                r={ORBIT_RADIUS}
                fill="none"
                stroke="url(#loader-trail)"
                strokeWidth="6"
                strokeDasharray={`${ORBIT_CIRCUMFERENCE * progress} ${ORBIT_CIRCUMFERENCE}`}
                opacity="0.45"
                filter="url(#loader-blur)"
              />
              <circle
                cx={STAGE_PX / 2}
                cy={STAGE_PX / 2}
                r={ORBIT_RADIUS}
                fill="none"
                stroke="url(#loader-trail)"
                strokeWidth="2"
                strokeDasharray={`${ORBIT_CIRCUMFERENCE * progress} ${ORBIT_CIRCUMFERENCE}`}
              />
            </g>
          </svg>

          {CHECKPOINTS.map((checkpoint) => {
            const angle = ((-90 + 360 * checkpoint) * Math.PI) / 180;
            const lit = progress >= checkpoint;
            return (
              <span
                key={checkpoint}
                aria-hidden="true"
                className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                  lit ? 'bg-cyan' : 'bg-muted/40'
                }`}
                style={{
                  left: STAGE_PX / 2 + ORBIT_RADIUS * Math.cos(angle),
                  top: STAGE_PX / 2 + ORBIT_RADIUS * Math.sin(angle),
                  boxShadow: lit ? '0 0 10px #22E4FF, 0 0 18px rgba(34,228,255,0.6)' : undefined,
                }}
              />
            );
          })}

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            width={EARTH_PX}
            height={EARTH_PX}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ ...stageCenter, width: 116, height: 116 }}
          />

          <div
            aria-hidden="true"
            className="absolute"
            style={{ ...stageCenter, width: 0, height: 0, transform: `rotate(${rocketAngle}deg)` }}
          >
            <RocketSprite flameAnimated={!reducedMotion} />
          </div>

          {finished && !reducedMotion && (
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <div
                className="rounded-full border-2 border-cyan"
                style={{
                  width: ORBIT_RADIUS * 2,
                  height: ORBIT_RADIUS * 2,
                  animation: `loader-pulse ${RING_PULSE_MS}ms ease-out forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex h-16 flex-col items-center gap-3 text-center">
        <p className="neon-text font-mono text-5xl font-semibold tabular-nums text-cyan">{percent}%</p>
        <p
          key={statusText}
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted"
          style={reducedMotion ? undefined : { animation: 'fade-up 0.3s ease' }}
        >
          {statusText}
        </p>
      </div>
    </div>
  );
}
