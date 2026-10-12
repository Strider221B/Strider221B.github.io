/**
 * @file components/base/DesktopShortcut.jsx
 * @description Desktop shortcut icon component with selection highlight,
 * image fallback handling, and double-click / keyboard activation.
 */

// 1. React / Next.js core
import React, { memo, useState } from 'react';

// 3. Component function definition
/**
 * Renders an interactive desktop shortcut icon.
 *
 * @param {Object} props
 * @param {string} props.id - Application identifier
 * @param {string} props.title - Application display label
 * @param {string} [props.icon] - Application icon image path
 * @param {boolean} [props.isSelected=false] - Whether shortcut currently has selection focus
 * @param {Function} props.onSelect - Selection click handler
 * @param {Function} props.onDoubleClick - Double-click launch handler
 * @returns {JSX.Element} Desktop shortcut element
 */
function DesktopShortcut({
  id,
  title,
  icon,
  isSelected = false,
  onSelect,
  onDoubleClick,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const initialLetter = (title || id || '?').charAt(0).toUpperCase();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onDoubleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
      className={`group w-24 p-2 flex flex-col items-center gap-1.5 rounded-lg text-center cursor-pointer select-none transition-colors focus:outline-none ${
        isSelected
          ? 'bg-ub-orange/20 border border-ub-orange/50 shadow-sm'
          : 'hover:bg-white/10 active:bg-white/20 border border-transparent'
      }`}
      aria-label={`${title} desktop shortcut`}
    >
      <div className="w-12 h-12 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform">
        {icon && !hasImageError ? (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain drop-shadow-md"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-ub-orange to-ub-med-abrgn flex items-center justify-center text-white text-base font-bold shadow-md"
            aria-hidden="true"
          >
            {initialLetter}
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 px-1 rounded">
        {title}
      </span>
    </button>
  );
}

export default memo(DesktopShortcut);
