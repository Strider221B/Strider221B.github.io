/**
 * @file hooks/useTheme.js
 * @description Custom hook exposing theme mode (Dark vs Day/Light) and accent color
 * state and control actions.
 */

// 1. React / Next.js core
import { useContext } from 'react';

// 3. Project contexts and hooks
import { ThemeContext } from '../context/ThemeContext';

/**
 * Access the active desktop theme and accent color state.
 *
 * @throws {Error} If called outside of a ThemeProvider
 * @returns {Object} Theme state values and updater callbacks
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default useTheme;
