/**
 * @file components/base/StartMenuItem.jsx
 * @description Recursive item renderer for the hierarchical Start Menu tree,
 * supporting leaf application nodes, nested folder submenus, and visual separators.
 */

// 1. React / Next.js core
import React, { useState, useRef, useEffect, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 5. Project utilities, constants, config
import { getAppById } from '../../apps.config';

// 2. Constants
const HOVER_CLOSE_DELAY_MS = 150;

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────

/**
 * Render folder icon with fallback SVG.
 *
 * @param {Object} props
 * @param {string} [props.icon] - Image path
 * @param {boolean} props.hasError - Whether image failed to load
 * @param {Function} props.onError - Error callback
 * @returns {JSX.Element}
 */
function FolderIcon({ icon, hasError, onError }) {
  if (icon && !hasError) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="w-4 h-4 object-contain mr-2.5 flex-shrink-0"
        onError={onError}
      />
    );
  }
  return (
    <svg
      className="w-4 h-4 text-ub-orange mr-2.5 flex-shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

/**
 * Render leaf application icon with fallback initial letter avatar.
 *
 * @param {Object} props
 * @param {string} [props.icon] - Icon path
 * @param {string} props.title - App title
 * @param {boolean} props.hasError - Whether image failed to load
 * @param {Function} props.onError - Error callback
 * @returns {JSX.Element}
 */
function AppIcon({ icon, title, hasError, onError }) {
  if (icon && !hasError) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="w-4 h-4 object-contain mr-2.5 flex-shrink-0"
        onError={onError}
      />
    );
  }
  const initial = (title || '?').charAt(0).toUpperCase();
  return (
    <div
      className="w-4 h-4 rounded bg-gradient-to-br from-ub-orange to-ub-med-abrgn flex items-center justify-center text-white text-[9px] font-bold mr-2.5 flex-shrink-0"
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders a single row or recursive folder in the Start Menu hierarchy.
 *
 * @param {Object} props
 * @param {Object} props.item - Start menu node definition
 * @param {number} [props.depth=0] - Recursion depth
 * @param {Function} [props.onItemClick] - Callback invoked when an app is launched
 * @returns {JSX.Element|null} Start menu row element
 */
export default function StartMenuItem({ item, depth = 0, onItemClick }) {
  const { openApp } = useWindowManager();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsSubmenuOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setIsSubmenuOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  const handleImageError = useCallback(() => {
    setHasImageError(true);
  }, []);

  // 1. Separator node
  if (item.type === 'separator') {
    return (
      <div
        className="start-menu-separator my-1 border-t border-white/15"
        role="separator"
        aria-hidden="true"
      />
    );
  }

  // 2. Folder node with children
  if (item.children && Array.isArray(item.children)) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() => setIsSubmenuOpen((prev) => !prev)}
          className={`w-full px-3 py-1.5 flex items-center justify-between text-left text-xs transition-colors rounded-sm cursor-pointer start-menu-item ${
            isSubmenuOpen ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/10'
          }`}
          aria-haspopup="true"
          aria-expanded={isSubmenuOpen}
        >
          <div className="flex items-center min-w-0 mr-2">
            <FolderIcon
              icon={item.icon}
              hasError={hasImageError}
              onError={handleImageError}
            />
            <span className="truncate">{item.label}</span>
          </div>
          <span className="text-white/50 text-[10px] ml-1 select-none pointer-events-none">
            ▸
          </span>
        </button>

        {isSubmenuOpen && (
          <div
            className="absolute left-full top-0 ml-1 w-52 bg-[#2B2B2B]/95 backdrop-blur-md border border-white/10 rounded-md shadow-2xl py-1.5 z-50 animate-in fade-in duration-100"
            role="menu"
            aria-label={item.label}
          >
            {item.children.map((child, index) => (
              <StartMenuItem
                key={child.appId || child.label || index}
                item={child}
                depth={depth + 1}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Leaf app node
  const appConfig = getAppById(item.appId);
  if (!appConfig || appConfig.disabled) {
    return null;
  }

  const handleAppLaunch = () => {
    openApp(appConfig.id);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleAppLaunch}
      className="w-full px-3 py-1.5 flex items-center text-left text-xs text-white/90 hover:text-white transition-colors rounded-sm cursor-pointer start-menu-item hover:bg-white/10 focus:outline-none focus:bg-white/15"
      role="menuitem"
    >
      <AppIcon
        icon={appConfig.icon}
        title={appConfig.title}
        hasError={hasImageError}
        onError={handleImageError}
      />
      <span className="truncate">{appConfig.title}</span>
    </button>
  );
}
