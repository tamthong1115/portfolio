import { projects } from '../data/projects';
import { sections } from '../data/sections';

export default function Projects() {
  const section = sections.find((s) => s.id === 'projects');

  return (
    <section
      id="projects"
      className="min-h-[100svh] flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto"
    >
      <h2 className="text-2xl sm:text-4xl font-display font-bold text-text mb-8">
        {section?.label}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="bg-surface p-6 rounded-lg border border-surface flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-display font-bold text-text mb-2">
                {project.title}
              </h3>
              <p className="text-sm font-body text-muted mb-4 leading-relaxed">
                {project.summary}
              </p>
              <p className="text-sm font-body text-text font-medium mb-3">
                {project.role}
              </p>
              <ul className="flex flex-wrap gap-2 mb-4">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="text-xs font-body text-accent bg-bg px-2.5 py-1 rounded"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-bg">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-body text-accent underline hover:opacity-80 transition-opacity"
                >
                  {project.links.live}
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-body text-accent underline hover:opacity-80 transition-opacity"
                >
                  {project.links.repo}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
