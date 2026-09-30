import { projects } from '../data/projects';
import { sections } from '../data/sections';
import Container from '../components/layout/Container';
import ProjectCard from '../components/ui/ProjectCard';

export function Projects() {
  const section = sections.find((s) => s.id === 'projects');

  return (
    <section
      id="projects"
      className="min-h-[100svh] min-h-[100dvh] flex flex-col justify-center py-20 sm:py-24"
    >
      <Container>
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-text tracking-tight">
            {section?.label}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Projects;
