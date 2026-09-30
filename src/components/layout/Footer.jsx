import { profile } from '../../data/profile';
import { sections } from '../../data/sections';
import Container from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface/80 bg-bg/90 backdrop-blur-md py-12 relative z-10">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:items-start items-center text-center sm:text-left gap-1">
          <p className="font-display font-bold text-text text-base">
            {profile.name}
          </p>
          <p className="text-xs text-muted font-body">
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>
        </div>

        {/* Section Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="text-xs sm:text-sm font-body text-muted hover:text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* External Links */}
        <div className="flex items-center gap-4">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-xs sm:text-sm font-body text-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              Email
            </a>
          )}
          {profile.links.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm font-body text-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              GitHub
            </a>
          )}
          {profile.links.linkedin && (
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm font-body text-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
            >
              LinkedIn
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
