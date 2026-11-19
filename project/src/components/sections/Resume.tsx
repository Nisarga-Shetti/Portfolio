import { profile } from '@/data/portfolio';
import { GlassPanel } from '@/components/GlassPanel';
import { ScrambleText } from '@/components/ScrambleText';
import { useReveal } from '@/lib/hooks';
import { Download, FileText } from 'lucide-react';

interface ResumeProps {
  active: boolean;
  reducedMotion: boolean;
}

export function Resume({ active, reducedMotion }: ResumeProps) {
  const { ref, revealed } = useReveal();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">06 / Resume</span>
        </div>

        <h2 className="mb-8 font-heading text-3xl font-bold text-text md:text-4xl">
          <ScrambleText text="Resume" active={active} reducedMotion={reducedMotion} as="span" />
        </h2>

        <GlassPanel className="p-6 md:p-10">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border border-cyan/30 bg-deep-navy/60 md:mb-0 md:mr-8">
              <FileText className="h-14 w-14 text-cyan" />
            </div>

            <div className="flex-1">
              <h3 className="mb-2 font-heading text-xl font-semibold text-text">{profile.name}</h3>
              <p className="mb-1 font-mono text-sm text-cyan">{profile.role}</p>
              <p className="mb-6 text-sm leading-relaxed text-muted">
                Download my complete resume for a detailed overview of my skills, projects, and
                educational background. Available as a PDF for easy reading and sharing.
              </p>

              <a
                href={profile.resumePath}
                download
                className="gradient-border-btn inline-flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold text-cyan transition-transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
