import { useWorkspace } from '../../hooks/useWorkspace';

export function WorkspaceHUD() {
  const {
    lampOn,
    toggleLamp,
    currentTheme,
    cycleScreenTheme,
    soundEnabled,
    toggleSound,
    toastMessage,
    openTerminal,
  } = useWorkspace();

  return (
    <>
      {/* Floating Action Toast Notification */}
      <div
        aria-live="polite"
        className={`fixed top-20 right-6 z-50 pointer-events-none transition-all duration-300 ease-out transform ${
          toastMessage
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-2 scale-95'
        }`}
      >
        {toastMessage && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface/90 backdrop-blur-md border border-accent/40 shadow-xl shadow-black/40 text-xs sm:text-sm font-mono text-text">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping motion-reduce:animate-none" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Floating Interactive Workspace Controls Pill */}
      <aside
        aria-label="3D Workspace Micro-interactions"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-surface/80 backdrop-blur-md border border-surface/90 shadow-xl shadow-black/30 pointer-events-auto"
      >
        {/* Toggle Desk Lamp */}
        <button
          type="button"
          onClick={toggleLamp}
          title="Click to toggle desk lamp light"
          aria-label={lampOn ? 'Turn desk lamp off' : 'Turn desk lamp on'}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent cursor-pointer ${
            lampOn
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-surface/60 text-muted hover:text-text border border-transparent'
          }`}
        >
          <span className="text-sm">{lampOn ? '💡' : '🌑'}</span>
          <span className="hidden sm:inline">Lamp</span>
          <span className="font-bold">{lampOn ? 'ON' : 'OFF'}</span>
        </button>

        {/* Cycle Monitor Screen Theme */}
        <button
          type="button"
          onClick={cycleScreenTheme}
          title="Click to cycle CRT monitor terminal themes"
          aria-label={`Cycle CRT terminal theme. Current: ${currentTheme.label}`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent cursor-pointer border border-accent/30 bg-accent/10 hover:bg-accent/20 text-text"
        >
          <span
            className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: currentTheme.emissive, color: currentTheme.emissive }}
          />
          <span className="hidden sm:inline">CRT:</span>
          <span className="font-semibold text-accent">{currentTheme.label.split(' ')[0]}</span>
        </button>

        {/* Launch Interactive Retro Terminal CLI */}
        <button
          type="button"
          onClick={openTerminal}
          title="Open Retro Terminal CLI (` or click)"
          aria-label="Open Retro Terminal CLI"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent cursor-pointer border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
        >
          <span className="font-bold text-sm leading-none">&gt;_</span>
          <span className="hidden sm:inline">CLI</span>
        </button>

        {/* Toggle Audio Click/Chirp Effects */}
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute 3D sound effects' : 'Enable 3D sound effects'}
          aria-label={soundEnabled ? 'Mute 3D sound effects' : 'Enable 3D sound effects'}
          className={`p-1.5 rounded-xl text-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent cursor-pointer ${
            soundEnabled
              ? 'text-accent bg-surface/80 hover:bg-surface'
              : 'text-muted/60 bg-surface/40 hover:text-muted'
          }`}
        >
          <span className="text-sm">{soundEnabled ? '🔊' : '🔇'}</span>
        </button>
      </aside>
    </>
  );
}

export default WorkspaceHUD;
