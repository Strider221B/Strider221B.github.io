/**
 * @file components/base/DesktopContextMenu.jsx
 * @description Right-click context menu for the Ubuntu desktop surface offering
 * quick terminal launching, wallpaper management, settings, and window minimization.
 */

// 1. React / Next.js core
import React, { useEffect, useRef } from 'react';

// 2. Constants
const MENU_WIDTH = 200;
const MENU_HEIGHT = 220;

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────

/**
 * Single actionable item row inside the context menu.
 *
 * @param {Object} props
 * @param {string} props.label - Menu item label
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Whether action is disabled
 */
function MenuItem({ label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full px-3 py-1.5 text-left text-xs transition-colors flex items-center justify-between ${
        disabled
          ? 'text-white/30 cursor-not-allowed'
          : 'text-white hover:bg-ub-orange cursor-pointer'
      }`}
    >
      <span>{label}</span>
    </button>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders the floating desktop context menu.
 *
 * @param {Object} props
 * @param {number} props.x - Screen X coordinate for menu origin
 * @param {number} props.y - Screen Y coordinate for menu origin
 * @param {Function} props.onClose - Dismiss menu callback
 * @param {Function} props.onChangeWallpaper - Trigger wallpaper change
 * @param {Function} props.onOpenTerminal - Launch terminal
 * @param {Function} props.onOpenSettings - Launch settings
 * @param {Function} props.onShowDesktop - Minimize open windows
 * @returns {JSX.Element} Context menu overlay
 */
export default function DesktopContextMenu({
  x,
  y,
  onClose,
  onChangeWallpaper,
  onOpenTerminal,
  onOpenSettings,
  onShowDesktop,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Clamp menu inside window viewport
  const posX = typeof window !== 'undefined' ? Math.min(x, window.innerWidth - MENU_WIDTH - 10) : x;
  const posY = typeof window !== 'undefined' ? Math.min(y, window.innerHeight - MENU_HEIGHT - 10) : y;

  return (
    <div
      ref={menuRef}
      style={{ left: posX, top: posY }}
      className="fixed z-50 w-52 bg-[#2B2B2B] border border-white/10 rounded-md shadow-2xl py-1 text-white select-none animate-in fade-in duration-75"
      role="menu"
      aria-label="Desktop Context Menu"
    >
      <MenuItem label="New Folder" disabled />
      <MenuItem label="Paste" disabled />
      <div className="h-px bg-white/10 my-1" />
      <MenuItem label="Show Desktop" onClick={onShowDesktop} />
      <MenuItem label="Open in Terminal" onClick={onOpenTerminal} />
      <div className="h-px bg-white/10 my-1" />
      <MenuItem label="Change Background..." onClick={onChangeWallpaper} />
      <MenuItem label="Display Settings" onClick={onOpenSettings} />
    </div>
  );
}
