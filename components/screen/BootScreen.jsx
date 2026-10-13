/**
 * @file components/screen/BootScreen.jsx
 * @description System startup splash screen simulating Ubuntu Plymouth boot loader.
 * Features the authentic Ubuntu Circle of Friends emblem, animated progress spinner,
 * release branding, and accessible skip capability.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useCallback } from 'react';

// 5. Project utilities, constants, config
import { BOOT_SCREEN_DELAY_MS } from '../../lib/constants';

// 2. Constants (non-exported, file-scoped)
const PROGRESS_TICK_MS = 40;
const PROGRESS_STEP_PERCENT = 2.5;
const MAX_PROGRESS_PERCENT = 100;
const UBUNTU_RELEASE_LABEL = 'Ubuntu 26.04.1 LTS';

// ─── HELPER SUB-COMPONENTS (< 30 lines each) ─────────────────────────

/**
 * Authentic Ubuntu Circle of Friends vector emblem with signature orange geometry.
 *
 * @returns {JSX.Element} SVG emblem
 */
function UbuntuLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="w-24 h-24 sm:w-28 sm:h-28 text-ub-orange drop-shadow-2xl"
        viewBox="0 0 100 100"
        fill="currentColor"
        role="img"
        aria-label="Ubuntu Circle of Friends Logo"
      >
        {/* Outer Ubuntu orange disc */}
        <circle cx="50" cy="50" r="48" fill="currentColor" />
        {/* Inner black mask creating the circular track */}
        <circle cx="50" cy="50" r="28" fill="#000000" />
        {/* White core connecting ring */}
        <circle cx="50" cy="50" r="20" fill="none" stroke="#FFFFFF" strokeWidth="6" />
        {/* Top friend head */}
        <circle cx="50" cy="21" r="5.5" fill="#FFFFFF" />
        {/* Bottom-left friend head */}
        <circle cx="24.8" cy="64.5" r="5.5" fill="#FFFFFF" />
        {/* Bottom-right friend head */}
        <circle cx="75.2" cy="64.5" r="5.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * Plymouth circular spinner and horizontal progress track indicator.
 *
 * @param {Object} props
 * @param {number} props.progress - Current progress percent (0 - 100)
 * @returns {JSX.Element} Spinner and progress bar
 */
function BootSpinner({ progress }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-8 h-8 rounded-full border-2 border-white/20 border-t-ub-orange animate-spin"
        role="progressbar"
        aria-label="System loading indicator"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <div className="w-44 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-ub-orange transition-all duration-75 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Bottom branding and interactive keyboard/click skip prompt.
 *
 * @param {Object} props
 * @param {Function} props.onSkip - Skip action callback
 * @returns {JSX.Element} Footer area
 */
function BootFooter({ onSkip }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-3xl font-light tracking-wider text-white/95">
        ubuntu
      </h1>
      <span className="text-xs text-white/40 tracking-widest font-mono">
        {UBUNTU_RELEASE_LABEL}
      </span>
      <button
        type="button"
        onClick={onSkip}
        className="mt-2 text-xs text-white/30 hover:text-white/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange rounded px-2 py-0.5"
        aria-label="Skip startup boot sequence"
      >
        Press Enter or click to skip
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT DEFINITION ───────────────────────────────────────

/**
 * Renders the system startup boot animation screen.
 * Automatically advances progress over BOOT_SCREEN_DELAY_MS or allows user skip.
 *
 * @param {Object} props
 * @param {boolean} [props.visible=true] - Whether the boot screen is currently active
 * @param {Function} [props.onBootComplete] - Callback fired when boot completes or is skipped
 * @returns {JSX.Element|null} Boot splash screen
 */
export default function BootScreen({ visible = true, onBootComplete }) {
  const [progress, setProgress] = useState(0);

  // Advance loading progress incrementally toward 100%
  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + PROGRESS_STEP_PERCENT;
        if (next >= MAX_PROGRESS_PERCENT) {
          clearInterval(timer);
          onBootComplete?.();
          return MAX_PROGRESS_PERCENT;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);

    return () => clearInterval(timer);
  }, [visible, onBootComplete]);

  // Handle immediate skip via click or shortcut key
  const handleSkip = useCallback((event) => {
    event?.stopPropagation?.();
    onBootComplete?.();
  }, [onBootComplete]);

  // Handle keyboard shortcuts (Enter, Space, Escape to skip)
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      event.preventDefault();
      handleSkip();
    }
  }, [handleSkip]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white select-none py-12 px-6 cursor-pointer focus:outline-none"
      role="status"
      aria-live="polite"
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Booting Ubuntu. Press Enter or click to skip."
    >
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={handleSkip}
          className="px-3 py-1 rounded text-xs text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange"
          aria-label="Skip boot sequence"
        >
          Skip (Esc)
        </button>
      </div>

      <div className="flex flex-col items-center gap-8">
        <UbuntuLogo />
        <BootSpinner progress={progress} />
      </div>

      <BootFooter onSkip={handleSkip} />
    </div>
  );
}
