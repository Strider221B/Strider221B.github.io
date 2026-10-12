/**
 * @file components/apps/Settings.jsx
 * @description GNOME Control Center settings app for customization and wallpaper selection.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the Settings control panel window.
 *
 * @returns {JSX.Element} System settings window
 */
export default function Settings() {
  return (
    <div className="h-full bg-ub-cool-grey text-white p-6">
      <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">
        Settings
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-ub-orange mb-1">Appearance</h3>
          <p className="text-xs text-white/70">
            Configure system wallpaper, theme accents, and desktop dock behavior.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-ub-orange mb-1">About System</h3>
          <p className="text-xs text-white/70">
            Ubuntu 22.04 LTS Portfolio Edition running on Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
}
