/**
 * @file components/base/SideBarApp.jsx
 * @description Single application dock icon with indicator pips, focus highlights,
 * and click animation feedback for the Ubuntu launcher dock.
 */

// 1. React / Next.js core
import React, { memo, useState, useRef, useEffect } from 'react';

// 2. Constants
const CLICK_PULSE_DURATION_MS = 400;

// 3. Component function definition
/**
 * Renders a single application dock icon inside SideBar.
 *
 * @param {Object} props
 * @param {string} props.id - Application identifier
 * @param {string} props.title - Application display title
 * @param {string} [props.icon] - Path to application icon asset
 * @param {boolean} [props.isOpen=false] - Whether the app is currently running
 * @param {boolean} [props.isFocused=false] - Whether the app currently has window focus
 * @param {Function} [props.onClick] - Click handler for launching or switching window
 * @param {Function} [props.onHover] - Hover handler passing element for external tooltip
 * @param {Function} [props.onLeave] - Mouse leave handler to dismiss external tooltip
 * @returns {JSX.Element} Dock application launcher button
 */
function SideBarApp({
  id,
  title,
  icon,
  isOpen = false,
  isFocused = false,
  onClick,
  onHover,
  onLeave,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const buttonRef = useRef(null);
  const pulseTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    onHover?.(buttonRef.current);
  };

  const handleMouseLeave = () => {
    onLeave?.();
  };

  const handleClick = (e) => {
    setIsPulsing(true);
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = setTimeout(() => {
      setIsPulsing(false);
    }, CLICK_PULSE_DURATION_MS);

    onLeave?.();
    onClick?.(e);
  };

  const initialLetter = (title || id || '?').charAt(0).toUpperCase();

  const buttonClasses = [
    'relative w-11 h-11 m-1 p-2 rounded-md flex items-center justify-center transition-all duration-150',
    'focus:outline-none focus:ring-1 focus:ring-ub-orange',
    isFocused ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10 active:bg-white/20',
    isPulsing ? 'scale-90' : 'scale-100',
  ].join(' ');

  return (
    <div
      className="relative flex items-center justify-center group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isOpen && (
        <span
          className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-2 bg-ub-orange rounded-r-full"
          aria-hidden="true"
        />
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={buttonClasses}
        aria-label={`${title}${isOpen ? ' (Running)' : ''}`}
        aria-describedby={`tooltip-${id}`}
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
    </div>
  );
}

export default memo(SideBarApp);
