/**
 * @file components/base/WindowTitleBar.jsx
 * @description Window top title bar featuring application icon, centered title,
 * drag handle region, double-click to maximize, and integrated WindowControls.
 */

// 1. React / Next.js core
import React, { useState } from 'react';

// 4. Project components
import WindowControls from './WindowControls';

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
  const [hasImageError, setHasImageError] = useState(false);

  const containerClasses = [
    'window-drag-handle h-8 px-3 flex items-center justify-between select-none border-b transition-colors',
    isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
    isFocused
      ? 'bg-ub-window-title text-white border-black/40'
      : 'bg-ub-cool-grey/80 text-white/70 border-black/30',
  ].join(' ');

  return (
    <div
      onDoubleClick={onMaximize}
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

      <span className="text-xs font-medium tracking-wide text-ubt-grey truncate pointer-events-none flex-1 text-center px-2">
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
