/**
 * @file components/Ubuntu.jsx
 * @description Root orchestrator component for the Ubuntu portfolio desktop simulation.
 * Manages top-level system lifecycle states (booting, locked, shut down, desktop)
 * and provides WindowManagerContext to desktop chrome and application windows.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';

// 3. Project contexts and hooks
import { WindowManagerProvider } from '../context/WindowManagerContext';

// 3. Project contexts and hooks
import { useTheme } from '../hooks/useTheme';

// 5. Project utilities, constants, config
import {
  BOOT_SCREEN_DELAY_MS,
  DEFAULT_WALLPAPER,
  STORAGE_KEYS,
} from '../lib/constants';

// ─── DYNAMIC SCREEN IMPORTS ─────────────────────────────────────────

const BootScreen = dynamic(() => import('./screen/BootScreen'), { ssr: false });
const LockScreen = dynamic(() => import('./screen/LockScreen'), { ssr: false });
const Navbar = dynamic(() => import('./screen/Navbar'), { ssr: false });
const Desktop = dynamic(() => import('./screen/Desktop'), { ssr: false });

// ─── HELPER SUB-COMPONENTS ──────────────────────────────────────────

/**
 * Shut down state screen rendering power button to turn the system back on.
 *
 * @param {Object} props
 * @param {Function} props.onTurnOn - Handler called when power button is clicked
 * @returns {JSX.Element} Shut down display
 */
function ShutDownScreen({ onTurnOn }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none">
      <button
        type="button"
        onClick={onTurnOn}
        className="group flex flex-col items-center gap-3 p-6 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
        aria-label="Power On System"
      >
        <div className="w-16 h-16 rounded-full border-2 border-ub-orange flex items-center justify-center text-ub-orange group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A7.92 7.92 0 0 1 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8c0-2.38 1.05-4.52 2.73-5.99L5.31 4.59A9.94 9.94 0 0 0 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-2.94-1.27-5.58-3.17-6.83z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-white/80 group-hover:text-white">
          Power On
        </span>
      </button>
    </div>
  );
}

// ─── ROOT UBUNTU COMPONENT ──────────────────────────────────────────

/**
 * Root orchestrator component managing system screen states and window manager context.
 *
 * @param {Object} props
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Statically built content map
 * @param {string} [props.initialBootApp] - App ID to launch immediately on deep-link boot
 * @param {string} [props.initialBootCategory] - Category for deep-linked article/hub
 * @param {string} [props.initialBootSlug] - Slug for deep-linked article
 * @param {string} [props.initialContent] - Raw markdown content for terminal cat display
 * @param {string} [props.initialTitle] - Title for deep-linked article/hub
 * @param {string} [props.initialCommand] - Initial command to run in terminal
 * @returns {JSX.Element} Top-level Ubuntu environment
 */
export default function Ubuntu({
  contentMap = {},
  initialBootApp,
  initialBootCategory,
  initialBootSlug,
  initialContent,
  initialTitle,
  initialCommand,
  initialHtmlContent,
}) {
  const { isDayTheme } = useTheme();
  // Bypass boot screen delay on deep-links for immediate interactivity
  const [isBooting, setIsBooting] = useState(!initialBootApp);
  const [isLocked, setIsLocked] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_WALLPAPER);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Custom initial WindowManager state when deep-linking to an app (e.g. terminal)
  const customWmState = useMemo(() => {
    if (!initialBootApp) {
      return undefined;
    }
    return {
      openWindows: { [initialBootApp]: true },
      minimizedWindows: {},
      maximizedWindows: {},
      focusedWindows: { [initialBootApp]: true },
      windowStack: [initialBootApp],
      dockApps: {
        'about-me': true,
        terminal: true,
        settings: true,
        [initialBootApp]: true,
      },
    };
  }, [initialBootApp]);

  const terminalBootProps = useMemo(() => ({
    initialCommand,
    initialContent,
    initialBootSlug,
    initialBootCategory,
    initialTitle,
    initialHtmlContent,
  }), [initialCommand, initialContent, initialBootSlug, initialBootCategory, initialTitle, initialHtmlContent]);

  // Restore wallpaper setting and manage initial boot timer
  useEffect(() => {
    try {
      const savedWallpaper = localStorage.getItem(STORAGE_KEYS.WALLPAPER);
      if (savedWallpaper) {
        setBackgroundImage(savedWallpaper);
      }
    } catch {
      // localStorage may fail in restricted/private browser contexts
    }
  }, []);

  // Boot screen timeout handler
  useEffect(() => {
    if (!isBooting) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setIsBooting(false);
      try {
        localStorage.setItem(STORAGE_KEYS.BOOTED, 'true');
      } catch {
        // localStorage may fail in restricted/private browser contexts
      }
    }, BOOT_SCREEN_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isBooting]);

  const handleTurnOn = useCallback(() => {
    setIsShutDown(false);
    setIsBooting(true);
  }, []);

  const handleShutDown = useCallback(() => {
    setIsShutDown(true);
  }, []);

  const handleLock = useCallback(() => {
    setIsLocked(true);
  }, []);

  const handleUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  const handleToggleStartMenu = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  const handleCloseStartMenu = useCallback(() => {
    setIsStartMenuOpen(false);
  }, []);

  const handleChangeWallpaper = useCallback((wallpaperPath) => {
    if (!wallpaperPath) {
      return;
    }
    setBackgroundImage(wallpaperPath);
    try {
      localStorage.setItem(STORAGE_KEYS.WALLPAPER, wallpaperPath);
    } catch {
      // localStorage may fail in restricted/private browser contexts
    }
  }, []);

  if (isShutDown) {
    return <ShutDownScreen onTurnOn={handleTurnOn} />;
  }

  if (isBooting) {
    return (
      <BootScreen
        visible={isBooting}
        onBootComplete={handleBootComplete}
      />
    );
  }

  if (isLocked) {
    return (
      <LockScreen
        isLocked={isLocked}
        onUnlock={handleUnlock}
        backgroundImage={backgroundImage}
      />
    );
  }

  return (
    <WindowManagerProvider initialState={customWmState}>
      <div
        className={`relative w-screen h-screen overflow-hidden select-none ${
          isDayTheme ? 'bg-[#f0f0f0] text-[#2e3436]' : 'bg-ub-grey text-ubt-grey'
        }`}
      >
        <Navbar
          lockScreen={handleLock}
          shutDown={handleShutDown}
          isStartMenuOpen={isStartMenuOpen}
          onToggleStartMenu={handleToggleStartMenu}
        />
        <Desktop
          backgroundImage={backgroundImage}
          changeBackgroundImage={handleChangeWallpaper}
          contentMap={contentMap}
          isStartMenuOpen={isStartMenuOpen}
          onCloseStartMenu={handleCloseStartMenu}
          terminalBootProps={terminalBootProps}
        />
      </div>
    </WindowManagerProvider>
  );
}
