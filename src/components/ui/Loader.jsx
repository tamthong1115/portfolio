import { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

export function Loader() {
  const { progress, active } = useProgress();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const startTimeRef = useRef(0);

  // Enforce minimum 400ms display time to prevent jarring flash on fast networks
  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);


  // When loading is finished (progress reaches 100 or active turns false) AND minTimeElapsed is true
  useEffect(() => {
    if ((progress >= 100 || !active) && minTimeElapsed && !isDismissed) {
      // Small buffer for smooth visual transition
      const fadeTimer = setTimeout(() => {
        setIsDismissed(true);
      }, 150);
      return () => clearTimeout(fadeTimer);
    }
  }, [progress, active, minTimeElapsed, isDismissed]);

  // Handle CSS transition completion to remove element from interaction/flow
  useEffect(() => {
    if (isDismissed) {
      const exitTimer = setTimeout(() => {
        setIsExited(true);
      }, 500); // matches transition duration
      return () => clearTimeout(exitTimer);
    }
  }, [isDismissed]);

  const handleSkip = () => {
    setIsDismissed(true);
  };

  if (isExited) {
    return null;
  }

  const displayPercent = Math.min(100, Math.round(progress));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading 3D workspace"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg)] transition-opacity duration-500 ease-out ${
        isDismissed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Skip Button - Always accessible in top right */}
      <div className="absolute top-6 right-6">
        <button
          type="button"
          onClick={handleSkip}
          className="cursor-pointer px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)] border border-slate-700/60 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
        >
          Skip 3D Intro &rarr;
        </button>
      </div>

      <div className="w-full max-w-xs px-6 flex flex-col items-center text-center">
        {/* Terminal/Workspace Branding */}
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="font-[var(--font-display)] text-sm tracking-widest uppercase text-[var(--color-muted)]">
            Loading Workspace
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          className="w-full h-1.5 bg-[var(--color-surface)] rounded-full overflow-hidden border border-slate-800"
          role="progressbar"
          aria-valuenow={displayPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-200 ease-out shadow-[0_0_12px_var(--color-accent)]"
            style={{ width: `${displayPercent}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="mt-3 flex justify-between w-full text-xs text-[var(--color-muted)] font-mono">
          <span>Initializing 3D assets</span>
          <span className="text-[var(--color-text)] font-semibold">{displayPercent}%</span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
