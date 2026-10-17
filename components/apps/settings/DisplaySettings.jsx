/**
 * @file components/apps/settings/DisplaySettings.jsx
 * @description Displays screen resolution, orientation, and night light configuration.
 */

// 1. React / Next.js core
import React, { useState, useEffect } from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../../hooks/useTheme';

// 3. Component function definition
/**
 * Renders the display settings panel with screen resolution and scaling details.
 *
 * @returns {JSX.Element} Display panel
 */
export default function DisplaySettings() {
  const { isDayTheme } = useTheme();
  const [resolution, setResolution] = useState('1920 x 1080');
  const [isNightLightOn, setIsNightLightOn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setResolution(`${window.innerWidth} x ${window.innerHeight}`);
      const handleResize = () => setResolution(`${window.innerWidth} x ${window.innerHeight}`);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-base font-semibold mb-1 ${isDayTheme ? 'text-[#111111]' : 'text-white'}`}>
          Display
        </h3>
        <p className={`text-xs mb-4 ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>
          Virtual desktop monitor arrangement and rendering resolution.
        </p>

        <div
          className={`rounded-lg border divide-y ${
            isDayTheme
              ? 'bg-[#EBEBEB] border-black/10 divide-black/10'
              : 'bg-[#2B2B2B] border-white/10 divide-white/10'
          }`}
        >
          <div className="p-3 flex items-center justify-between text-sm">
            <span className={isDayTheme ? 'text-black/80' : 'text-white/80'}>Resolution</span>
            <span
              className={`font-mono text-xs px-2 py-1 rounded font-medium ${
                isDayTheme ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
              }`}
            >
              {resolution} (16:9)
            </span>
          </div>
          <div className="p-3 flex items-center justify-between text-sm">
            <span className={isDayTheme ? 'text-black/80' : 'text-white/80'}>Refresh Rate</span>
            <span className={`text-xs ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>60.00 Hz</span>
          </div>
          <div className="p-3 flex items-center justify-between text-sm">
            <span className={isDayTheme ? 'text-black/80' : 'text-white/80'}>Orientation</span>
            <span className={`text-xs ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>Landscape</span>
          </div>
          <div className="p-3 flex items-center justify-between text-sm">
            <div>
              <span className={`block ${isDayTheme ? 'text-black/80' : 'text-white/80'}`}>Night Light</span>
              <span className={`text-[11px] block ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>
                Makes screen warmer to reduce eye strain
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsNightLightOn((prev) => !prev)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-ub-orange ${
                isNightLightOn ? 'bg-ub-orange' : 'bg-white/20'
              }`}
              aria-label="Toggle Night Light"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  isNightLightOn ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
