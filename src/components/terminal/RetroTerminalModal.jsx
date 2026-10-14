import { useEffect, useRef } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useTerminal } from './useTerminal';
import MatrixRain from './MatrixRain';
import './terminal.css';

export function RetroTerminalModal() {
  const workspace = useWorkspace();
  const { isTerminalOpen, closeTerminal, currentTheme } = workspace;
  const {
    history,
    input,
    setInput,
    runCommand,
    handleKeyDown,
    isMatrixMode,
    setIsMatrixMode,
    clearHistory,
  } = useTerminal(workspace);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const dialogRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isTerminalOpen && !isMatrixMode) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTerminalOpen, isMatrixMode]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isTerminalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTerminalOpen]);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Global Escape handler
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (!isTerminalOpen) {
        // Toggle terminal with backtick ` (unless typing inside another input/textarea)
        if (e.key === '`' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          workspace.toggleTerminal();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (isMatrixMode) {
          setIsMatrixMode(false);
        } else {
          closeTerminal();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isTerminalOpen, isMatrixMode, closeTerminal, workspace, setIsMatrixMode]);

  if (!isTerminalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const handleContainerClick = () => {
    if (!isMatrixMode) {
      inputRef.current?.focus();
    }
  };

  const crtColor = currentTheme?.emissive || '#58c5ff';

  const quickCommands = ['help', 'projects', 'skills', 'neofetch', 'matrix', 'clear'];

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeTerminal();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/70 backdrop-blur-md transition-opacity duration-200"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Retro CRT Terminal Emulator"
        style={{ '--crt-color': crtColor }}
        className="relative w-full max-w-3xl h-[85vh] max-h-[620px] flex flex-col rounded-2xl bg-[#070e17]/95 border-2 border-[var(--crt-color)]/60 shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_15px_var(--crt-color)] crt-screen overflow-hidden text-[var(--crt-color)] font-mono"
      >
        {/* Vintage Terminal Title Bar */}
        <header className="relative z-20 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-surface/90 border-b border-[var(--crt-color)]/30 select-none">
          {/* Traffic light control dots */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeTerminal}
              title="Close terminal (ESC)"
              aria-label="Close terminal"
              className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:opacity-80 transition-opacity cursor-pointer border border-rose-600 focus-visible:outline-2 focus-visible:outline-accent"
            />
            <button
              type="button"
              onClick={clearHistory}
              title="Clear terminal (Ctrl+L)"
              aria-label="Clear terminal"
              className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:opacity-80 transition-opacity cursor-pointer border border-amber-600 focus-visible:outline-2 focus-visible:outline-accent"
            />
            <button
              type="button"
              onClick={() => setIsMatrixMode((prev) => !prev)}
              title="Toggle Matrix mode"
              aria-label="Toggle Matrix easter egg"
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:opacity-80 transition-opacity cursor-pointer border border-emerald-600 focus-visible:outline-2 focus-visible:outline-accent"
            />
          </div>

          {/* Window Title */}
          <div className="text-xs sm:text-sm font-bold tracking-wider crt-subtle-glow truncate px-2">
            thong@portfolio: ~ (VT100) — {currentTheme?.label || 'CRT'}
          </div>

          {/* Close button with text */}
          <button
            type="button"
            onClick={closeTerminal}
            aria-label="Close terminal window"
            className="text-xs font-mono px-2 py-0.5 rounded border border-[var(--crt-color)]/40 hover:bg-[var(--crt-color)]/20 transition-colors cursor-pointer"
          >
            ESC
          </button>
        </header>

        {/* Terminal Body or Matrix Rain Mode */}
        {isMatrixMode ? (
          <div className="flex-1 relative overflow-hidden">
            <MatrixRain onExit={() => setIsMatrixMode(false)} />
          </div>
        ) : (
          <div
            ref={scrollRef}
            onClick={handleContainerClick}
            className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2 text-xs sm:text-sm leading-relaxed crt-subtle-glow select-text"
          >
            {history.map((item) => (
              <div key={item.id} className="whitespace-pre-wrap break-words">
                {item.type === 'command' && (
                  <div className="flex items-start gap-2 text-slate-100 font-semibold">
                    <span className="text-[var(--crt-color)] select-none">thong@portfolio:~$</span>
                    <span>{item.commandText}</span>
                  </div>
                )}
                {item.type === 'output' && (
                  <div className="text-[var(--crt-color)] opacity-95 pl-2 border-l border-[var(--crt-color)]/30 my-1">
                    {item.content}
                  </div>
                )}
                {item.type === 'error' && (
                  <div className="text-rose-400 opacity-95 pl-2 border-l border-rose-500/50 my-1">
                    {item.content}
                  </div>
                )}
                {item.type === 'system' && (
                  <div className="text-slate-300 font-medium my-1">
                    {item.content}
                  </div>
                )}
              </div>
            ))}

            {/* Active Command Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
              <span className="shrink-0 font-bold select-none text-[var(--crt-color)]">
                thong@portfolio:~$
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none font-mono text-[var(--crt-color)] text-xs sm:text-sm p-0 m-0 shadow-none focus:ring-0 focus:outline-none"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-label="Terminal command input"
                />
              </div>
            </form>
          </div>
        )}

        {/* Footer Quick Action Bar for Touch & Shortcut Navigation */}
        <footer className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-surface/80 border-t border-[var(--crt-color)]/30 text-[11px] select-none">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-muted mr-1 hidden sm:inline">Shortcuts:</span>
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  runCommand(cmd);
                  inputRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded bg-[var(--crt-color)]/10 hover:bg-[var(--crt-color)]/25 border border-[var(--crt-color)]/30 text-[var(--crt-color)] transition-colors cursor-pointer text-[10px] sm:text-xs"
              >
                {cmd}
              </button>
            ))}
          </div>

          <div className="text-muted/80 hidden sm:block text-[11px]">
            Toggle: <kbd className="px-1 py-0.5 rounded bg-surface border border-surface text-text">`</kbd> or <kbd className="px-1 py-0.5 rounded bg-surface border border-surface text-text">ESC</kbd>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default RetroTerminalModal;
