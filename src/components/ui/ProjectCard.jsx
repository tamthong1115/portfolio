export function ProjectCard({ project }) {
  const hasLiveLink = Boolean(project.links?.live && project.links.live.trim() !== '');
  const hasRepoLink = Boolean(project.links?.repo && project.links.repo.trim() !== '');

  return (
    <article className="group bg-surface/75 backdrop-blur-md rounded-2xl border border-surface/70 overflow-hidden flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-black/20 motion-reduce:hover:transform-none">
      <div>
        {/* Project Image or Neutral Placeholder */}
        <div className="relative aspect-video w-full overflow-hidden bg-bg/60 border-b border-surface/50">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              width={640}
              height={360}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:group-hover:transform-none"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-surface/40 p-6 text-center select-none"
              aria-label={`${project.title} placeholder visual`}
            >
              <div className="w-12 h-12 rounded-xl bg-bg/80 border border-surface flex items-center justify-center text-accent mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <span className="text-xs font-display font-medium text-muted tracking-wide uppercase">
                Preview coming soon
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-display font-bold text-text group-hover:text-accent transition-colors duration-200">
              {project.title}
            </h3>
            {project.role && (
              <span className="text-xs font-body font-medium text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full shrink-0">
                {project.role}
              </span>
            )}
          </div>

          <p className="text-sm font-body text-muted leading-relaxed mb-5">
            {project.summary}
          </p>

          {/* Tech Stack Tags */}
          {project.stack && project.stack.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mb-2" aria-label="Technologies used">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="text-xs font-body text-muted bg-bg/70 border border-surface/80 px-2.5 py-1 rounded-md"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Card Footer / Links (Only rendered if live or repo exists) */}
      {(hasLiveLink || hasRepoLink) && (
        <div className="px-6 py-4 bg-bg/40 border-t border-surface/60 flex items-center gap-4">
          {hasLiveLink && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-body font-semibold text-text hover:text-accent transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded py-1 px-1.5 -ml-1.5"
            >
              <span>Live</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
          {hasRepoLink && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-body font-semibold text-text hover:text-accent transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded py-1 px-1.5"
            >
              <span>Code</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
