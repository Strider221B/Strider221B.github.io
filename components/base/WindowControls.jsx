/**
 * @file components/base/WindowControls.jsx
 * @description Window action buttons (Minimize, Maximize, Close) with Ubuntu GNOME
 * styling and keyboard accessibility.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders window control buttons for minimize, maximize, and close.
 *
 * @param {Object} props
 * @param {boolean} [props.isMaximized=false] - Whether the window is currently maximized
 * @param {Function} props.onMinimize - Callback when minimize button is clicked
 * @param {Function} props.onMaximize - Callback when maximize button is clicked
 * @param {Function} props.onClose - Callback when close button is clicked
 * @returns {JSX.Element} Window controls cluster
 */
export default function WindowControls({
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
}) {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Minimize */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMinimize();
        }}
        className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-white/50"
        aria-label="Minimize Window"
      >
        <span className="w-2 h-0.5 bg-white/90 rounded-full" />
      </button>

      {/* Maximize / Restore */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-white/50"
        aria-label={isMaximized ? 'Restore Window' : 'Maximize Window'}
      >
        <span className="w-2 h-2 border border-white/90 rounded-[1px]" />
      </button>

      {/* Close */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="w-4 h-4 rounded-full bg-ub-orange hover:bg-red-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange"
        aria-label="Close Window"
      >
        <svg className="w-2 h-2 fill-current text-white" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
}
