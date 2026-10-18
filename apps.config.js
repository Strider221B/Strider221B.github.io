/**
 * @file apps.config.js
 * @description Central application registry and Start Menu tree configuration for the Ubuntu desktop.
 * Single source of truth for launchable apps, desktop shortcuts, dock favourites, and menu hierarchy.
 */

import { APP_TYPES } from './lib/constants.js';

// Re-export APP_TYPES so consumers importing from apps.config have direct access
export { APP_TYPES };

// ─── APP REGISTRY ───────────────────────────────────────────────────
// Each app object defines a launchable application.
// The `component` field is a string key that maps to a component
// in the component registry (see lib/componentRegistry.js).

const apps = [
  // ── Core System Apps ──────────────────────────────────────────
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '/themes/Yaru/apps/bash.png',
    type: APP_TYPES.WINDOW,
    component: 'Terminal',
    favourite: true,
    desktop_shortcut: true,
    desktop_order: 2,
    disabled: false,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '/themes/Yaru/apps/gnome-control-center.png',
    type: APP_TYPES.WINDOW,
    component: 'Settings',
    favourite: true,
    desktop_shortcut: false,
    disabled: false,
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: '/themes/Yaru/system/user-trash-full.png',
    type: APP_TYPES.WINDOW,
    component: 'Trash',
    favourite: false,
    desktop_shortcut: true,
    desktop_order: 3,
    disabled: false,
  },

  {
    id: 'reader',
    title: 'Markdown Reader',
    icon: '/themes/Yaru/apps/gedit.png',
    type: APP_TYPES.WINDOW,
    component: 'MarkdownViewer',
    componentProps: { contentPath: 'about-me' },
    favourite: false,
    desktop_shortcut: false,
    desktop_order: 4,
    disabled: false,
  },
  {
    id: 'about-me',
    title: 'About Me',
    icon: '/themes/Yaru/system/user-home.png',
    type: APP_TYPES.WINDOW,
    component: 'MarkdownViewer',
    componentProps: { contentPath: 'about-me' },
    favourite: true,
    desktop_shortcut: true,
    desktop_order: 1,
    disabled: false,
  },
  {
    id: 'data-science',
    title: 'Data Science',
    icon: '/themes/Yaru/apps/accessories-calculator.png',
    type: APP_TYPES.WINDOW,
    component: 'BlogListApp',
    componentProps: { category: 'data-science' },
    favourite: false,
    desktop_shortcut: false,
    disabled: false,
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    icon: '/themes/Yaru/apps/accessories-calculator.png',
    type: APP_TYPES.WINDOW,
    component: 'BlogListApp',
    componentProps: { category: 'machine-learning' },
    favourite: false,
    desktop_shortcut: false,
    disabled: false,
  },
  {
    id: 'programming',
    title: 'Programming',
    icon: '/themes/Yaru/apps/vscode.png',
    type: APP_TYPES.WINDOW,
    component: 'BlogListApp',
    componentProps: { category: 'programming' },
    favourite: false,
    desktop_shortcut: false,
    disabled: false,
  },
  {
    id: 'psychology',
    title: 'Psychology',
    icon: '/themes/Yaru/apps/gedit.png',
    type: APP_TYPES.WINDOW,
    component: 'BlogListApp',
    componentProps: { category: 'psychology' },
    favourite: false,
    desktop_shortcut: false,
    disabled: false,
  },
];

// ─── START MENU HIERARCHY ───────────────────────────────────────────
// Defines the nested menu structure. Each node is either:
//   - { appId: 'xxx' }              → links to an app from the registry
//   - { label, icon, children: [] } → folder containing sub-items
//   - { type: 'separator' }         → visual separator rule
//
// To add a new menu item: append to the appropriate `children` array.
// To add a new submenu:   add a new folder node with its own `children`.

export const startMenuTree = [
  { appId: 'about-me' },
  { appId: 'reader' },
  {
    label: 'Technology',
    icon: '/themes/Yaru/apps/folder.png',
    children: [
      { appId: 'data-science' },
      { appId: 'machine-learning' },
      { appId: 'programming' },
    ],
  },
  { appId: 'psychology' },
  { type: 'separator' },
  { appId: 'terminal' },
  { appId: 'settings' },
  { appId: 'trash' },
];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────

/**
 * Look up an app configuration object by its unique identifier.
 *
 * @param {string} id - Unique identifier for the app (e.g., 'terminal')
 * @returns {Object|null} The app configuration object or null if not found
 */
export function getAppById(id) {
  return apps.find((app) => app.id === id) || null;
}

/**
 * Get all applications configured as desktop shortcuts that are not disabled.
 *
 * @returns {Array<Object>} List of enabled desktop shortcut app configurations
 */
export function getDesktopApps() {
  return apps
    .filter((app) => app.desktop_shortcut && !app.disabled)
    .sort((a, b) => (a.desktop_order ?? Infinity) - (b.desktop_order ?? Infinity));
}

/**
 * Get all applications configured as dock favourites that are not disabled.
 *
 * @returns {Array<Object>} List of enabled dock favourite app configurations
 */
export function getFavouriteApps() {
  return apps.filter((app) => app.favourite && !app.disabled);
}

export default apps;
