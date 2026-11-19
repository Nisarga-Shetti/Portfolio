import { useEffect, useState, useCallback } from 'react';
import { UniverseCanvas } from '@/components/universe/UniverseCanvas';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CustomCursor } from '@/components/CustomCursor';
import { ProgressBar } from '@/components/ProgressBar';
import { Hud } from '@/components/Hud';
import { ScrollCue } from '@/components/ScrollCue';
import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Education } from '@/components/sections/Education';
import { Projects } from '@/components/sections/Projects';
import { Certifications } from '@/components/sections/Certifications';
import { Resume } from '@/components/sections/Resume';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { useActiveSection, useScrollProgress, usePrefersReducedMotion, useIsMobile } from '@/lib/hooks';

const SECTION_IDS = ['home', 'about', 'skills', 'education', 'projects', 'certifications', 'resume', 'contact'];

export function App() {
  const [loading, setLoading] = useState(true);
  const activeSection = useActiveSection(SECTION_IDS);
  const scrollProgress = useScrollProgress();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const handleLoaded = useCallback(() => setLoading(false), []);

  const handleNavigate = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [reducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const current = SECTION_IDS.indexOf(activeSection);
      if (e.key === 'ArrowRight' && current < SECTION_IDS.length - 1) {
        e.preventDefault();
        handleNavigate(SECTION_IDS[current + 1]);
      } else if (e.key === 'ArrowLeft' && current > 0) {
        e.preventDefault();
        handleNavigate(SECTION_IDS[current - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSection, handleNavigate]);

  return (
    <>
      {loading && (
        <LoadingScreen onComplete={handleLoaded} reducedMotion={reducedMotion} />
      )}

      <CustomCursor reducedMotion={reducedMotion} />

      <div className="scanline-overlay" aria-hidden="true" />

      <UniverseCanvas activeSection={activeSection} reducedMotion={reducedMotion} isMobile={isMobile} />

      <ProgressBar />
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      <Hud activeSection={activeSection} />
      <ScrollCue scrollProgress={scrollProgress} />

      <main>
        <section id="home" aria-label="Home">
          <Hero active={activeSection === 'home'} reducedMotion={reducedMotion} />
        </section>
        <section id="about" aria-label="About">
          <About active={activeSection === 'about'} reducedMotion={reducedMotion} />
        </section>
        <section id="skills" aria-label="Skills">
          <Skills active={activeSection === 'skills'} reducedMotion={reducedMotion} />
        </section>
        <section id="education" aria-label="Education">
          <Education active={activeSection === 'education'} reducedMotion={reducedMotion} />
        </section>
        <section id="projects" aria-label="Projects">
          <Projects active={activeSection === 'projects'} reducedMotion={reducedMotion} />
        </section>
        <section id="certifications" aria-label="Certifications">
          <Certifications active={activeSection === 'certifications'} reducedMotion={reducedMotion} />
        </section>
        <section id="resume" aria-label="Resume">
          <Resume active={activeSection === 'resume'} reducedMotion={reducedMotion} />
        </section>
        <section id="contact" aria-label="Contact">
          <Contact active={activeSection === 'contact'} reducedMotion={reducedMotion} />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
