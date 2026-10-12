/**
 * @file components/base/SideBarApp.jsx
 * @description Single application dock icon with indicator pips, focus highlights,
 * click animation feedback, and hover tooltip for the Ubuntu launcher dock.
 */

// 1. React / Next.js core
import React, { memo, useState, useRef, useEffect } from 'react';

// 2. Constants
const TOOLTIP_DELAY_MS = 200;
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
 * @returns {JSX.Element} Dock application launcher button
 */
function SideBarApp({
  id,
  title,
  icon,
  isOpen = false,
  isFocused = false,
  onClick,
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const tooltipTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, TOOLTIP_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setShowTooltip(false);
  };

  const handleClick = (e) => {
    setIsPulsing(true);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => {
      setIsPulsing(false);
    }, CLICK_PULSE_DURATION_MS);

    handleMouseLeave();
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
        type="button"
        onClick={handleClick}
        className={buttonClasses}
        aria-label={`${title}${isOpen ? ' (Running)' : ''}`}
        aria-describedby={showTooltip ? `tooltip-${id}` : undefined}
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

      {showTooltip && (
        <div
          id={`tooltip-${id}`}
          role="tooltip"
          className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ub-grey/95 text-white text-xs font-medium rounded shadow-xl whitespace-nowrap pointer-events-none z-50 border border-white/10"
        >
          <span
            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-ub-grey rotate-45 border-l border-b border-white/10"
            aria-hidden="true"
          />
          {title}
        </div>
      )}
    </div>
  );
}

export default memo(SideBarApp);
