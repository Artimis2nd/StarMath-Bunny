import { useState, useEffect, useCallback } from 'react';
import { DisplayModeSetting, EffectiveDisplayMode } from '../types/game';

const STORAGE_KEY = 'starmath_display_mode';

export function useDisplayMode() {
  const [displayModeSetting, setDisplayModeSettingState] = useState<DisplayModeSetting>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'PC' || saved === 'MOBILE' || saved === 'AUTO') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'AUTO';
  });

  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isWideScreen = windowDimensions.width >= 768;
  const isLandscape = windowDimensions.width > windowDimensions.height;

  // Compute effective mode
  const effectiveMode: EffectiveDisplayMode =
    displayModeSetting === 'PC'
      ? 'PC'
      : displayModeSetting === 'MOBILE'
      ? 'MOBILE'
      : isLandscape && isWideScreen
      ? 'PC'
      : 'MOBILE';

  const setDisplayModeSetting = useCallback((mode: DisplayModeSetting) => {
    setDisplayModeSettingState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  const cycleDisplayMode = useCallback(() => {
    setDisplayModeSettingState((curr) => {
      let next: DisplayModeSetting;
      if (curr === 'AUTO') next = 'MOBILE';
      else if (curr === 'MOBILE') next = 'PC';
      else next = 'AUTO';

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return {
    displayModeSetting,
    effectiveMode,
    setDisplayModeSetting,
    cycleDisplayMode,
    windowDimensions,
    isLandscape,
    isWideScreen,
  };
}
