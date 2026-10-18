/**
 * @file components/base/WindowControls.jsx
 * @description Window action buttons (Minimize, Maximize/Restore, Close) with Ubuntu GNOME
 * styling, stop-propagation protection, and keyboard accessibility.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../hooks/useTheme';

// 2. Constants
const BASE_BTN_CLASS =
  'no-drag w-4 h-4 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-1 touch-manipulation cursor-pointer';
const CLOSE_BTN_CLASS = `${BASE_BTN_CLASS} bg-ub-orange hover:bg-red-600 active:bg-red-700 focus:ring-ub-orange`;

// 3. Component function definition
/**
 * Renders window control buttons for minimize, maximize/restore, and close.
 *
 * @param {Object} props
 * @param {boolean} [props.isMaximized=false] - Whether the window is currently maximized
 * @param {Function} [props.onMinimize] - Callback when minimize button is clicked
 * @param {Function} [props.onMaximize] - Callback when maximize button is clicked
 * @param {Function} [props.onClose] - Callback when close button is clicked
 * @param {boolean} [props.isDayTheme] - Whether Day theme is active
 * @returns {JSX.Element} Window controls cluster
 */
export default function WindowControls({
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  isDayTheme: propIsDayTheme,
}) {
  const themeContext = useTheme();
  const isDayTheme = propIsDayTheme ?? themeContext?.isDayTheme ?? false;

  const handleAction = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.();
  };

  const actionBtnClass = `${BASE_BTN_CLASS} ${
    isDayTheme
      ? 'bg-black/10 hover:bg-black/20 active:bg-black/30 focus:ring-black/30'
      : 'bg-white/20 hover:bg-white/40 active:bg-white/50 focus:ring-white/50'
  }`;

  return (
    <div
      className="no-drag flex items-center gap-2 select-none py-1"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        title="Minimize"
        aria-label="Minimize Window"
        onClick={(e) => handleAction(e, onMinimize)}
        className={actionBtnClass}
      >
        <span
          className={`w-2 h-0.5 rounded-full pointer-events-none ${
            isDayTheme ? 'bg-[#2e3436]' : 'bg-white/90'
          }`}
        />
      </button>

      <button
        type="button"
        title={isMaximized ? 'Restore' : 'Maximize'}
        aria-label={isMaximized ? 'Restore Window' : 'Maximize Window'}
        onClick={(e) => handleAction(e, onMaximize)}
        className={actionBtnClass}
      >
        {isMaximized ? (
          <span className="relative w-2.5 h-2.5 pointer-events-none">
            <span
              className={`absolute top-0 right-0 w-1.5 h-1.5 border rounded-[1px] ${
                isDayTheme ? 'border-black/60' : 'border-white/70'
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 w-1.5 h-1.5 border rounded-[1px] ${
                isDayTheme
                  ? 'border-[#2e3436] bg-[#E8E8E8]'
                  : 'border-white/90 bg-ub-window-title'
              }`}
            />
          </span>
        ) : (
          <span
            className={`w-2 h-2 border rounded-[1px] pointer-events-none ${
              isDayTheme ? 'border-[#2e3436]' : 'border-white/90'
            }`}
          />
        )}
      </button>

      <button
        type="button"
        title="Close"
        aria-label="Close Window"
        onClick={(e) => handleAction(e, onClose)}
        className={CLOSE_BTN_CLASS}
      >
        <svg className="w-2 h-2 fill-current text-white pointer-events-none" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
}
