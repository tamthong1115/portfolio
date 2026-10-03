import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { setLenisInstance } from '../hooks/useLenis';

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Initialize Lenis with autoRaf: false so R3F's useFrame drives the clock
    const instance = new Lenis({
      autoRaf: false,
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      touchMultiplier: 1.5,
    });

    lenisRef.current = instance;
    setLenisInstance(instance);

    // Global reference for debugging and external controls
    if (typeof window !== 'undefined') {
      window.lenis = instance;
    }

    // Intercept in-page anchor links to scroll smoothly via Lenis
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            instance.scrollTo(target, {
              offset: 0,
              immediate: prefersReducedMotion,
              duration: prefersReducedMotion ? 0 : 1.2,
            });
            // Update URL hash cleanly without instant native jump
            if (window.history.pushState) {
              window.history.pushState(null, '', href);
            }
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      instance.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      if (typeof window !== 'undefined') {
        delete window.lenis;
      }
    };
  }, [prefersReducedMotion]);

  return children;
}

export default LenisProvider;
