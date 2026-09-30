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
        <div className="max-w-4xl p-6 sm:p-10 md:p-12 rounded-3xl bg-surface/75 backdrop-blur-md border border-surface/70 shadow-2xl">
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
              <p className="text-base sm:text-lg font-body text-muted leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default About;
