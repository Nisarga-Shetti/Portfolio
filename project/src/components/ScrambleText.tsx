import { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*';

interface ScrambleTextProps {
  text: string;
  active: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  reducedMotion?: boolean;
}

export function ScrambleText({ text, active, className = '', as = 'span', reducedMotion = false }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const Tag = as;

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    if (!active) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const totalFrames = 18;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i / text.length < progress) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      setDisplay(scrambled);
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [active, text, reducedMotion]);

  return <Tag className={className}>{display}</Tag>;
}
