import { useState, useCallback, useMemo, useRef } from 'react';
import {
  playLampClickSound,
  playTerminalChirp,
  playKeyboardClickSound,
  playDiskDriveSound,
  playMouseClickSound,
  playPageFlipSound,
  playPenClinkSound,
  playChairSwivelSound,
} from '../utils/soundEffects';
import { SCREEN_THEMES } from '../data/screenThemes';
import { WorkspaceContext } from './WorkspaceContextInstance';

export function WorkspaceProvider({ children }) {
  const [lampOn, setLampOn] = useState(true);
  const [themeIndex, setThemeIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [activeInteraction, setActiveInteraction] = useState(null);
  const toastTimeoutRef = useRef(null);
  const interactionTimeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const toggleLamp = useCallback(() => {
    setLampOn((prev) => {
      const next = !prev;
      if (soundEnabled) {
        playLampClickSound(next);
      }
      showToast(next ? '💡 Desk Lamp: ON' : '💡 Desk Lamp: OFF');
      return next;
    });
  }, [soundEnabled, showToast]);

  const setLampState = useCallback(
    (isOn) => {
      setLampOn(isOn);
      if (soundEnabled) {
        playLampClickSound(isOn);
      }
      showToast(isOn ? '💡 Desk Lamp: ON' : '💡 Desk Lamp: OFF');
    },
    [soundEnabled, showToast]
  );

  const cycleScreenTheme = useCallback(() => {
    setThemeIndex((prev) => {
      const next = (prev + 1) % SCREEN_THEMES.length;
      if (soundEnabled) {
        playTerminalChirp(next);
      }
      const newTheme = SCREEN_THEMES[next];
      showToast(`🖥️ Terminal: ${newTheme.label} (${newTheme.prompt})`);
      return next;
    });
  }, [soundEnabled, showToast]);

  const setThemeById = useCallback(
    (id) => {
      const idx = SCREEN_THEMES.findIndex((t) => t.id === id);
      if (idx !== -1) {
        setThemeIndex(idx);
        if (soundEnabled) {
          playTerminalChirp(idx);
        }
        const newTheme = SCREEN_THEMES[idx];
        showToast(`🖥️ Terminal: ${newTheme.label} (${newTheme.prompt})`);
      }
    },
    [soundEnabled, showToast]
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      showToast(next ? '🔊 Audio FX: Enabled' : '🔇 Audio FX: Muted');
      return next;
    });
  }, [showToast]);

  const openTerminal = useCallback(() => {
    setIsTerminalOpen(true);
    if (soundEnabled) {
      playTerminalChirp(themeIndex);
    }
  }, [soundEnabled, themeIndex]);

  const closeTerminal = useCallback(() => {
    setIsTerminalOpen(false);
  }, []);

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen((prev) => {
      const next = !prev;
      if (next && soundEnabled) {
        playTerminalChirp(themeIndex);
      }
      return next;
    });
  }, [soundEnabled, themeIndex]);

  const triggerInteraction = useCallback((objectId) => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    setActiveInteraction(objectId);
    interactionTimeoutRef.current = setTimeout(() => {
      setActiveInteraction(null);
    }, 600);
  }, []);

  const interactWithObject = useCallback(
    (item) => {
      if (!item) return;
      triggerInteraction(item.id);

      switch (item.id) {
        case 'lamp':
          toggleLamp();
          break;
        case 'terminal':
          openTerminal();
          break;
        case 'keyboard': {
          if (soundEnabled) playKeyboardClickSound();
          const keyboardQuotes = [
            '⌨️ Mechanical Keyboard: typing 120 WPM [Cherry MX Blue]',
            "⌨️ Mechanical Keyboard: git commit -m 'feat: clean architecture'",
            '⌨️ Mechanical Keyboard: npm test — all suites passing',
            '⌨️ Mechanical Keyboard: while(coding) { optimize(); }',
          ];
          const quote = keyboardQuotes[Math.floor(Math.random() * keyboardQuotes.length)];
          showToast(quote);
          break;
        }
        case 'cpu': {
          if (soundEnabled) playDiskDriveSound();
          const cpuQuotes = [
            '💾 Floppy Disk Drive: Reading disk A:/ (1.44MB)',
            '💾 CPU Tower: Intel 486 DX2-66MHz / 16MB RAM active',
            '💾 System Bus: DMA transfer complete',
          ];
          const quote = cpuQuotes[Math.floor(Math.random() * cpuQuotes.length)];
          showToast(quote);
          break;
        }
        case 'mouse': {
          if (soundEnabled) playMouseClickSound();
          showToast('🖱️ Vintage Mouse: Microswitch click registered');
          break;
        }
        case 'book': {
          if (soundEnabled) playPageFlipSound();
          const notes = [
            "📖 Developer Notes: 'Clean code, resilient architectures, and strong coffee.'",
            '📖 Tech Stack: React 19, Three.js, Java Spring Boot, PostgreSQL, Docker.',
            '📖 Principle: Write code that humans can read and machines can execute.',
          ];
          const note = notes[Math.floor(Math.random() * notes.length)];
          showToast(note);
          break;
        }
        case 'pen_holder': {
          if (soundEnabled) playPenClinkSound();
          showToast('✏️ Stationery Holder: Ready for whiteboard system design');
          break;
        }
        case 'chair': {
          if (soundEnabled) playChairSwivelSound();
          showToast('🪑 Ergonomic Swivel Chair: Smooth 360° workstation rotation');
          break;
        }
        default:
          break;
      }
    },
    [soundEnabled, toggleLamp, openTerminal, showToast, triggerInteraction]
  );

  const currentTheme = SCREEN_THEMES[themeIndex];

  const value = useMemo(
    () => ({
      lampOn,
      toggleLamp,
      setLampState,
      currentTheme,
      themeIndex,
      cycleScreenTheme,
      setThemeById,
      soundEnabled,
      toggleSound,
      toastMessage,
      isTerminalOpen,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      hoveredObject,
      setHoveredObject,
      activeInteraction,
      interactWithObject,
    }),
    [
      lampOn,
      toggleLamp,
      setLampState,
      currentTheme,
      themeIndex,
      cycleScreenTheme,
      setThemeById,
      soundEnabled,
      toggleSound,
      toastMessage,
      isTerminalOpen,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      hoveredObject,
      activeInteraction,
      interactWithObject,
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export default WorkspaceProvider;
