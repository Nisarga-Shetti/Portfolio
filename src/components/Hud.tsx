import { useEffect, useRef, useState } from 'react';
import { hudLocations } from '@/data/portfolio';

interface HudProps {
  activeSection: string;
}

export function Hud({ activeSection }: HudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(0);
  const location = hudLocations[activeSection] ?? 'SYS ONLINE';
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) / 2 - 4;

      ctx.strokeStyle = 'rgba(34, 228, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(34, 228, 255, 0.08)';
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }

      const sweepAngle = angleRef.current;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(34, 228, 255, 0)');
      grad.addColorStop(0.5, 'rgba(34, 228, 255, 0.15)');
      grad.addColorStop(1, 'rgba(34, 228, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, sweepAngle - 0.5, sweepAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(34, 228, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, sweepAngle - 0.5, sweepAngle);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      for (let i = 0; i < 3; i++) {
        const pa = sweepAngle + (i * Math.PI * 2) / 3;
        const pr = r * (0.5 + 0.3 * Math.sin(sweepAngle * 2 + i));
        ctx.beginPath();
        ctx.arc(cx + Math.cos(pa) * pr, cy + Math.sin(pa) * pr, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      angleRef.current += reduced ? 0 : 0.03;
      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden md:flex">
      <div className="flex items-center gap-3 rounded-xl border border-cyan/20 bg-deep-navy/70 px-3 py-2 backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={48}
          height={48}
          className="h-12 w-12"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan">
            {location}
          </span>
          <span className="font-mono text-[10px] text-muted">{time}</span>
        </div>
      </div>
    </div>
  );
}
