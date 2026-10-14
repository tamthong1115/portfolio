import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisProvider } from './context/LenisContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import Scene from './components/canvas/Scene';
import Loader from './components/ui/Loader';
import WorkspaceHUD from './components/ui/WorkspaceHUD';
import RetroTerminalModal from './components/terminal/RetroTerminalModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

export function App() {
  const handleLoaderComplete = () => {
    // Refresh ScrollTrigger after loader fade transition completes
    ScrollTrigger.refresh();
  };

  return (
    <LenisProvider>
      <WorkspaceProvider>
        <Loader onLoaded={handleLoaderComplete} />
        <Scene />

        <Header />
        <main id="main-content" className="relative z-10 flex flex-col pointer-events-none">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <WorkspaceHUD />
        <RetroTerminalModal />
      </WorkspaceProvider>
    </LenisProvider>
  );
}

export default App;
