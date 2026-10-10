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
export const YARU_ICONS_BASE_PATH = '/themes/Yaru';

/**
 * Attribution and External URLs
 */
export const ATTRIBUTION_URL = 'https://github.com/vivek9patel/vivek9patel.github.io';
export const REPO_URL = 'https://github.com/Strider221B/Strider221B.github.io';
