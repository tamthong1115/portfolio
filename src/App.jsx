import Scene from './components/canvas/Scene';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import { sections } from './data/sections';

export function App() {
  return (
    <>
      <Scene />
      <header className="fixed top-0 left-0 right-0 z-20 bg-bg/80 backdrop-blur-md border-b border-surface">
        <nav className="max-w-5xl mx-auto px-6 py-4">
          <ul className="flex items-center gap-6">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="font-body text-sm text-muted hover:text-text transition-colors"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
