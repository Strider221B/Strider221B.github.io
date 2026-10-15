/**
 * @file lib/constants.js
 * @description Shared constants for the Ubuntu portfolio application, including app types,
 * window manager actions, z-index layering bases, screen states, and storage keys.
 */

/**
 * Application Type Identifiers
 *
 * Defines the operational type of an application or menu item in the system.
 */
export const APP_TYPES = {
  WINDOW: 'window',       // Opens a windowed application
  FOLDER: 'folder',       // Start menu category (contains nested items)
  EXTERNAL: 'external',   // Opens an external URL
};

/**
 * Start Menu Item Types
 *
 * Defines node types in the Start Menu tree hierarchy.
 */
export const MENU_ITEM_TYPES = {
  APP: 'app',             // Application launcher node
  FOLDER: 'folder',       // Category folder with children
  SEPARATOR: 'separator', // Visual separator bar
};

/**
 * Window Manager Reducer Action Types
 *
 * Defines all actions dispatched to WindowManagerContext reducer.
 */
export const WINDOW_ACTIONS = {
  OPEN_APP: 'OPEN_APP',                 // Add to openWindows, push to windowStack, focus
  CLOSE_APP: 'CLOSE_APP',               // Remove from openWindows, remove from stack
  MINIMIZE_APP: 'MINIMIZE_APP',         // Set minimized=true, focus next in stack
  RESTORE_APP: 'RESTORE_APP',           // Set minimized=false, focus
  MAXIMIZE_APP: 'MAXIMIZE_APP',         // Set maximized=true
  UNMAXIMIZE_APP: 'UNMAXIMIZE_APP',     // Set maximized=false
  FOCUS_APP: 'FOCUS_APP',               // Move to top of windowStack, set focused
  ADD_TO_DOCK: 'ADD_TO_DOCK',           // Pin application to sidebar dock
  REMOVE_FROM_DOCK: 'REMOVE_FROM_DOCK', // Unpin application from sidebar dock
};

/**
 * Convenience alias for WINDOW_ACTIONS matching architecture design reference.
 */
export const ACTIONS = WINDOW_ACTIONS;

/**
 * Window Stack and Chrome Z-Index Hierarchy Bases
 *
 * Windows are layered sequentially: Z_INDEX_BASE + stackPosition + 1.
 * Desktop chrome, overlays, and navbar sit above all windows.
 */
export const Z_INDEX_BASE = 20;
export const Z_INDEX_NAVBAR = 50;
export const Z_INDEX_OVERLAY = 60;

/**
 * System Animation and Transition Durations (in milliseconds)
 */
export const ANIMATION_DURATION_MS = 200;
export const BOOT_SCREEN_DELAY_MS = 2000;

/**
 * Top-Level Ubuntu Desktop Screen States
 */
export const SCREEN_STATES = {
  BOOTING: 'booting',
  LOCKED: 'locked',
  DESKTOP: 'desktop',
  SHUT_DOWN: 'shut_down',
};

/**
 * Local Storage Keys for Persistent Settings
 */
export const STORAGE_KEYS = {
  WALLPAPER: 'ubuntu_wallpaper',
  BOOTED: 'ubuntu_booted',
  DOCK_APPS: 'ubuntu_dock_apps',
};

/**
 * Default System Asset Paths
 */
export const DEFAULT_WALLPAPER = '/wallpapers/wall-2.webp';
export const WALLPAPERS_LIST = [
  '/wallpapers/wall-2.webp',
  '/wallpapers/wall-1.webp',
  '/wallpapers/wall-3.webp',
];
export const WALLPAPERS = [
  {
    id: 'wall-2',
    name: 'Ubuntu Jammy (Default)',
    path: '/wallpapers/wall-2.webp',
    gradient: 'from-[#77216F] via-[#5E2750] to-[#2C001E]',
    cssGradient: 'linear-gradient(135deg, #77216F 0%, #5E2750 50%, #2C001E 100%)',
  },
  {
    id: 'wall-1',
    name: 'Aubergine Dark',
    path: '/wallpapers/wall-1.webp',
    gradient: 'from-[#2C001E] via-[#1A0013] to-[#0D000A]',
    cssGradient: 'linear-gradient(135deg, #2C001E 0%, #1A0013 50%, #0D000A 100%)',
  },
  {
    id: 'wall-3',
    name: 'Warm Sunset Minimal',
    path: '/wallpapers/wall-3.webp',
    gradient: 'from-[#E95420] via-[#A83812] to-[#5E2750]',
    cssGradient: 'linear-gradient(135deg, #E95420 0%, #A83812 50%, #5E2750 100%)',
  },
];

/**
 * Helper to get wallpaper styling including image url and corresponding fallback gradient.
 *
 * @param {string} [wallpaperPath=DEFAULT_WALLPAPER] - Wallpaper path or ID
 * @returns {{ backgroundImage: string, backgroundSize: string, backgroundPosition: string }}
 */
export function getWallpaperStyle(wallpaperPath = DEFAULT_WALLPAPER) {
  const wp =
    WALLPAPERS.find((w) => w.path === wallpaperPath || w.id === wallpaperPath) ||
    WALLPAPERS[0];
  const cssGradient =
    wp.cssGradient || 'linear-gradient(135deg, #77216F 0%, #5E2750 50%, #2C001E 100%)';
  const imgUrl = wp.path || wallpaperPath;

  return {
    backgroundImage: `url(${imgUrl}), ${cssGradient}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}
export const YARU_ICONS_BASE_PATH = '/themes/Yaru';

/**
 * Default System User Profile
 */
export const DEFAULT_USER_NAME = 'Somesh Chatterjee';

/**
 * Attribution and External URLs
 */
export const ATTRIBUTION_URL = 'https://github.com/vivek9patel/vivek9patel.github.io';
export const REPO_URL = 'https://github.com/Strider221B/Strider221B.github.io';
export const REPO_BRANCH = 'main';
export const GITHUB_BLOB_BASE_URL = `${REPO_URL}/blob/${REPO_BRANCH}`;

