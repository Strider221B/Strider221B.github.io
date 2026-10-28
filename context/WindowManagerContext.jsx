/**
 * @file context/WindowManagerContext.jsx
 * @description React Context and reducer provider for managing desktop window state,
 * including open windows, minimize/maximize flags, focus hierarchy, z-index ordering stack,
 * and sidebar dock items.
 */

// 1. React / Next.js core
import React, { createContext, useReducer, useMemo } from 'react';

// 5. Project utilities, constants, config
import { WINDOW_ACTIONS } from '../lib/constants';
import { getAppById, getFavouriteApps } from '../apps.config';

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────

/**
 * Build initial dock apps map from favourite applications configured in apps.config.
 *
 * @returns {Record<string, boolean>} Map of appId to visibility flag in the dock
 */
const getDefaultDockApps = () => {
  return getFavouriteApps().reduce((acc, app) => {
    acc[app.id] = true;
    return acc;
  }, {});
};

/**
 * Filter and push target appId to the end of the window stack (topmost z-index).
 *
 * @param {string[]} stack - Current window stack array
 * @param {string} appId - Target app identifier
 * @returns {string[]} New window stack with target app at the top
 */
const bringToTop = (stack, appId) => {
  const filtered = stack.filter((id) => id !== appId);
  return [...filtered, appId];
};

/**
 * Remove target appId from the window stack.
 *
 * @param {string[]} stack - Current window stack array
 * @param {string} appId - Target app identifier
 * @returns {string[]} New window stack without the target app
 */
const removeFromStack = (stack, appId) => {
  return stack.filter((id) => id !== appId);
};

/**
 * Generate a focused map with only the specified app set to true.
 *
 * @param {string|null} focusedId - App ID to focus, or null for no focus
 * @returns {Record<string, boolean>} Focused windows mapping
 */
const createFocusedMap = (focusedId) => {
  if (!focusedId) {
    return {};
  }
  return { [focusedId]: true };
};

/**
 * Find the next topmost open, non-minimized window in the stack.
 *
 * @param {string[]} stack - Window stack array
 * @param {Record<string, boolean>} openWindows - Map of open windows
 * @param {Record<string, boolean>} minimizedWindows - Map of minimized windows
 * @param {string|null} [excludeId=null] - App ID to exclude from consideration
 * @returns {string|null} Next focused appId, or null if no qualifying window
 */
const findNextFocusedApp = (stack, openWindows, minimizedWindows, excludeId = null) => {
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const id = stack[i];
    if (id !== excludeId && openWindows[id] && !minimizedWindows[id]) {
      return id;
    }
  }
  return null;
};

/**
 * Handle opening or activating an application window.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to open
 * @returns {Object} Updated window manager state
 */
const handleOpenApp = (state, appId) => {
  if (!appId) {
    return state;
  }
  return {
    ...state,
    openWindows: { ...state.openWindows, [appId]: true },
    minimizedWindows: { ...state.minimizedWindows, [appId]: false },
    maximizedWindows: { ...state.maximizedWindows, [appId]: true },
    windowStack: bringToTop(state.windowStack, appId),
    focusedWindows: createFocusedMap(appId),
    dockApps: { ...state.dockApps, [appId]: true },
  };
};

/**
 * Handle closing a window and shifting focus to the next topmost window.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to close
 * @returns {Object} Updated window manager state
 */
const handleCloseApp = (state, appId) => {
  if (!appId || !state.openWindows[appId]) {
    return state;
  }
  const newStack = removeFromStack(state.windowStack, appId);
  const newOpenWindows = { ...state.openWindows, [appId]: false };
  const newMinimizedWindows = { ...state.minimizedWindows, [appId]: false };
  const newMaximizedWindows = { ...state.maximizedWindows, [appId]: false };

  let newFocusedWindows = state.focusedWindows;
  if (state.focusedWindows[appId]) {
    const nextFocusedId = findNextFocusedApp(newStack, newOpenWindows, newMinimizedWindows);
    newFocusedWindows = createFocusedMap(nextFocusedId);
  }

  const appConfig = getAppById(appId);
  const isFavourite = Boolean(appConfig?.favourite);
  const newDockApps = isFavourite
    ? state.dockApps
    : { ...state.dockApps, [appId]: false };

  return {
    ...state,
    openWindows: newOpenWindows,
    minimizedWindows: newMinimizedWindows,
    maximizedWindows: newMaximizedWindows,
    windowStack: newStack,
    focusedWindows: newFocusedWindows,
    dockApps: newDockApps,
  };
};

/**
 * Handle minimizing an application window and transferring focus to the next window.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to minimize
 * @returns {Object} Updated window manager state
 */
const handleMinimizeApp = (state, appId) => {
  if (!appId || !state.openWindows[appId]) {
    return state;
  }
  const newMinimizedWindows = { ...state.minimizedWindows, [appId]: true };
  const nextFocusedId = findNextFocusedApp(
    state.windowStack,
    state.openWindows,
    newMinimizedWindows,
    appId
  );

  return {
    ...state,
    minimizedWindows: newMinimizedWindows,
    focusedWindows: createFocusedMap(nextFocusedId),
  };
};

/**
 * Handle restoring a minimized application window and focusing it.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to restore
 * @returns {Object} Updated window manager state
 */
const handleRestoreApp = (state, appId) => {
  if (!appId || !state.openWindows[appId]) {
    return state;
  }
  return {
    ...state,
    minimizedWindows: { ...state.minimizedWindows, [appId]: false },
    windowStack: bringToTop(state.windowStack, appId),
    focusedWindows: createFocusedMap(appId),
  };
};

/**
 * Handle maximizing an application window to fill the desktop viewport.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to maximize
 * @returns {Object} Updated window manager state
 */
const handleMaximizeApp = (state, appId) => {
  if (!appId || !state.openWindows[appId]) {
    return state;
  }
  return {
    ...state,
    maximizedWindows: { ...state.maximizedWindows, [appId]: true },
    windowStack: bringToTop(state.windowStack, appId),
    focusedWindows: createFocusedMap(appId),
  };
};

/**
 * Handle un-maximizing an application window to its previous dimensions.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to unmaximize
 * @returns {Object} Updated window manager state
 */
const handleUnmaximizeApp = (state, appId) => {
  if (!appId || !state.openWindows[appId]) {
    return state;
  }
  return {
    ...state,
    maximizedWindows: { ...state.maximizedWindows, [appId]: false },
    windowStack: bringToTop(state.windowStack, appId),
    focusedWindows: createFocusedMap(appId),
  };
};

/**
 * Handle focusing an application window and reordering the window stack.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to focus
 * @returns {Object} Updated window manager state
 */
const handleFocusApp = (state, appId) => {
  if (!appId || !state.openWindows[appId]) {
    return state;
  }
  return {
    ...state,
    minimizedWindows: { ...state.minimizedWindows, [appId]: false },
    windowStack: bringToTop(state.windowStack, appId),
    focusedWindows: createFocusedMap(appId),
  };
};

/**
 * Handle pinning an application to the sidebar dock.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to pin
 * @returns {Object} Updated window manager state
 */
const handleAddToDock = (state, appId) => {
  if (!appId) {
    return state;
  }
  return {
    ...state,
    dockApps: { ...state.dockApps, [appId]: true },
  };
};

/**
 * Handle unpinning an application from the sidebar dock.
 *
 * @param {Object} state - Current window manager state
 * @param {string} appId - App ID to unpin
 * @returns {Object} Updated window manager state
 */
const handleRemoveFromDock = (state, appId) => {
  if (!appId) {
    return state;
  }
  return {
    ...state,
    dockApps: { ...state.dockApps, [appId]: false },
  };
};

// ─── INITIAL STATE ───────────────────────────────────────────────────

/**
 * Default initial window manager state.
 * Opens "about-me" by default and initializes dock items from favourite apps.
 */
export const INITIAL_STATE = {
  openWindows: { 'about-me': true },
  minimizedWindows: {},
  maximizedWindows: { 'about-me': true },
  focusedWindows: { 'about-me': true },
  windowStack: ['about-me'],
  dockApps: getDefaultDockApps(),
};

// ─── REDUCER ─────────────────────────────────────────────────────────

/**
 * Reducer function for desktop window management state transitions.
 *
 * @param {Object} state - Current window manager state
 * @param {Object} action - Dispatched action with type and payload
 * @param {string} action.type - Action type identifier from WINDOW_ACTIONS
 * @param {string} action.payload - App identifier for the action
 * @returns {Object} Updated state
 */
export function windowManagerReducer(state, action) {
  switch (action.type) {
    case WINDOW_ACTIONS.OPEN_APP:
      return handleOpenApp(state, action.payload);

    case WINDOW_ACTIONS.CLOSE_APP:
      return handleCloseApp(state, action.payload);

    case WINDOW_ACTIONS.MINIMIZE_APP:
      return handleMinimizeApp(state, action.payload);

    case WINDOW_ACTIONS.RESTORE_APP:
      return handleRestoreApp(state, action.payload);

    case WINDOW_ACTIONS.MAXIMIZE_APP:
      return handleMaximizeApp(state, action.payload);

    case WINDOW_ACTIONS.UNMAXIMIZE_APP:
      return handleUnmaximizeApp(state, action.payload);

    case WINDOW_ACTIONS.FOCUS_APP:
      return handleFocusApp(state, action.payload);

    case WINDOW_ACTIONS.ADD_TO_DOCK:
      return handleAddToDock(state, action.payload);

    case WINDOW_ACTIONS.REMOVE_FROM_DOCK:
      return handleRemoveFromDock(state, action.payload);

    default:
      return state;
  }
}

// ─── CONTEXT DEFINITION ──────────────────────────────────────────────

export const WindowManagerContext = createContext(null);

// ─── PROVIDER COMPONENT ──────────────────────────────────────────────

/**
 * Provides window management state and dispatch to the Ubuntu desktop component tree.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that consume window manager context
 * @param {Object} [props.initialState] - Optional custom initial state for testing or hydration
 * @returns {JSX.Element} Context provider wrapping children
 */
export function WindowManagerProvider({ children, initialState = INITIAL_STATE }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialState);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
  }), [state, dispatch]);

  return (
    <WindowManagerContext.Provider value={contextValue}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export default WindowManagerProvider;
