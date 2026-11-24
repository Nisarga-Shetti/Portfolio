
import { ArrowLeft, ArrowRight, FileText, Rocket } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { ScrambleText } from '@/components/ScrambleText';
import { ConnectButtons } from '@/components/ConnectButtons';

interface HeroProps {
  active: boolean;
  reducedMotion: boolean;
}

export function Hero({ active, reducedMotion }: HeroProps) {
  return (
    <div className="relative z-20 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24">
      <div className="relative z-20 w-full max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            System Online
          </span>
        </div>

        <h1 className="mb-4 max-w-[620px] font-heading text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <ScrambleText
            text={profile.name}
            active={active}
            reducedMotion={reducedMotion}
            as="span"
            className="text-gradient-c"
          />
        </h1>

        <p className="mb-6 font-mono text-sm uppercase tracking-[0.25em] text-lavender md:text-base">
          {profile.role}
        </p>

        <p className="mb-10 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {profile.intro}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            className="gradient-border-btn flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold text-cyan transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            <Rocket className="h-4 w-4" />
            View Projects
          </a>

          <a
            href={profile.resumePath}
            download
            className="flex items-center gap-2 rounded-xl border border-cyan/30 bg-deep-navy/60 px-6 py-3 font-mono text-sm font-semibold text-text transition-all hover:border-cyan hover:bg-deep-navy/80 hover:shadow-[0_0_20px_rgba(34,228,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            <FileText className="h-4 w-4" />
            Download Resume
          </a>

          <ConnectButtons variant="icons" />
        </div>

        <div className="mt-12 hidden items-center gap-2 md:flex">
          <kbd className="keycap" aria-label="Left arrow key">
            <ArrowLeft className="h-3 w-3" />
          </kbd>
          <kbd className="keycap" aria-label="Right arrow key">
            <ArrowRight className="h-3 w-3" />
          </kbd>
          <span className="ml-2 font-mono text-xs text-muted">
            Navigate sections
          </span>
        </div>
      </div>
    </div>
  );
}
