/**
 * @file components/apps/settings/AppearanceSettings.jsx
 * @description GNOME appearance settings tab for desktop style (Dark vs Day),
 * accent color customization, and desktop wallpaper management.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../../hooks/useTheme';

// 5. Project utilities, constants, config
import { WALLPAPERS, ACCENT_COLORS, THEMES, THEME_OPTIONS } from '../../../lib/constants';

// ─── HELPER SUB-COMPONENTS ───────────────────────────────────────────

/**
 * Visual style switcher rendering Day vs Dark appearance options.
 *
 * @param {Object} props
 * @param {string} props.theme - Active theme key ('dark' or 'day')
 * @param {Function} props.onSelectTheme - Theme change callback
 * @param {boolean} props.isDayTheme - Whether Day theme is active
 */
function StyleSelector({ theme, onSelectTheme, isDayTheme }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:max-w-md">
      {THEME_OPTIONS.map((opt) => {
        const isSelected = theme === opt.id;
        const isDayOpt = opt.id === THEMES.DAY;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectTheme(opt.id)}
            className={`flex flex-col items-center p-3 rounded-xl border text-left transition-all ${
              isSelected
                ? 'border-ub-orange ring-2 ring-ub-orange/50 shadow-md'
                : isDayTheme
                ? 'border-black/15 hover:border-black/30 bg-black/5'
                : 'border-white/10 hover:border-white/20 bg-white/5'
            }`}
            aria-pressed={isSelected}
            aria-label={`Select ${opt.name} style`}
          >
            {/* Visual window preview mockup */}
            <div
              className={`w-full h-16 rounded-md border flex flex-col overflow-hidden shadow-inner ${
                isDayOpt
                  ? 'bg-white border-black/10'
                  : 'bg-[#181818] border-white/10'
              }`}
            >
              <div
                className={`h-4 px-2 flex items-center justify-between border-b ${
                  isDayOpt
                    ? 'bg-[#E5E5E5] border-black/10'
                    : 'bg-[#2A2A2A] border-white/10'
                }`}
              >
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
                <div
                  className={`w-10 h-1 rounded ${
                    isDayOpt ? 'bg-black/20' : 'bg-white/20'
                  }`}
                />
              </div>
              <div className="p-2 flex-1 flex flex-col justify-center gap-1">
                <div
                  className={`w-3/4 h-1.5 rounded ${
                    isDayOpt ? 'bg-black/70' : 'bg-white/70'
                  }`}
                />
                <div
                  className={`w-1/2 h-1 rounded ${
                    isDayOpt ? 'bg-black/30' : 'bg-white/30'
                  }`}
                />
              </div>
            </div>

            <div className="mt-2 text-center">
              <span
                className={`text-xs font-semibold block ${
                  isDayTheme ? 'text-[#111111]' : 'text-white'
                }`}
              >
                {opt.name}
              </span>
              <span
                className={`text-[10px] block ${
                  isDayTheme ? 'text-black/50' : 'text-white/50'
                }`}
              >
                {isDayOpt ? 'Light background' : 'Standard dark'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Color circle selector rendering Ubuntu accent palette options.
 *
 * @param {Object} props
 * @param {string} props.accentColor - Currently active accent id
 * @param {Function} props.onSelectAccent - Accent selection callback
 * @param {boolean} props.isDayTheme - Whether Day theme is active
 */
function AccentSelector({ accentColor, onSelectAccent, isDayTheme }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {ACCENT_COLORS.map((accent) => {
        const isSelected = accentColor === accent.id;
        return (
          <button
            key={accent.id}
            type="button"
            onClick={() => onSelectAccent(accent.id)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none ${
              isSelected
                ? `ring-2 ring-ub-orange ring-offset-2 ${
                    isDayTheme ? 'ring-offset-[#f6f6f6]' : 'ring-offset-[#333333]'
                  } scale-110 shadow-sm`
                : 'opacity-90 hover:opacity-100'
            }`}
            style={{ backgroundColor: accent.color }}
            title={accent.name}
            aria-label={`Select ${accent.name} accent`}
            aria-pressed={isSelected}
          />
        );
      })}
    </div>
  );
}

/**
 * Wallpaper grid gallery for selecting desktop background.
 *
 * @param {Object} props
 * @param {string} props.currentWallpaper - Active wallpaper path
 * @param {Function} props.onChangeWallpaper - Wallpaper updater callback
 * @param {boolean} props.isDayTheme - Whether Day theme is active
 */
function WallpaperGallery({ currentWallpaper, onChangeWallpaper, isDayTheme }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                : isDayTheme
                ? 'border-black/10 hover:border-black/30'
                : 'border-white/10 hover:border-white/30'
            }`}
            aria-label={`Select ${wp.name} wallpaper`}
          >
            <div
              className={`w-full h-20 rounded bg-gradient-to-br ${wp.gradient} flex items-end p-2 relative shadow-inner overflow-hidden`}
            >
              <img
                src={encodeURI(wp.path)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 bg-ub-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow z-10">
                  Active
                </span>
              )}
            </div>
            <div className="mt-1.5 px-1 pb-1">
              <span
                className={`text-xs font-medium truncate block ${
                  isDayTheme ? 'text-[#111111]' : 'text-white/90'
                }`}
              >
                {wp.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders the GNOME Appearance settings panel.
 *
 * @param {Object} props
 * @param {string} props.currentWallpaper - Currently applied wallpaper path
 * @param {Function} props.onChangeWallpaper - Callback to update wallpaper
 * @returns {JSX.Element} Appearance panel
 */
export default function AppearanceSettings({ currentWallpaper, onChangeWallpaper }) {
  const { theme, setTheme, accentColor, setAccentColor, isDayTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-base font-semibold mb-1 ${
            isDayTheme ? 'text-[#111111]' : 'text-white'
          }`}
        >
          Style
        </h3>
        <p
          className={`text-xs mb-3 ${
            isDayTheme ? 'text-black/60' : 'text-white/60'
          }`}
        >
          Choose between Dark (Ubuntu standard) and Day (light background with dark typography).
        </p>
        <StyleSelector
          theme={theme}
          onSelectTheme={setTheme}
          isDayTheme={isDayTheme}
        />
      </div>

      <div
        className={`border-t pt-4 ${
          isDayTheme ? 'border-black/10' : 'border-white/10'
        }`}
      >
        <h3
          className={`text-base font-semibold mb-1 ${
            isDayTheme ? 'text-[#111111]' : 'text-white'
          }`}
        >
          Accent Color
        </h3>
        <p
          className={`text-xs mb-3 ${
            isDayTheme ? 'text-black/60' : 'text-white/60'
          }`}
        >
          Choose a highlight accent for controls, buttons, and desktop indicators.
        </p>
        <AccentSelector
          accentColor={accentColor}
          onSelectAccent={setAccentColor}
          isDayTheme={isDayTheme}
        />
      </div>

      <div
        className={`border-t pt-4 ${
          isDayTheme ? 'border-black/10' : 'border-white/10'
        }`}
      >
        <h3
          className={`text-base font-semibold mb-1 ${
            isDayTheme ? 'text-[#111111]' : 'text-white'
          }`}
        >
          Background
        </h3>
        <p
          className={`text-xs mb-3 ${
            isDayTheme ? 'text-black/60' : 'text-white/60'
          }`}
        >
          Select a wallpaper to customize your Ubuntu desktop surface.
        </p>
        <WallpaperGallery
          currentWallpaper={currentWallpaper}
          onChangeWallpaper={onChangeWallpaper}
          isDayTheme={isDayTheme}
        />
      </div>
    </div>
  );
}
