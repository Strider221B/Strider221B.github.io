/**
 * @file components/util/StatusIcons.jsx
 * @description Status cluster button for Ubuntu top panel showing network, volume,
 * and battery indicators that toggles the system quick-settings menu.
 */

// 1. React / Next.js core
import React from 'react';

// 2. Constants
const ICON_SIZE_CLASS = 'w-3.5 h-3.5 fill-current';

// 3. Component function definition
/**
 * Renders status icon cluster in the top bar.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the status dropdown card is open
 * @param {Function} props.onToggle - Callback when status button is clicked
 * @returns {JSX.Element} System status indicator button
 */
export default function StatusIcons({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 px-2 py-0.5 rounded text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange ${
        isOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
      }`}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-label="System status and quick settings menu"
    >
      {/* Network / WiFi */}
      <svg className={ICON_SIZE_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.62 0 6.94 1.34 9.5 3.57L12 18.23 2.5 11.07C5.06 8.84 8.38 7.5 12 7.5z" />
      </svg>

      {/* Volume */}
      <svg className={ICON_SIZE_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>

      {/* Battery */}
      <svg className={ICON_SIZE_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
      </svg>

      {/* Caret */}
      <svg className="w-2.5 h-2.5 fill-current opacity-70" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </button>
  );
}
