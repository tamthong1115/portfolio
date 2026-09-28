import { profile } from '../data/profile';
import { sections } from '../data/sections';

export default function About() {
  const section = sections.find((s) => s.id === 'about');

  return (
    <section
      id="about"
      className="min-h-[100svh] flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      <h2 className="text-2xl sm:text-4xl font-display font-bold text-text mb-6">
        {section?.label}
      </h2>
      <p className="text-base sm:text-lg font-body text-muted max-w-3xl leading-relaxed">
        {profile.bio}
      </p>
    </section>
  );
}
