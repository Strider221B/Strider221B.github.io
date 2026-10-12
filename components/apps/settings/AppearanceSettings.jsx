/**
 * @file components/apps/settings/AppearanceSettings.jsx
 * @description GNOME appearance settings tab for desktop wallpaper and accent color customization.
 */

// 1. React / Next.js core
import React, { useState } from 'react';

// 5. Project utilities, constants, config
import { WALLPAPERS } from '../../../lib/constants';

// 2. Constants
const ACCENT_COLORS = [
  { id: 'orange', name: 'Ubuntu Orange', color: '#E95420' },
  { id: 'bark', name: 'Bark', color: '#787859' },
  { id: 'teal', name: 'Teal', color: '#008080' },
  { id: 'blue', name: 'Blue', color: '#1E78D6' },
  { id: 'purple', name: 'Aubergine', color: '#77216F' },
];

// 3. Component function definition
/**
 * Renders the Appearance settings panel.
 *
 * @param {Object} props
 * @param {string} props.currentWallpaper - Currently applied wallpaper path
 * @param {Function} props.onChangeWallpaper - Callback to update wallpaper
 * @returns {JSX.Element} Appearance panel
 */
export default function AppearanceSettings({ currentWallpaper, onChangeWallpaper }) {
  const [selectedAccent, setSelectedAccent] = useState('orange');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white mb-1">Background</h3>
        <p className="text-xs text-white/60 mb-3">
          Select a wallpaper to customize your Ubuntu desktop surface.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.path;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => onChangeWallpaper(wp.path)}
                className={`group relative rounded-lg overflow-hidden border text-left transition-all p-1 ${
                  isSelected
                    ? 'border-ub-orange ring-2 ring-ub-orange/50 shadow-lg'
                    : 'border-white/10 hover:border-white/30'
                }`}
                aria-label={`Select ${wp.name} wallpaper`}
              >
                <div
                  className={`w-full h-20 rounded bg-gradient-to-br ${wp.gradient} flex items-end p-2 relative shadow-inner`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 bg-ub-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-1.5 px-1 pb-1">
                  <span className="text-xs font-medium text-white/90 truncate block">
                    {wp.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <h3 className="text-base font-semibold text-white mb-1">Accent Color</h3>
        <p className="text-xs text-white/60 mb-3">
          Choose a highlight accent for controls, buttons, and desktop indicators.
        </p>
        <div className="flex gap-3">
          {ACCENT_COLORS.map((accent) => {
            const isSelected = selectedAccent === accent.id;
            return (
              <button
                key={accent.id}
                type="button"
                onClick={() => setSelectedAccent(accent.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#333333]' : ''
                }`}
                style={{ backgroundColor: accent.color }}
                aria-label={`Select ${accent.name} accent`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
