/**
 * @file components/base/SideBarApp.jsx
 * @description Single application dock icon with indicator pips, focus highlights,
 * and hover tooltip for the Ubuntu desktop launcher.
 */

// 1. React / Next.js core
import React, { memo, useState } from 'react';

// 2. Constants
const TOOLTIP_DELAY_MS = 200;

// 3. Component function definition
/**
 * Renders a single application dock icon inside SideBar.
 *
 * @param {Object} props
 * @param {string} props.id - Application identifier
 * @param {string} props.title - Application display title
 * @param {string} [props.icon] - Path to application icon asset
 * @param {boolean} props.isOpen - Whether the app is currently running
 * @param {boolean} props.isFocused - Whether the app currently has window focus
 * @param {Function} props.onClick - Click handler for launching or switching window
 * @returns {JSX.Element} Dock application launcher button
 */
function SideBarApp({ id, title, icon, isOpen, isFocused, onClick }) {
  const [hasImageError, setHasImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const initialLetter = (title || id || '?').charAt(0).toUpperCase();

  return (
    <div
      className="relative flex items-center justify-center group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Orange running indicator dot */}
      {isOpen && (
        <span
          className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-ub-orange rounded-r-full"
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={onClick}
        className={`relative w-11 h-11 m-1 p-2 rounded-md flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-ub-orange ${
          isFocused
            ? 'bg-white/20 shadow-inner'
            : 'hover:bg-white/10 active:bg-white/20'
        }`}
        aria-label={`${title}${isOpen ? ' (Running)' : ''}`}
      >
        {icon && !hasImageError ? (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain pointer-events-none group-hover:scale-105 transition-transform"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full rounded bg-gradient-to-br from-ub-orange to-ub-med-abrgn flex items-center justify-center text-white text-xs font-bold pointer-events-none group-hover:scale-105 transition-transform"
            aria-hidden="true"
          >
            {initialLetter}
          </div>
        )}
      </button>

      {/* Hover tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ub-grey/95 text-white text-xs font-medium rounded shadow-xl whitespace-nowrap pointer-events-none z-50 border border-white/10 animate-in fade-in duration-100"
        >
          {title}
        </div>
      )}
    </div>
  );
}

export default memo(SideBarApp);
