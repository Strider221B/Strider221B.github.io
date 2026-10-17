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
  THEME: 'ubuntu_theme',
  ACCENT_COLOR: 'ubuntu_accent_color',
};

/**
 * Desktop System Themes
 */
export const THEMES = {
  DARK: 'dark',
  DAY: 'day',
};

export const DEFAULT_THEME = THEMES.DARK;

export const THEME_OPTIONS = [
  {
    id: THEMES.DARK,
    name: 'Dark',
    label: 'Dark',
    description: 'Standard Ubuntu dark theme with deep contrast and light typography',
  },
  {
    id: THEMES.DAY,
    name: 'Day',
    label: 'Day',
    description: 'Day theme with clean white backgrounds and dark typography',
  },
];

/**
 * GNOME Ubuntu Desktop Accent Colors
 */
export const ACCENT_COLORS = [
  { id: 'orange', name: 'Ubuntu Orange', color: '#E95420', rgb: '233 84 32' },
  { id: 'bark', name: 'Bark', color: '#787859', rgb: '120 120 89' },
  { id: 'teal', name: 'Teal', color: '#008080', rgb: '0 128 128' },
  { id: 'blue', name: 'Blue', color: '#1E78D6', rgb: '30 120 214' },
  { id: 'purple', name: 'Aubergine', color: '#77216F', rgb: '119 33 111' },
  { id: 'magenta', name: 'Magenta', color: '#B34CB3', rgb: '179 76 179' },
  { id: 'red', name: 'Red', color: '#C01C28', rgb: '192 28 40' },
  { id: 'yellow', name: 'Yellow', color: '#F5C211', rgb: '245 194 17' },
  { id: 'green', name: 'Green', color: '#2EC27E', rgb: '46 194 126' },
  { id: 'slate', name: 'Slate', color: '#5E5C64', rgb: '94 92 100' },
];

export const DEFAULT_ACCENT = 'orange';

/**
 * Default System Asset Paths
 */
export const DEFAULT_WALLPAPER = '/wallpapers/ubuntu-default.webp';
export const WALLPAPERS = [
  {
    id: 'ubuntu-default',
    name: 'Ubuntu Default',
    path: '/wallpapers/ubuntu-default.webp',
    gradient: 'from-[#77216F] via-[#5E2750] to-[#2C001E]',
    cssGradient: 'linear-gradient(135deg, #77216F 0%, #5E2750 50%, #2C001E 100%)',
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset Minimal',
    path: '/wallpapers/warm-sunset.webp',
    gradient: 'from-[#E95420] via-[#A83812] to-[#5E2750]',
    cssGradient: 'linear-gradient(135deg, #E95420 0%, #A83812 50%, #5E2750 100%)',
  },
  {
    id: 'bush-chat',
    name: 'Bush Chat in Rain',
    path: '/wallpapers/Bush Chat1.JPG',
    gradient: 'from-[#4A4E53] via-[#323639] to-[#1E2022]',
    cssGradient: 'linear-gradient(135deg, #4A4E53 0%, #323639 50%, #1E2022 100%)',
  },
  {
    id: 'serene-waters',
    name: 'Serene Waters',
    path: '/wallpapers/DSCN6768_1.JPG',
    gradient: 'from-[#467067] via-[#2F4F4F] to-[#1A2E26]',
    cssGradient: 'linear-gradient(135deg, #467067 0%, #2F4F4F 50%, #1A2E26 100%)',
  },
  {
    id: 'sunset-silhouette',
    name: 'Sunset Silhouette',
    path: '/wallpapers/IMAG0705.jpg',
    gradient: 'from-[#C85A32] via-[#64283C] to-[#1E1428]',
    cssGradient: 'linear-gradient(135deg, #C85A32 0%, #64283C 50%, #1E1428 100%)',
  },
  {
    id: 'ghost-crab',
    name: 'Ghost Crab',
    path: '/wallpapers/IMAG0806.jpg',
    gradient: 'from-[#8B7D7B] via-[#5D5352] to-[#2E2827]',
    cssGradient: 'linear-gradient(135deg, #8B7D7B 0%, #5D5352 50%, #2E2827 100%)',
  },
  {
    id: 'misty-fortress',
    name: 'Misty Fortress',
    path: '/wallpapers/IMAG1418.jpg',
    gradient: 'from-[#3D5245] via-[#2B3A31] to-[#17201B]',
    cssGradient: 'linear-gradient(135deg, #3D5245 0%, #2B3A31 50%, #17201B 100%)',
  },
  {
    id: 'water-drop',
    name: 'Dew Drop',
    path: '/wallpapers/WaterDrop.jpg',
    gradient: 'from-[#4B7330] via-[#2D4A1B] to-[#15240B]',
    cssGradient: 'linear-gradient(135deg, #4B7330 0%, #2D4A1B 50%, #15240B 100%)',
  },
];
export const WALLPAPERS_LIST = WALLPAPERS.map((w) => w.path);

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
  const imgUrl = encodeURI(wp.path || wallpaperPath);

  return {
    backgroundImage: `url("${imgUrl}"), ${cssGradient}`,
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

