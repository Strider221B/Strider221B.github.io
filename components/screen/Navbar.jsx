/**
 * @file components/screen/Navbar.jsx
 * @description Top status bar for the Ubuntu desktop simulation.
 * Displays "Activities" launcher trigger, focused application title, real-time clock,
 * and system status indicators with power management dropdown menu.
 */

// 1. React / Next.js core
import React, { useState, useCallback, useMemo } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import Clock from '../util/Clock';
import StatusIcons from '../util/StatusIcons';
import StatusCard from '../util/StatusCard';

// 5. Project utilities, constants, config
import { getAppById } from '../../apps.config';

// 2. Constants
const ACTIVITIES_LABEL = 'Activities';

// 3. Component function definition
/**
 * Renders the top Ubuntu status bar (GNOME panel).
 *
 * @param {Object} props
 * @param {Function} props.lockScreen - Callback to lock desktop
 * @param {Function} props.shutDown - Callback to power off system
 * @returns {JSX.Element} Top status bar component
 */
export default function Navbar({
  lockScreen,
  shutDown,
  isStartMenuOpen = false,
  onToggleStartMenu,
}) {
  const { focusedWindows } = useWindowManager();
  const [isStatusCardOpen, setIsStatusCardOpen] = useState(false);

  // Determine active/focused application title to display beside Activities
  const focusedAppTitle = useMemo(() => {
    const focusedAppId = Object.keys(focusedWindows).find((id) => focusedWindows[id]);
    if (!focusedAppId) {
      return null;
    }
    const appConfig = getAppById(focusedAppId);
    return appConfig?.title || null;
  }, [focusedWindows]);

  const handleToggleStatusCard = useCallback(() => {
    setIsStatusCardOpen((prev) => !prev);
  }, []);

  const handleCloseStatusCard = useCallback(() => {
    setIsStatusCardOpen(false);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-7 bg-ub-grey text-white text-xs flex items-center justify-between px-3 z-50 select-none shadow-sm"
      aria-label="Desktop Top Panel"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleStartMenu}
          className={`px-2 py-0.5 rounded transition-colors font-medium focus:outline-none focus:ring-1 focus:ring-ub-orange cursor-pointer ${
            isStartMenuOpen ? 'bg-white/20' : 'hover:bg-white/10 active:bg-white/20'
          }`}
          aria-label="Activities Overview"
          aria-expanded={isStartMenuOpen}
        >
          {ACTIVITIES_LABEL}
        </button>
        {focusedAppTitle && (
          <span className="font-medium text-white/90 px-2 py-0.5 border-l border-white/20 truncate max-w-xs">
            {focusedAppTitle}
          </span>
        )}
      </div>

      <div className="flex items-center justify-center">
        <Clock />
      </div>

      <div className="relative flex items-center">
        <StatusIcons
          isOpen={isStatusCardOpen}
          onToggle={handleToggleStatusCard}
        />
        {isStatusCardOpen && (
          <StatusCard
            lockScreen={lockScreen}
            shutDown={shutDown}
            onClose={handleCloseStatusCard}
          />
        )}
      </div>
    </header>
  );
}
