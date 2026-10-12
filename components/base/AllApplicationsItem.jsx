/**
 * @file components/base/AllApplicationsItem.jsx
 * @description Single application launcher card in the All Applications full-screen grid,
 * featuring large icon preview, running window indicator, and click animation feedback.
 */

// 1. React / Next.js core
import React, { memo, useState } from 'react';

// 3. Component function definition
/**
 * Renders an application launcher icon tile in the All Applications drawer.
 *
 * @param {Object} props
 * @param {string} props.id - Application unique identifier
 * @param {string} props.title - Application display label
 * @param {string} [props.icon] - Application icon image path
 * @param {boolean} [props.isOpen=false] - Whether app window is currently running
 * @param {Function} props.onClick - Click handler to open app
 * @returns {JSX.Element} Application grid item button
 */
function AllApplicationsItem({
  id,
  title,
  icon,
  isOpen = false,
  onClick,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const initialLetter = (title || id || '?').charAt(0).toUpperCase();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="group flex flex-col items-center justify-start p-3 rounded-xl transition-all duration-150 hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-ub-orange/80 cursor-pointer select-none text-center"
      aria-label={`${title}${isOpen ? ' (Running)' : ''}`}
    >
      <div className="relative w-14 h-14 md:w-16 md:h-16 mb-2 flex items-center justify-center">
        {icon && !hasImageError ? (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform duration-150 pointer-events-none"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full rounded-2xl bg-gradient-to-br from-ub-orange via-ub-med-abrgn to-ub-drk-abrgn flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform duration-150 pointer-events-none"
            aria-hidden="true"
          >
            {initialLetter}
          </div>
        )}

        {isOpen && (
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ub-orange shadow-sm ring-2 ring-black/50"
            title="Running application"
            aria-hidden="true"
          />
        )}
      </div>

      <span className="text-xs md:text-sm font-medium text-white/90 group-hover:text-white line-clamp-2 px-1 leading-tight tracking-wide drop-shadow-sm">
        {title}
      </span>
    </button>
  );
}

export default memo(AllApplicationsItem);
