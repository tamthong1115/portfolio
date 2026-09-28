import { profile } from '../data/profile';
import { sections } from '../data/sections';

export default function Contact() {
  const section = sections.find((s) => s.id === 'contact');

  return (
    <section
      id="contact"
      className="min-h-[100svh] flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      <h2 className="text-2xl sm:text-4xl font-display font-bold text-text mb-6">
        {section?.label}
      </h2>
      <div className="flex flex-col gap-3 items-start">
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="text-base sm:text-lg font-body text-accent underline hover:opacity-80 transition-opacity"
          >
            {profile.email}
          </a>
        )}
        {profile.links.github && (
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-base sm:text-lg font-body text-accent underline hover:opacity-80 transition-opacity"
          >
            {profile.links.github}
          </a>
        )}
        {profile.links.linkedin && (
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-base sm:text-lg font-body text-accent underline hover:opacity-80 transition-opacity"
          >
            {profile.links.linkedin}
          </a>
        )}
      </div>
    </section>
  );
}
