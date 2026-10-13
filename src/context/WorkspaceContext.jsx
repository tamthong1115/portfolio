import { useState, useCallback, useMemo, useRef } from 'react';
import { playLampClickSound, playTerminalChirp } from '../utils/soundEffects';
import { SCREEN_THEMES } from '../data/screenThemes';
import { WorkspaceContext } from './WorkspaceContextInstance';

export function WorkspaceProvider({ children }) {
  const [lampOn, setLampOn] = useState(true);
  const [themeIndex, setThemeIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

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

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      showToast(next ? '🔊 Audio FX: Enabled' : '🔇 Audio FX: Muted');
      return next;
    });
  }, [showToast]);

  const currentTheme = SCREEN_THEMES[themeIndex];

  const value = useMemo(
    () => ({
      lampOn,
      toggleLamp,
      currentTheme,
      themeIndex,
      cycleScreenTheme,
      soundEnabled,
      toggleSound,
      toastMessage,
    }),
    [lampOn, toggleLamp, currentTheme, themeIndex, cycleScreenTheme, soundEnabled, toggleSound, toastMessage]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export default WorkspaceProvider;
