import { education } from '@/data/portfolio';
import { ScrambleText } from '@/components/ScrambleText';
import { useReveal } from '@/lib/hooks';
import { GraduationCap } from 'lucide-react';

interface EducationProps {
  active: boolean;
  reducedMotion: boolean;
}

export function Education({ active, reducedMotion }: EducationProps) {
  const { ref, revealed } = useReveal();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">03 / Education</span>
        </div>

        <h2 className="mb-8 font-heading text-3xl font-bold text-text md:text-4xl">
          <ScrambleText text="Academic Journey" active={active} reducedMotion={reducedMotion} as="span" />
        </h2>

        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan via-electric-purple to-transparent" />

          {education.map((item, i) => (
            <div key={i} className="relative mb-8 pl-12 last:mb-0">
              <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan bg-deep-navy shadow-[0_0_15px_rgba(34,228,255,0.5)]">
                <GraduationCap className="h-4 w-4 text-cyan" />
              </div>
              <div className="rounded-xl border border-cyan/15 bg-deep-navy/40 p-5 transition-all hover:border-cyan/40 hover:shadow-[0_0_20px_rgba(34,228,255,0.15)]">
                <div className="mb-1 flex items-start justify-between gap-4">
                  <h3 className="font-heading text-base font-semibold text-text">{item.degree}</h3>
                  <span className="shrink-0 font-mono text-xs text-muted">{item.period}</span>
                </div>
                <p className="mb-2 text-sm text-muted">{item.place}</p>
                <div className="inline-flex items-center gap-2 rounded-md border border-electric-purple/30 bg-electric-purple/10 px-3 py-1">
                  <span className="font-mono text-xs font-semibold text-lavender">Score: {item.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
