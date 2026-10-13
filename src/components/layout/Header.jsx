import { useState, useEffect } from 'react';
import { profile } from '../../data/profile';
import { sections } from '../../data/sections';
import Container from './Container';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'hero');

  // Handle active section detection via IntersectionObserver
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-25% 0px -45% 0px',
      threshold: 0.1,
    });

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-surface/60 transition-colors duration-200">
        <Container className="flex items-center justify-between py-3.5 sm:py-4">
          {/* Logo / Brand */}
          <a
            href={`#${sections[0]?.id || 'hero'}`}
            className="font-display font-bold text-lg sm:text-xl text-text tracking-tight hover:text-accent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded"
          >
            {profile.name}
          </a>

          {/* Desktop Navigation & Resume */}
          <div className="hidden md:flex items-center gap-3">
            <nav aria-label="Primary navigation">
              <ul className="flex items-center gap-1 lg:gap-2">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`relative px-3.5 py-1.5 rounded-md font-body text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                          isActive
                            ? 'text-accent font-semibold bg-surface/70'
                            : 'text-muted hover:text-text hover:bg-surface/30'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {section.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {profile.resume && (
              <a
                href={profile.resume}
                download="Truong_Tam_Thong_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-body text-xs font-semibold text-accent border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>CV</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-muted hover:text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="sr-only">
              {isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            </span>
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </Container>
      </header>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 top-[57px] sm:top-[65px] z-30 bg-bg/95 backdrop-blur-lg md:hidden flex flex-col justify-start p-6"
        >
          <nav aria-label="Mobile primary navigation" className="w-full">
            <ul className="flex flex-col gap-3">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={closeMenu}
                      className={`block py-3 px-4 rounded-xl text-lg font-display transition-colors ${
                        isActive
                          ? 'bg-surface text-accent font-bold'
                          : 'text-text hover:bg-surface/50'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {profile.resume && (
            <div className="mt-4 pt-4 border-t border-surface/80 w-full">
              <a
                href={profile.resume}
                download="Truong_Tam_Thong_CV.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-base font-semibold bg-accent text-bg shadow-md transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download CV (PDF)</span>
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Header;
