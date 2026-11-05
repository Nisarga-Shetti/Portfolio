import { profile } from '@/data/portfolio';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-cyan/10 px-6 py-8 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {profile.name}. Crafted among the stars.
        </p>
        <p className="font-mono text-xs text-muted">
          Built with React, Three.js & Supabase
        </p>
      </div>
    </footer>
  );
}
