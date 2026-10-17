/**
 * @file components/base/WindowTitleBar.jsx
 * @description Window top title bar featuring application icon, centered title,
 * drag handle region, double-click to maximize, and integrated WindowControls.
 */

// 1. React / Next.js core
import React, { useState, useRef } from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../hooks/useTheme';

// 4. Project components
import WindowControls from './WindowControls';

// 2. Constants
const DOUBLE_TAP_THRESHOLD_MS = 300;

// 3. Component function definition
/**
 * Renders the top title bar of a desktop application window.
 *
 * @param {Object} props
 * @param {string} props.title - Application title
 * @param {string} [props.icon] - Application icon image path
 * @param {boolean} [props.isFocused=true] - Whether window currently has input focus
 * @param {boolean} [props.isMaximized=false] - Whether window is maximized
 * @param {Function} [props.onMinimize] - Callback to minimize
 * @param {Function} [props.onMaximize] - Callback to maximize / restore
 * @param {Function} [props.onClose] - Callback to close
 * @returns {JSX.Element} Window title bar component
 */
export default function WindowTitleBar({
  title,
  icon,
  isFocused = true,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
}) {
  const { isDayTheme } = useTheme();
  const [hasImageError, setHasImageError] = useState(false);
  const lastTapRef = useRef(0);

  const handleTouchEnd = (e) => {
    if (e.target.closest('button')) {
      return;
    }
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_THRESHOLD_MS) {
      onMaximize?.();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const dayActiveClasses = 'bg-[#E8E8E8] text-[#2e3436] border-black/10';
  const dayInactiveClasses = 'bg-[#F4F4F4] text-[#2e3436]/60 border-black/10';
  const darkActiveClasses = 'bg-ub-window-title text-white border-black/40';
  const darkInactiveClasses = 'bg-ub-cool-grey/80 text-white/70 border-black/30';

  const themeClasses = isDayTheme
    ? isFocused
      ? dayActiveClasses
      : dayInactiveClasses
    : isFocused
    ? darkActiveClasses
    : darkInactiveClasses;

  const containerClasses = [
    'window-drag-handle h-8 px-3 flex items-center justify-between select-none border-b transition-colors touch-none sm:touch-auto',
    isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
    themeClasses,
  ].join(' ');

  return (
    <div
      onDoubleClick={onMaximize}
      onTouchEnd={handleTouchEnd}
      className={containerClasses}
      role="toolbar"
      aria-label={`${title} title bar`}
    >
      <div className="flex items-center gap-2 min-w-[2rem] overflow-hidden pointer-events-none">
        {icon && !hasImageError && (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-4 h-4 object-contain"
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

      <span
        className={`text-xs font-medium tracking-wide truncate pointer-events-none flex-1 text-center px-2 ${
          isDayTheme ? 'text-[#2e3436]' : 'text-ubt-grey'
        }`}
      >
        {title}
      </span>

      <WindowControls
        isMaximized={isMaximized}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    </div>
  );
}
