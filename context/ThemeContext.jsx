/**
 * @file context/ThemeContext.jsx
 * @description React Context and provider managing desktop visual style themes
 * (Dark vs Day/Light) and GNOME accent color customization.
 */

// 1. React / Next.js core
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

// 5. Project utilities, constants, config
import {
  THEMES,
  DEFAULT_THEME,
  ACCENT_COLORS,
  DEFAULT_ACCENT,
  STORAGE_KEYS,
} from '../lib/constants';

/**
 * Context for desktop theme mode and accent color state.
 */
export const ThemeContext = createContext(null);

/**
 * Helper to look up accent definition by identifier.
 *
 * @param {string} accentId - Accent color identifier
 * @returns {Object} Accent definition object
 */
const resolveAccent = (accentId) => {
  return ACCENT_COLORS.find((a) => a.id === accentId) || ACCENT_COLORS[0];
};

/**
 * Applies CSS custom properties for accent color and data-theme attribute on root element.
 *
 * @param {string} theme - Active theme identifier
 * @param {Object} accent - Active accent definition object
 */
const applyThemeToDocument = (theme, accent) => {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.setProperty('--color-ub-accent', accent.color);
  root.style.setProperty('--color-ub-accent-rgb', accent.rgb);
};

/**
 * ThemeProvider component managing theme mode and accent colors across the desktop.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child subtree
 * @returns {JSX.Element} ThemeContext provider element
 */
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [nightLight, setNightLightState] = useState(false);

  // Synchronize persisted preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme && (savedTheme === THEMES.DARK || savedTheme === THEMES.DAY)) {
        setThemeState(savedTheme);
      }
      const savedAccent = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR);
      if (savedAccent && ACCENT_COLORS.some((a) => a.id === savedAccent)) {
        setAccentColorState(savedAccent);
      }
      const savedNightLight = localStorage.getItem(STORAGE_KEYS.NIGHT_LIGHT);
      if (savedNightLight !== null) {
        setNightLightState(savedNightLight === 'true');
      }
    } catch {
      // LocalStorage error handling for sandboxed environments
    }
  }, []);

  const currentAccent = useMemo(() => resolveAccent(accentColor), [accentColor]);

  // Apply root document CSS variables whenever theme or accent changes
  useEffect(() => {
    applyThemeToDocument(theme, currentAccent);
  }, [theme, currentAccent]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch {
      // LocalStorage error handling for sandboxed environments
    }
  }, []);

  const setAccentColor = useCallback((newAccentId) => {
    setAccentColorState(newAccentId);
    try {
      localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, newAccentId);
    } catch {
      // LocalStorage error handling for sandboxed environments
    }
  }, []);

  const setNightLight = useCallback((enabled) => {
    setNightLightState(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.NIGHT_LIGHT, String(enabled));
    } catch {
      // LocalStorage error handling for sandboxed environments
    }
  }, []);

  const toggleNightLight = useCallback(() => {
    setNightLightState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.NIGHT_LIGHT, String(next));
      } catch {
        // LocalStorage error handling for sandboxed environments
      }
      return next;
    });
  }, []);

  const isDayTheme = theme === THEMES.DAY;

  const value = useMemo(
    () => ({
      theme,
      isDayTheme,
      setTheme,
      accentColor,
      setAccentColor,
      currentAccent,
      nightLight,
      setNightLight,
      toggleNightLight,
    }),
    [
      theme,
      isDayTheme,
      setTheme,
      accentColor,
      setAccentColor,
      currentAccent,
      nightLight,
      setNightLight,
      toggleNightLight,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
