import { useState, useCallback, useRef } from 'react';
import { executeCommand, COMMAND_LIST } from './terminalCommands';

const INITIAL_WELCOME = {
  id: 'welcome',
  type: 'system',
  content: `
PortfolioOS v1.0.0 (x86_64-retro-pc) [VT100 Emulation]
Welcome to Truong Tam Thong's Interactive Workspace Terminal!

Type 'help' to view available commands.
Type 'neofetch' for system info, or 'matrix' for an easter egg.
`,
};

export function useTerminal(context) {
  const [history, setHistory] = useState([INITIAL_WELCOME]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const nextIdRef = useRef(1);

  const runCommand = useCallback(
    (commandText) => {
      const trimmed = commandText.trim();
      if (!trimmed) {
        setHistory((prev) => [
          ...prev,
          { id: `empty-${nextIdRef.current++}`, type: 'command', commandText: '' },
        ]);
        return;
      }

      // Add to command history for Up/Down arrow recall
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const result = executeCommand(trimmed, context);

      if (!result) return;

      if (result.action === 'clear') {
        setHistory([]);
        return;
      }

      if (result.action === 'start_matrix') {
        setIsMatrixMode(true);
        return;
      }

      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${nextIdRef.current++}`,
          type: 'command',
          commandText: trimmed,
        },
        {
          id: `out-${nextIdRef.current++}`,
          type: result.type,
          content: result.content,
        },
      ]);
    },
    [context]
  );

  const handleKeyDown = useCallback(
    (e) => {
      // Up Arrow: Navigate previous commands
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        const nextIndex =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] || '');
      }

      // Down Arrow: Navigate next commands
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;

        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex] || '');
        }
      }

      // Tab: Autocomplete command
      else if (e.key === 'Tab') {
        e.preventDefault();
        const current = input.trim().toLowerCase();
        if (!current) return;

        const matches = COMMAND_LIST.filter((cmd) => cmd.startsWith(current));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          setHistory((prev) => [
            ...prev,
            {
              id: `cmd-${nextIdRef.current++}`,
              type: 'command',
              commandText: input,
            },
            {
              id: `tab-${nextIdRef.current++}`,
              type: 'output',
              content: matches.join('   '),
            },
          ]);
        }
      }

      // Ctrl+L: Clear terminal
      else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setHistory([]);
      }

      // Ctrl+C: Cancel current line
      else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        if (isMatrixMode) {
          setIsMatrixMode(false);
        } else {
          setHistory((prev) => [
            ...prev,
            { id: `cancel-${nextIdRef.current++}`, type: 'command', commandText: `${input}^C` },
          ]);
          setInput('');
        }
      }
    },
    [commandHistory, historyIndex, input, isMatrixMode]
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  return {
    history,
    input,
    setInput,
    runCommand,
    handleKeyDown,
    isMatrixMode,
    setIsMatrixMode,
    clearHistory,
  };
}

export default useTerminal;
