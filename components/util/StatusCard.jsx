/**
 * @file components/util/StatusCard.jsx
 * @description Quick-settings dropdown card rendering Ubuntu GNOME system controls,
 * including volume/brightness sliders, settings shortcut, lock screen, and shutdown actions.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useRef } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 2. Constants
const DEFAULT_VOLUME = 80;
const DEFAULT_BRIGHTNESS = 100;

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────

/**
 * Range slider row with leading icon for volume or brightness adjustment.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - SVG icon component
 * @param {number} props.value - Current slider value
 * @param {Function} props.onChange - Value change handler
 * @param {string} props.label - Accessible input label
 */
function SliderRow({ icon, value, onChange, label }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 text-white/90">
      <div className="w-5 h-5 flex items-center justify-center text-white/70">
        {icon}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={onChange}
        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-ub-orange"
        aria-label={label}
      />
    </div>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Dropdown card for system settings and session management.
 *
 * @param {Object} props
 * @param {Function} props.lockScreen - Callback to lock desktop
 * @param {Function} props.shutDown - Callback to shut down session
 * @param {Function} props.onClose - Callback to dismiss menu
 * @param {number} [props.volume] - Controlled volume level (0-100)
 * @param {Function} [props.onVolumeChange] - Volume change callback
 * @param {number} [props.brightness] - Controlled screen brightness level (0-100)
 * @param {Function} [props.onBrightnessChange] - Brightness change callback
 * @returns {JSX.Element} Status dropdown card
 */
export default function StatusCard({
  lockScreen,
  shutDown,
  onClose,
  volume: controlledVolume,
  onVolumeChange,
  brightness: controlledBrightness,
  onBrightnessChange,
}) {
  const { openApp } = useWindowManager();
  const [internalVolume, setInternalVolume] = useState(DEFAULT_VOLUME);
  const [internalBrightness, setInternalBrightness] = useState(DEFAULT_BRIGHTNESS);
  const cardRef = useRef(null);

  const volume = controlledVolume !== undefined ? controlledVolume : internalVolume;
  const brightness = controlledBrightness !== undefined ? controlledBrightness : internalBrightness;

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    if (onVolumeChange) {
      onVolumeChange(val);
    } else {
      setInternalVolume(val);
    }
  };

  const handleBrightnessChange = (e) => {
    const val = Number(e.target.value);
    if (onBrightnessChange) {
      onBrightnessChange(val);
    } else {
      setInternalBrightness(val);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOpenSettings = () => {
    openApp('settings');
    onClose();
  };

  const handleLock = () => {
    onClose();
    lockScreen();
  };

  const handleShutDown = () => {
    onClose();
    shutDown();
  };

  return (
    <div
      ref={cardRef}
      className="absolute right-0 top-8 w-72 bg-[#2B2B2B] text-white rounded-xl shadow-2xl border border-white/10 p-3 flex flex-col gap-2 z-50 select-none animate-in fade-in zoom-in-95 duration-100"
      role="menu"
      aria-label="System Quick Settings"
    >
      <SliderRow
        label="Volume"
        value={volume}
        onChange={handleVolumeChange}
        icon={
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        }
      />
      <SliderRow
        label="Brightness"
        value={brightness}
        onChange={handleBrightnessChange}
        icon={
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z" />
          </svg>
        }
      />
      <div className="h-px bg-white/10 my-1" />
      <div className="flex items-center justify-between px-2 pt-1 text-sm">
        <button
          type="button"
          onClick={handleOpenSettings}
          className="p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange"
          title="Settings"
          aria-label="Open Settings"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleLock}
          className="p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange"
          title="Lock Screen"
          aria-label="Lock Screen"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleShutDown}
          className="p-2 rounded-full hover:bg-red-600/30 text-white/90 hover:text-red-400 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
          title="Power Off / Shut Down"
          aria-label="Shut Down System"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A7.92 7.92 0 0 1 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8c0-2.38 1.05-4.52 2.73-5.99L5.31 4.59A9.94 9.94 0 0 0 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-2.94-1.27-5.58-3.17-6.83z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
