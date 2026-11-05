import { certifications } from '@/data/portfolio';
import { GlassPanel } from '@/components/GlassPanel';
import { ScrambleText } from '@/components/ScrambleText';
import { useReveal } from '@/lib/hooks';
import { Award, ExternalLink } from 'lucide-react';

interface CertificationsProps {
  active: boolean;
  reducedMotion: boolean;
}

export function Certifications({ active, reducedMotion }: CertificationsProps) {
  const { ref, revealed } = useReveal();

  if (certifications.length === 0) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
      >
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">05 / Certifications</span>
          </div>

          <h2 className="mb-8 font-heading text-3xl font-bold text-text md:text-4xl">
            <ScrambleText text="Certifications" active={active} reducedMotion={reducedMotion} as="span" />
          </h2>

          <GlassPanel className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan/20 bg-deep-navy/50">
              <Award className="h-9 w-9 text-cyan/60" />
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-text">Certifications coming soon</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              New certifications will appear here automatically once added. Stay tuned as I continue
              expanding my qualifications.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-cyan" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">Awaiting data</span>
            </div>
          </GlassPanel>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">05 / Certifications</span>
        </div>

        <h2 className="mb-8 font-heading text-3xl font-bold text-text md:text-4xl">
          <ScrambleText text="Certifications" active={active} reducedMotion={reducedMotion} as="span" />
        </h2>

        <div className="space-y-4">
          {certifications.map((cert, i) => (
            <GlassPanel key={i} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-base font-semibold text-text">{cert.title}</h3>
                  <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                  <div className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-muted">
                    <span>{cert.date}</span>
                    <span>·</span>
                    <span>ID: {cert.credentialId}</span>
                  </div>
                </div>
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-cyan/30 p-2 text-cyan transition-all hover:border-cyan hover:shadow-[0_0_12px_rgba(34,228,255,0.3)]"
                  aria-label={`View ${cert.title} certification`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}
