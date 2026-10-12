/**
 * @file components/screen/BootScreen.jsx
 * @description System startup splash screen displaying Ubuntu branding and loading animation.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the system startup boot animation screen.
 *
 * @param {Object} props
 * @param {boolean} [props.visible=true] - Visibility toggle
 * @param {Function} [props.onBootComplete] - Boot completion handler
 * @returns {JSX.Element} Boot splash screen
 */
export default function BootScreen({ visible = true, onBootComplete }) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white select-none py-16"
      role="status"
      aria-live="polite"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-full border-4 border-ub-orange border-t-transparent animate-spin" />
        <h1 className="text-2xl font-light tracking-wide text-white/90">
          ubuntu
        </h1>
      </div>
      <div className="text-xs text-white/40">
        Ubuntu 22.04 LTS
      </div>
    </div>
  );
}
