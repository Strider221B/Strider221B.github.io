/**
 * @file components/screen/SideBar.jsx
 * @description Left application dock (Unity / GNOME Dash) for the Ubuntu desktop.
 * Displays pinned favorites and active application windows with state-driven actions,
 * plus the "Show Applications" launcher button and hover tooltips.
 */

// 1. React / Next.js core
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import SideBarApp from '../base/SideBarApp';

// 5. Project utilities, constants, config
import apps, { getAppById } from '../../apps.config';

// ─── CONSTANTS ──────────────────────────────────────────────────────

const TOOLTIP_DELAY_MS = 200;

// ─── HELPER SUB-COMPONENTS ──────────────────────────────────────────

/**
 * 9-dots "Show Applications" grid button positioned at the bottom of the dock.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Whether applications grid is open
 * @param {Function} [props.onClick] - Callback when button is clicked
 * @param {Function} [props.onHover] - Hover handler passing element for external tooltip
 * @param {Function} [props.onLeave] - Mouse leave handler to dismiss external tooltip
 */
function AllApplicationsButton({ isOpen = false, onClick, onHover, onLeave }) {
  const buttonRef = useRef(null);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover?.(buttonRef.current)}
      onMouseLeave={onLeave}
      className={`w-11 h-11 p-2 rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange ${
        isOpen ? 'bg-white/20' : 'hover:bg-white/10 active:bg-white/20'
      }`}
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

  const [hoveredApp, setHoveredApp] = useState(null);
  const tooltipTimerRef = useRef(null);
  const asideRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  // Collect all apps that are either pinned in dockApps or currently open
  const visibleDockApps = useMemo(() => {
    const list = apps.filter((app) => {
      if (app.disabled) {
        return false;
      }
      return Boolean(dockApps[app.id] || openWindows[app.id]);
    });

    // Also include open dynamic article windows in the dock
    Object.keys(openWindows).forEach((appId) => {
      if (openWindows[appId] && !apps.some((app) => app.id === appId)) {
        list.push({
          id: appId,
          title: 'Article',
          icon: '/themes/Yaru/apps/reader.png',
        });
      }
    });

    return list;
  }, [dockApps, openWindows]);

  const handleAppMouseEnter = useCallback((app, element) => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
    tooltipTimerRef.current = setTimeout(() => {
      if (element && asideRef.current) {
        const asideRect = asideRef.current.getBoundingClientRect();
        const iconRect = element.getBoundingClientRect();
        setHoveredApp({
          id: app.id,
          title: app.title,
          top: iconRect.top - asideRect.top + iconRect.height / 2,
        });
      }
    }, TOOLTIP_DELAY_MS);
  }, []);

  const handleAppMouseLeave = useCallback(() => {
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
    setHoveredApp(null);
  }, []);

  const handleAppClick = useCallback((appId) => {
    handleAppMouseLeave();
    if (!openWindows[appId]) {
      openApp(appId);
    } else if (focusedWindows[appId]) {
      minimizeApp(appId);
    } else if (minimizedWindows[appId]) {
      restoreApp(appId);
    } else {
      focusApp(appId);
    }
  }, [openWindows, focusedWindows, minimizedWindows, openApp, minimizeApp, restoreApp, focusApp, handleAppMouseLeave]);

  return (
    <aside
      ref={asideRef}
      className="fixed left-0 top-7 bottom-0 w-14 bg-black/60 backdrop-blur-md flex flex-col justify-between items-center py-2 z-40 select-none border-r border-white/5"
      aria-label="Applications Dock"
    >
      <div className="flex flex-col items-center gap-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar">
        {visibleDockApps.map((app) => (
          <SideBarApp
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            isOpen={Boolean(openWindows[app.id])}
            isFocused={Boolean(focusedWindows[app.id])}
            onClick={() => handleAppClick(app.id)}
            onHover={(element) => handleAppMouseEnter(app, element)}
            onLeave={handleAppMouseLeave}
          />
        ))}
      </div>

      <div className="w-full flex justify-center pt-1 border-t border-white/10">
        <AllApplicationsButton
          isOpen={isAllAppsOpen}
          onClick={(e) => {
            handleAppMouseLeave();
            toggleAllApps?.(e);
          }}
          onHover={(element) =>
            handleAppMouseEnter({ id: 'all-apps', title: 'Show Applications' }, element)
          }
          onLeave={handleAppMouseLeave}
        />
      </div>

      {hoveredApp && (
        <div
          id={`tooltip-${hoveredApp.id}`}
          role="tooltip"
          style={{ top: `${hoveredApp.top}px` }}
          className="absolute left-16 -translate-y-1/2 px-2.5 py-1 bg-ub-grey/95 text-white text-xs font-medium rounded shadow-xl whitespace-nowrap pointer-events-none z-50 border border-white/10"
        >
          <span
            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-ub-grey rotate-45 border-l border-b border-white/10"
            aria-hidden="true"
          />
          {hoveredApp.title}
        </div>
      )}
    </aside>
  );
}
