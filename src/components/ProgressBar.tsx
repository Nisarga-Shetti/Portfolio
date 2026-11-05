import { useScrollProgress } from '@/lib/hooks';

export function ProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 bg-transparent"
      role="progressbar"
      aria-valuetext={`${Math.round(progress * 100)}% scrolled`}
    >
      <div
        className="h-full transition-[width] duration-75"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #22E4FF, #A855F7, #F0ABFC)',
          boxShadow: '0 0 8px rgba(34,228,255,0.6)',
        }}
      />
    </div>
  );
}
