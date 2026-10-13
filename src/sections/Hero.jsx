import { profile } from '../data/profile';
import Container from '../components/layout/Container';

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[100svh] min-h-[100dvh] flex items-center justify-center py-20 sm:py-24"
    >
      <Container>
        <div className="max-w-3xl p-6 sm:p-10 md:p-12 rounded-3xl bg-surface/75 backdrop-blur-md border border-surface/70 shadow-2xl pointer-events-auto">
          <h1 className="text-[clamp(2.25rem,6vw+1rem,4.5rem)] font-display font-bold text-text tracking-tight leading-[1.1] mb-4">
            {profile.name}
          </h1>

          <p className="text-lg sm:text-2xl font-display font-semibold text-accent mb-4">
            {profile.title}
          </p>

          <p className="text-base sm:text-lg font-body text-muted leading-relaxed mb-8 max-w-2xl">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-body font-semibold text-sm sm:text-base bg-accent text-bg hover:opacity-95 hover:-translate-y-0.5 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-lg shadow-accent/25 motion-reduce:hover:transform-none"
            >
              View projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-body font-semibold text-sm sm:text-base border border-surface/90 text-text bg-surface/50 hover:bg-surface hover:-translate-y-0.5 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hover:transform-none"
            >
              Contact
            </a>
            {profile.resume && (
              <a
                href={profile.resume}
                download="Truong_Tam_Thong_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-body font-semibold text-sm sm:text-base border border-accent/40 text-text bg-accent/10 hover:bg-accent/20 hover:-translate-y-0.5 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hover:transform-none"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
