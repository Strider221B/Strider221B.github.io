/**
 * @file components/screen/SideBar.jsx
 * @description Left application dock (Unity / GNOME Dash) for the Ubuntu desktop.
 * Displays pinned favorites and active application windows with state-driven actions,
 * plus the "Show Applications" launcher button.
 */

// 1. React / Next.js core
import React, { useMemo, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import SideBarApp from '../base/SideBarApp';

// 5. Project utilities, constants, config
import apps, { getAppById } from '../../apps.config';

// ─── HELPER SUB-COMPONENTS ──────────────────────────────────────────

/**
 * 9-dots "Show Applications" grid button positioned at the bottom of the dock.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Whether applications grid is open
 * @param {Function} [props.onClick] - Callback when button is clicked
 */
function AllApplicationsButton({ isOpen = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-11 h-11 p-2 rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange ${
        isOpen ? 'bg-white/20' : 'hover:bg-white/10 active:bg-white/20'
      }`}
      title="Show Applications"
      aria-label="Show Applications"
    >
      <div className="grid grid-cols-3 gap-1 w-5 h-5 pointer-events-none">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={`w-1 h-1 rounded-full ${isOpen ? 'bg-ub-orange' : 'bg-white/80'}`}
          />
        ))}
      </div>
    </button>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders the left Ubuntu application dock panel.
 *
 * @param {Object} props
 * @param {boolean} [props.isAllAppsOpen=false] - Whether application drawer is open
 * @param {Function} [props.toggleAllApps] - Callback to toggle application drawer
 * @returns {JSX.Element} Left dock sidebar component
 */
export default function SideBar({ isAllAppsOpen = false, toggleAllApps }) {
  const {
    dockApps,
    openWindows,
    focusedWindows,
    minimizedWindows,
    openApp,
    focusApp,
    minimizeApp,
    restoreApp,
  } = useWindowManager();

  // Collect all apps that are either pinned in dockApps or currently open
  const visibleDockApps = useMemo(() => {
    return apps.filter((app) => {
      if (app.disabled) {
        return false;
      }
      return Boolean(dockApps[app.id] || openWindows[app.id]);
    });
  }, [dockApps, openWindows]);

  const handleAppClick = useCallback((appId) => {
    if (!openWindows[appId]) {
      openApp(appId);
    } else if (focusedWindows[appId]) {
      minimizeApp(appId);
    } else if (minimizedWindows[appId]) {
      restoreApp(appId);
    } else {
      focusApp(appId);
    }
  }, [openWindows, focusedWindows, minimizedWindows, openApp, minimizeApp, restoreApp, focusApp]);

  return (
    <aside
      className="fixed left-0 top-7 bottom-0 w-14 bg-black/60 backdrop-blur-md flex flex-col justify-between items-center py-2 z-40 select-none border-r border-white/5"
      aria-label="Applications Dock"
    >
      <div className="flex flex-col items-center gap-1 w-full overflow-y-auto no-scrollbar">
        {visibleDockApps.map((app) => (
          <SideBarApp
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            isOpen={Boolean(openWindows[app.id])}
            isFocused={Boolean(focusedWindows[app.id])}
            onClick={() => handleAppClick(app.id)}
          />
        ))}
      </div>

      <div className="w-full flex justify-center pt-1 border-t border-white/10">
        <AllApplicationsButton
          isOpen={isAllAppsOpen}
          onClick={toggleAllApps}
        />
      </div>
    </aside>
  );
}
