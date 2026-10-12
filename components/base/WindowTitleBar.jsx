/**
 * @file components/base/WindowTitleBar.jsx
 * @description Window top title bar featuring application icon, title, drag region,
 * and integrated WindowControls buttons.
 */

// 1. React / Next.js core
import React, { useState } from 'react';

// 4. Project components
import WindowControls from './WindowControls';

// 3. Component function definition
/**
 * Renders the top title bar of a desktop window.
 *
 * @param {Object} props
 * @param {string} props.title - Application title
 * @param {string} [props.icon] - Application icon image path
 * @param {boolean} [props.isFocused=true] - Whether window currently has input focus
 * @param {boolean} [props.isMaximized=false] - Whether window is maximized
 * @param {Function} props.onMinimize - Callback to minimize
 * @param {Function} props.onMaximize - Callback to maximize / restore
 * @param {Function} props.onClose - Callback to close
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

  return (
    <div
      onDoubleClick={onMaximize}
      className={`window-drag-handle h-8 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b transition-colors ${
        isFocused
          ? 'bg-ub-window-title text-white border-black/40'
          : 'bg-[#282727] text-white/70 border-black/30'
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
        {icon && !hasImageError && (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-4 h-4 object-contain"
            onError={() => setHasImageError(true)}
          />
        )}
        <span className="text-xs font-medium truncate">{title}</span>
      </div>

      <WindowControls
        isMaximized={isMaximized}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    </div>
  );
}
