import { useState, useEffect, lazy, Suspense } from 'react';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import posterDeskUrl from '../../assets/poster-desk.webp';

// Dynamically lazy-load 3D canvas so low-tier devices skip WebGL library download entirely
const ThreeCanvas = lazy(() => import('./ThreeCanvas'));

export function Scene() {
  const detectedTier = useDeviceTier();
  const prefersReducedMotion = useReducedMotion();
  const [showDevControls, setShowDevControls] = useState(false);
  const [downgradedTier, setDowngradedTier] = useState(null);

  // Derive activeTier from live PerformanceMonitor downgrade or initial hardware tier
  const activeTier = downgradedTier || detectedTier;

  useEffect(() => {
    // Only in development and when URL hash includes #controls
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      const checkHash = () => {
        setShowDevControls(window.location.hash.includes('controls'));
      };
      checkHash();
      window.addEventListener('hashchange', checkHash);
      return () => window.removeEventListener('hashchange', checkHash);
    }
  }, []);

  // Use static poster if tier is 'low' or if reduced motion is requested on a non-high device
  const shouldUsePoster =
    activeTier === 'low' || (prefersReducedMotion && activeTier !== 'high');

  if (shouldUsePoster) {
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <img
          src={posterDeskUrl}
          alt=""
          width={1600}
          height={1000}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover select-none"
        />
        {/* Subtle dark ambient gradient overlay to preserve exact contrast depth */}
        <div className="absolute inset-0 bg-[#0b0f19]/30 pointer-events-none" />
      </div>
    );
  }

  const isHighTier = activeTier === 'high';

  const handleDegrade = (type) => {
    if (type === 'fallback') {
      setDowngradedTier('low');
    } else {
      setDowngradedTier((current) => {
        const base = current || detectedTier;
        if (base === 'high') return 'mid';
        return 'low';
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'auto',
      }}
      className="fixed inset-0 z-0 pointer-events-auto"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ThreeCanvas
          isHighTier={isHighTier}
          onDegrade={handleDegrade}
          showDevControls={showDevControls}
        />
      </Suspense>
    </div>
  );
}

export default Scene;
