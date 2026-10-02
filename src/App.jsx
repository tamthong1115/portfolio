import Scene from './components/canvas/Scene';
import Loader from './components/ui/Loader';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

export function App() {
  return (
    <>
      <Loader />
      <Scene />

      <Header />
      <main id="main-content" className="relative z-10 flex flex-col">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
