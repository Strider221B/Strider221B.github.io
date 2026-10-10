/**
 * @file hooks/useWindowManager.js
 * @description Custom hook exposing window management operations and state queries,
 * including window lifecycle (open, close, minimize, maximize, restore, focus),
 * dock pinning, and dynamic z-index calculation.
 */

// 1. React / Next.js core
import { useContext, useCallback } from 'react';

// 3. Project contexts and hooks
import { WindowManagerContext } from '../context/WindowManagerContext';

// 5. Project utilities, constants, config
import { WINDOW_ACTIONS, Z_INDEX_BASE } from '../lib/constants';
import { getAppById, APP_TYPES } from '../apps.config';

/**
 * Hook to access and interact with the WindowManager context.
 *
 * @throws {Error} If called outside of a WindowManagerProvider
 * @returns {Object} Window management state and handler methods
 */
export function useWindowManager() {
  const context = useContext(WindowManagerContext);

  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }

  const { state, dispatch } = context;

  /**
   * Open an application window or launch an external application.
   * If the window is already open but minimized, it restores and focuses it.
   */
  const openApp = useCallback((appId) => {
    if (!appId) {
      return;
    }

    const appConfig = getAppById(appId);
    if (appConfig?.disabled) {
      return;
    }

    if (appConfig?.type === APP_TYPES.EXTERNAL && appConfig.url) {
      if (typeof window !== 'undefined') {
        window.open(appConfig.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    dispatch({ type: WINDOW_ACTIONS.OPEN_APP, payload: appId });
  }, [dispatch]);

  /**
   * Close an open application window and transfer focus.
   */
  const closeApp = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.CLOSE_APP, payload: appId });
  }, [dispatch]);

  /**
   * Minimize an application window and focus the next topmost window.
   */
  const minimizeApp = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.MINIMIZE_APP, payload: appId });
  }, [dispatch]);

  /**
   * Restore a minimized window and bring it into focus.
   */
  const restoreApp = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.RESTORE_APP, payload: appId });
  }, [dispatch]);

  /**
   * Maximize an application window to fill the desktop workspace.
   */
  const maximizeApp = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.MAXIMIZE_APP, payload: appId });
  }, [dispatch]);

  /**
   * Restore a maximized window to its previous non-maximized bounds.
   */
  const unmaximizeApp = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.UNMAXIMIZE_APP, payload: appId });
  }, [dispatch]);

  /**
   * Toggle between maximized and un-maximized window states.
   */
  const toggleMaximize = useCallback((appId) => {
    if (!appId) {
      return;
    }
    const isCurrentlyMaximized = Boolean(state.maximizedWindows[appId]);
    const actionType = isCurrentlyMaximized
      ? WINDOW_ACTIONS.UNMAXIMIZE_APP
      : WINDOW_ACTIONS.MAXIMIZE_APP;

    dispatch({ type: actionType, payload: appId });
  }, [dispatch, state.maximizedWindows]);

  /**
   * Bring a window to the top of the stack and give it input focus.
   */
  const focusApp = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.FOCUS_APP, payload: appId });
  }, [dispatch]);

  /**
   * Pin an application to the sidebar dock.
   */
  const addToDock = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.ADD_TO_DOCK, payload: appId });
  }, [dispatch]);

  /**
   * Unpin an application from the sidebar dock.
   */
  const removeFromDock = useCallback((appId) => {
    if (!appId) {
      return;
    }
    dispatch({ type: WINDOW_ACTIONS.REMOVE_FROM_DOCK, payload: appId });
  }, [dispatch]);

  /**
   * Query whether an application window is currently open in the DOM.
   */
  const isOpen = useCallback((appId) => {
    return Boolean(state.openWindows[appId]);
  }, [state.openWindows]);

  /**
   * Query whether an application window is currently minimized.
   */
  const isMinimized = useCallback((appId) => {
    return Boolean(state.minimizedWindows[appId]);
  }, [state.minimizedWindows]);

  /**
   * Query whether an application window is currently maximized.
   */
  const isMaximized = useCallback((appId) => {
    return Boolean(state.maximizedWindows[appId]);
  }, [state.maximizedWindows]);

  /**
   * Query whether an application window currently has focus.
   */
  const isFocused = useCallback((appId) => {
    return Boolean(state.focusedWindows[appId]);
  }, [state.focusedWindows]);

  /**
   * Query whether an application icon is currently visible in the sidebar dock.
   */
  const isInDock = useCallback((appId) => {
    return Boolean(state.dockApps[appId]);
  }, [state.dockApps]);

  /**
   * Calculate CSS z-index for an application window based on stack position.
   * Windows higher in the stack receive higher z-index values.
   */
  const getZIndex = useCallback((appId) => {
    const index = state.windowStack.indexOf(appId);
    if (index === -1) {
      return Z_INDEX_BASE;
    }
    return Z_INDEX_BASE + index + 1;
  }, [state.windowStack]);

  return {
    // Raw state slices
    openWindows: state.openWindows,
    minimizedWindows: state.minimizedWindows,
    maximizedWindows: state.maximizedWindows,
    focusedWindows: state.focusedWindows,
    windowStack: state.windowStack,
    dockApps: state.dockApps,
    state,
    dispatch,

    // Operations
    openApp,
    closeApp,
    minimizeApp,
    restoreApp,
    maximizeApp,
    unmaximizeApp,
    toggleMaximize,
    focusApp,
    addToDock,
    removeFromDock,

    // Query helpers
    isOpen,
    isMinimized,
    isMaximized,
    isFocused,
    isInDock,
    getZIndex,
  };
}

export default useWindowManager;
