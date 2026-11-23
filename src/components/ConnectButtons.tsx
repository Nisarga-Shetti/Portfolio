import { Github, Linkedin, type LucideIcon } from 'lucide-react';
import { socialLinks } from '@/data/portfolio';

const ICONS: Record<string, LucideIcon> = {
  Github,
  Linkedin,
};

const ARIA_LABELS: Record<string, string> = {
  GitHub: "Nisarga's GitHub profile",
  LinkedIn: "Nisarga's LinkedIn profile",
};

interface ConnectButtonsProps {
  variant?: 'row' | 'icons';
  className?: string;
}

export function ConnectButtons({ variant = 'row', className = '' }: ConnectButtonsProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg border border-cyan/20 bg-deep-navy/40 font-mono text-cyan transition-all hover:border-cyan hover:text-cyan hover:shadow-[0_0_12px_rgba(34,228,255,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-void';

  if (variant === 'icons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {socialLinks.map((link) => {
          const Icon = ICONS[link.icon] ?? Github;
          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ARIA_LABELS[link.label] ?? link.label}
              className={`${base} h-11 w-11`}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {socialLinks.map((link) => {
        const Icon = ICONS[link.icon] ?? Github;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ARIA_LABELS[link.label] ?? link.label}
            className={`${base} gap-2 px-4 py-2.5 text-xs font-medium text-muted hover:text-cyan`}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
