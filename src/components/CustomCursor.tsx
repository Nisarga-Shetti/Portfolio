import { useEffect, useRef } from 'react';

interface CustomCursorProps {
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  life: number;
}

interface Ripple {
  x: number;
  y: number;
  life: number;
}

export function CustomCursor({ reducedMotion }: CustomCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
    };

    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let prevPos = { x: mouse.x, y: mouse.y };
    const ring = { x: mouse.x, y: mouse.y };
    let speed = 0;
    let angle = 0;
    let hovering = false;
    const particles: Particle[] = [];
    const ripples: Ripple[] = [];

    const onMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      hovering = !!target.closest('a, button, input, textarea, select, [role="button"], [data-cursor]');
    };

    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, life: 1 });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);

    let raf = 0;

    const draw = () => {
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      pos.x += dx * 0.25;
      pos.y += dy * 0.25;

      const moveDx = pos.x - prevPos.x;
      const moveDy = pos.y - prevPos.y;
      speed = Math.min(Math.sqrt(moveDx * moveDx + moveDy * moveDy) * 0.5, 8);

      if (speed > 0.5) {
        angle = Math.atan2(moveDy, moveDx);
        if (Math.random() < 0.5) {
          particles.push({ x: pos.x, y: pos.y, life: 1 });
        }
      }
      prevPos = { x: pos.x, y: pos.y };

      ring.x += (mouse.x - ring.x) * 0.15;
      ring.y += (mouse.y - ring.y) * 0.15;
      const ringSize = hovering ? 24 : 14;
      const ringColor = hovering
        ? 'rgba(240, 171, 252, 0.7)'
        : 'rgba(34, 228, 255, 0.4)';

      ctx.strokeStyle = ringColor;
      ctx.lineWidth = hovering ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ringSize, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.life -= 0.03;
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(34, 228, 255, ${r.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, (1 - r.life) * 40, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.04;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(34, 228, 255, ${p.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle);

      const flicker = 0.85 + Math.random() * 0.3;
      const flameLen = (5 + speed * 2.5) * flicker;
      const flame = ctx.createLinearGradient(-8 - flameLen, 0, -6, 0);
      flame.addColorStop(0, 'rgba(240, 171, 252, 0)');
      flame.addColorStop(0.45, 'rgba(168, 85, 247, 0.6)');
      flame.addColorStop(1, 'rgba(34, 228, 255, 0.9)');
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#22E4FF';
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-6, -2.2);
      ctx.lineTo(-8 - flameLen, 0);
      ctx.lineTo(-6, 2.2);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22E4FF';
      ctx.strokeStyle = 'rgba(34, 228, 255, 0.9)';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(10, 15, 36, 0.92)';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(3, -3.6);
      ctx.lineTo(-6, -2.6);
      ctx.lineTo(-6, 2.6);
      ctx.lineTo(3, 3.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(1, -3);
      ctx.lineTo(-4, -9);
      ctx.lineTo(-7, -8);
      ctx.lineTo(-5, -2.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(1, 3);
      ctx.lineTo(-4, 9);
      ctx.lineTo(-7, 8);
      ctx.lineTo(-5, 2.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 8;
      ctx.shadowColor = '#F0ABFC';
      ctx.fillStyle = '#F0ABFC';
      ctx.beginPath();
      ctx.ellipse(4, 0, 2.2, 1.3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[90]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
