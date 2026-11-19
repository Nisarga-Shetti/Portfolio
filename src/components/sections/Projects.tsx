import { useMemo, useState } from 'react';
import { projects } from '@/data/portfolio';
import { ScrambleText } from '@/components/ScrambleText';
import { TiltCard } from '@/components/TiltCard';
import { useReveal } from '@/lib/hooks';
import { ExternalLink, Github, Star } from 'lucide-react';

interface ProjectsProps {
  active: boolean;
  reducedMotion: boolean;
}

function gradientForTitle(title: string): string {
  const palettes = [
    'linear-gradient(135deg, #22E4FF, #A855F7)',
    'linear-gradient(135deg, #A855F7, #F0ABFC)',
    'linear-gradient(135deg, #22E4FF, #0A0F24)',
    'linear-gradient(135deg, #C084FC, #22E4FF)',
    'linear-gradient(135deg, #F0ABFC, #A855F7)',
    'linear-gradient(135deg, #22E4FF, #C084FC)',
    'linear-gradient(135deg, #0A0F24, #22E4FF)',
    'linear-gradient(135deg, #A855F7, #22E4FF)',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
}

export function Projects({ active, reducedMotion }: ProjectsProps) {
  const { ref, revealed } = useReveal();
  const [filter, setFilter] = useState<string>('All');

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tech.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const list = filter === 'All' ? projects : projects.filter((p) => p.tech.includes(filter));
    return [...list].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }, [filter]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-3xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">04 / Projects</span>
        </div>

        <h2 className="mb-6 font-heading text-3xl font-bold text-text md:text-4xl">
          <ScrambleText text="Project Galaxy" active={active} reducedMotion={reducedMotion} as="span" />
        </h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                filter === tech
                  ? 'border-cyan bg-cyan/20 text-cyan shadow-[0_0_12px_rgba(34,228,255,0.3)]'
                  : 'border-cyan/20 bg-deep-navy/40 text-muted hover:border-cyan/40 hover:text-cyan'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <TiltCard
              key={project.title}
              reducedMotion={reducedMotion}
              className="group relative rounded-xl border border-cyan/15 bg-deep-navy/50 p-5 hover:border-cyan/40 hover:shadow-[0_0_25px_rgba(34,228,255,0.2)]"
            >
              {project.featured && (
                <div className="absolute -top-2 left-4 flex items-center gap-1 rounded-full border border-lavender/40 bg-deep-navy px-2 py-0.5">
                  <Star className="h-2.5 w-2.5 fill-lavender text-lavender" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-lavender">Featured</span>
                </div>
              )}

              <div
                className="mb-4 h-20 w-full rounded-lg opacity-80 transition-opacity group-hover:opacity-100"
                style={{ background: gradientForTitle(project.title) }}
              />

              <h3 className="mb-1 font-heading text-base font-bold text-text">{project.title}</h3>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-cyan">{project.tag}</p>
              <p className="mb-4 text-xs leading-relaxed text-muted">{project.description}</p>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="tech-chip">{t}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-deep-navy/60 px-4 py-2 font-mono text-xs font-semibold text-cyan transition-all hover:border-cyan hover:bg-cyan/10 hover:shadow-[0_0_15px_rgba(34,228,255,0.3)]"
                  aria-label={`View ${project.title} code on GitHub`}
                >
                  <Github className="h-3.5 w-3.5" />
                  Code
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-lavender/30 bg-deep-navy/60 px-4 py-2 font-mono text-xs font-semibold text-lavender transition-all hover:border-lavender hover:bg-lavender/10"
                    aria-label={`Open ${project.title} live`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live
                  </a>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
