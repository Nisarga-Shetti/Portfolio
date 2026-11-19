import { type ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function GlassPanel({ children, className = '', id }: GlassPanelProps) {
  return (
    <div id={id} className={`glass-panel rounded-2xl ${className}`}>
      <span className="corner-tl" aria-hidden="true" />
      <span className="corner-br" aria-hidden="true" />
      {children}
    </div>
  );
}
