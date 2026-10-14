import { profile } from '../data/profile';
import { sections } from '../data/sections';
import Container from '../components/layout/Container';

export function About() {
  const section = sections.find((s) => s.id === 'about');

  return (
    <section
      id="about"
      className="min-h-[100svh] min-h-[100dvh] flex items-center justify-center py-20 sm:py-24"
    >
      <Container>
        <div className="max-w-4xl p-6 sm:p-10 md:p-12 rounded-3xl bg-surface/75 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_25px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-300">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-text mb-6">
            {section?.label}
          </h2>

          <div className={`flex flex-col ${profile.photo ? 'md:flex-row items-center gap-8' : ''}`}>
            {profile.photo && (
              <div className="shrink-0 mb-6 md:mb-0">
                <img
                  src={profile.photo}
                  alt={`${profile.name} portrait`}
                  width={240}
                  height={240}
                  loading="lazy"
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl object-cover border border-surface shadow-md"
                />
              </div>
            )}

            <div className="max-w-[65ch]">
              <p className="text-base sm:text-lg font-body text-muted leading-relaxed mb-4">
                {profile.bio}
              </p>

              {/* Engineering Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6 pt-5 border-t border-surface/80">
                <div className="p-3 rounded-xl bg-bg/60 border border-surface/80">
                  <div className="text-[11px] font-mono text-muted mb-0.5">Role</div>
                  <div className="text-xs sm:text-sm font-display font-bold text-text">Fullstack Eng</div>
                </div>
                <div className="p-3 rounded-xl bg-bg/60 border border-surface/80">
                  <div className="text-[11px] font-mono text-muted mb-0.5">Core Ecosystem</div>
                  <div className="text-xs sm:text-sm font-display font-bold text-accent">React + Java</div>
                </div>
                <div className="p-3 rounded-xl bg-bg/60 border border-surface/80">
                  <div className="text-[11px] font-mono text-muted mb-0.5">Backend</div>
                  <div className="text-xs sm:text-sm font-display font-bold text-text">Microservices</div>
                </div>
                <div className="p-3 rounded-xl bg-bg/60 border border-surface/80">
                  <div className="text-[11px] font-mono text-muted mb-0.5">Quality</div>
                  <div className="text-xs sm:text-sm font-display font-bold text-emerald-400">CI/CD &amp; Tests</div>
                </div>
              </div>

              {profile.resume && (
                <a
                  href={profile.resume}
                  download="Truong_Tam_Thong_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm border border-accent/40 text-text bg-accent/10 hover:bg-accent/20 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Download Resume (PDF)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default About;
