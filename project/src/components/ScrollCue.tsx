interface ScrollCueProps {
  scrollProgress: number;
}

export function ScrollCue({ scrollProgress }: ScrollCueProps) {
  if (scrollProgress >= 0.02) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      aria-hidden="true"
    >
      <div className="relative flex h-10 w-5 justify-center rounded-full border border-cyan/40">
        <div
          className="absolute top-1.5 h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(34,228,255,0.8)]"
          style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }}
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Scroll to Dock
      </span>
    </div>
  );
}
