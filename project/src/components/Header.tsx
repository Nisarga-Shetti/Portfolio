import { useState, useEffect } from 'react';
import { navItems } from '@/data/portfolio';
import {
  Award,
  Code,
  Cpu,
  FileText,
  GraduationCap,
  Home,
  Mail,
  Menu,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';

const NAV_ICONS: Record<string, LucideIcon> = {
  Home,
  User,
  Cpu,
  GraduationCap,
  Code,
  Award,
  FileText,
  Mail,
};

interface HeaderProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop header */}
      <header className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 md:block">
        <nav className="flex items-center gap-1 rounded-full border border-cyan/20 bg-deep-navy/70 px-2 py-2 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 font-mono text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan/20 text-cyan shadow-[0_0_12px_rgba(34,228,255,0.3)]'
                    : 'text-muted hover:text-cyan'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-cyan/30 bg-deep-navy/80 backdrop-blur-md md:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-5 w-5 text-cyan" /> : <Menu className="h-5 w-5 text-cyan" />}
      </button>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-void/95 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <nav className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => {
              const Icon = NAV_ICONS[item.icon];
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-6 py-3 font-mono text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan/20 text-cyan'
                      : 'text-muted hover:text-cyan hover:bg-cyan/5'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile bottom dock */}
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 md:hidden">
        <nav className="flex items-center gap-0.5 rounded-full border border-cyan/20 bg-deep-navy/80 px-1 py-1 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isActive
                    ? 'bg-cyan/20 text-cyan shadow-[0_0_8px_rgba(34,228,255,0.3)]'
                    : 'text-muted'
                }`}
                aria-label={item.label}
              >
                {Icon && <Icon className="h-4 w-4" />}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
