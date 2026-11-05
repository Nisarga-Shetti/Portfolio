import { skillCategories } from '@/data/tech';
import { GlassPanel } from '@/components/GlassPanel';
import { ScrambleText } from '@/components/ScrambleText';
import { useReveal } from '@/lib/hooks';
import { useState } from 'react';

interface SkillsProps {
  active: boolean;
  reducedMotion: boolean;
}

export function Skills({ active, reducedMotion }: SkillsProps) {
  const { ref, revealed } = useReveal();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">02 / Skills</span>
        </div>

        <h2 className="mb-8 font-heading text-3xl font-bold text-text md:text-4xl">
          <ScrambleText text="Tech Arsenal" active={active} reducedMotion={reducedMotion} as="span" />
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <GlassPanel key={category.title} className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Icon className="h-5 w-5" style={{ color: category.color }} />
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider" style={{ color: category.color }}>
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => {
                    const SkillIcon = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="relative"
                        onMouseEnter={() => setHovered(skill.name)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div className="tech-chip flex items-center gap-1.5 cursor-pointer">
                          <SkillIcon className="h-3 w-3" />
                          {skill.name}
                        </div>
                        {hovered === skill.name && (
                          <div className="absolute bottom-full left-0 z-50 mb-2 w-48 rounded-lg border border-cyan/30 bg-deep-navy/95 p-2 text-xs leading-relaxed text-muted shadow-xl backdrop-blur-md">
                            {skill.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
