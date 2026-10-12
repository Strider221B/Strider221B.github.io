/**
 * @file components/util/StatusIcons.jsx
 * @description Status cluster button for Ubuntu top panel showing network, dynamic volume,
 * and battery indicators that toggles the system quick-settings menu.
 */

// 1. React / Next.js core
import React from 'react';

// 2. Constants (File-scoped)
const ICON_SIZE_CLASS = 'w-3.5 h-3.5 fill-current';
const DEFAULT_VOLUME = 80;
const DEFAULT_BATTERY = 100;

// 3. Component function definition
/**
 * Renders status icon cluster in the top bar.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the status dropdown card is open
 * @param {Function} props.onToggle - Callback when status button is clicked
 * @param {number} [props.volume=80] - Current volume level (0-100)
 * @param {number} [props.battery=100] - Current battery percentage (0-100)
 * @param {boolean} [props.isWifiConnected=true] - WiFi connection status
 * @returns {JSX.Element} System status indicator button
 */
export default function StatusIcons({
  isOpen,
  onToggle,
  volume = DEFAULT_VOLUME,
  battery = DEFAULT_BATTERY,
  isWifiConnected = true,
}) {
  const isMuted = volume === 0;
  const isLowVolume = volume > 0 && volume < 50;

  return (
    <button
      id="top-panel-quick-settings-btn"
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 px-2.5 py-0.5 rounded text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange cursor-pointer select-none ${
        isOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
      }`}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-label={`System status: ${
        isWifiConnected ? 'Connected to WiFi' : 'Offline'
      }, Volume ${volume}%, Battery ${battery}%. Quick settings.`}
    >
      {/* Network / WiFi */}
      <svg className={ICON_SIZE_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        {isWifiConnected ? (
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.62 0 6.94 1.34 9.5 3.57L12 18.23 2.5 11.07C5.06 8.84 8.38 7.5 12 7.5z" />
        ) : (
          <path d="M23.64 7c-.45-.34-4.93-3.8-11.64-3.8-1.5 0-2.8.19-3.96.49L12 7.74 23.64 7zM2.81 2.81L1.39 4.22l2.67 2.67C2.26 7.84 1.05 8.79.36 9.35L12 24l4.24-5.31 4.54 4.54 1.41-1.41L2.81 2.81z" />
        )}
      </svg>

      {/* Volume */}
      <svg className={ICON_SIZE_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        {isMuted ? (
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        ) : isLowVolume ? (
          <path d="M7 9v6h4l5 5V4L11 9H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        ) : (
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        )}
      </svg>

      {/* Battery */}
      <svg className={ICON_SIZE_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
      </svg>

      {/* Caret */}
      <svg
        className={`w-2.5 h-2.5 fill-current opacity-70 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </button>
  );
}
