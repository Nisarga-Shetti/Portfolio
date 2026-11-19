import { Code2, Lightbulb, Users } from 'lucide-react';
import { about } from '@/data/portfolio';
import { GlassPanel } from '@/components/GlassPanel';
import { ScrambleText } from '@/components/ScrambleText';
import { useReveal } from '@/lib/hooks';

const iconMap: Record<string, typeof Code2> = {
  Code2,
  Lightbulb,
  Users,
};

interface AboutProps {
  active: boolean;
  reducedMotion: boolean;
}

export function About({ active, reducedMotion }: AboutProps) {
  const { ref, revealed } = useReveal();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">01 / About</span>
        </div>

        <GlassPanel className="p-6 md:p-10">
          <h2 className="mb-6 font-heading text-3xl font-bold text-text md:text-4xl">
            <ScrambleText text="About Me" active={active} reducedMotion={reducedMotion} as="span" />
          </h2>

          <div className="mb-8 flex items-center gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center md:h-24 md:w-24">
              <div
                className="absolute inset-0"
                style={{
                  clipPath:
                    'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'linear-gradient(135deg, #22E4FF, #A855F7)',
                }}
              />
              <div
                className="absolute inset-[2px] flex items-center justify-center"
                style={{
                  clipPath:
                    'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: '#0A0F24',
                }}
              >
                <span className="font-heading text-xl font-bold text-cyan md:text-2xl">NS</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted md:text-base">{about.text}</p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {about.features.map((feature) => {
              const Icon = iconMap[feature.icon] ?? Code2;
              return (
                <div
                  key={feature.title}
                  className="neon-border-hover rounded-xl border border-cyan/15 bg-deep-navy/40 p-4"
                >
                  <Icon className="mb-3 h-6 w-6 text-cyan" />
                  <h3 className="mb-1 font-heading text-sm font-semibold text-text">{feature.title}</h3>
                  <p className="text-xs leading-relaxed text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-black text-gradient-cy md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted md:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
