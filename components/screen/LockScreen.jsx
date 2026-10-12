/**
 * @file components/screen/LockScreen.jsx
 * @description Lock screen component with password prompt and backdrop blur to unlock session.
 */

// 1. React / Next.js core
import React from 'react';

// 4. Project components
import Clock from '../util/Clock';

// 3. Component function definition
/**
 * Renders the session lock screen.
 *
 * @param {Object} props
 * @param {boolean} [props.isLocked=true] - Whether session is locked
 * @param {Function} props.onUnlock - Callback to unlock session
 * @returns {JSX.Element|null} Lock screen view
 */
export default function LockScreen({ isLocked = true, onUnlock }) {
  if (!isLocked) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/80 backdrop-blur-xl text-white select-none py-16"
      role="region"
      aria-label="Lock Screen"
    >
      <div className="pt-8">
        <Clock />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-ub-orange flex items-center justify-center text-2xl font-bold">
          U
        </div>
        <p className="text-lg font-medium">User</p>
        <button
          type="button"
          onClick={onUnlock}
          className="px-6 py-2 rounded-full bg-ub-orange hover:bg-ub-orange/90 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          Unlock Desktop
        </button>
      </div>

      <div className="text-xs text-white/40">
        Press button to unlock session
      </div>
    </div>
  );
}
