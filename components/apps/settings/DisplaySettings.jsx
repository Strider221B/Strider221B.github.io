/**
 * @file components/apps/settings/DisplaySettings.jsx
 * @description Displays screen resolution, orientation, and night light configuration.
 */

// 1. React / Next.js core
import React, { useState, useEffect } from 'react';

// 3. Component function definition
/**
 * Renders the display settings panel with screen resolution and scaling details.
 *
 * @returns {JSX.Element} Display panel
 */
export default function DisplaySettings() {
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
        <h3 className="text-base font-semibold text-white mb-1">Display</h3>
        <p className="text-xs text-white/60 mb-4">
          Virtual desktop monitor arrangement and rendering resolution.
        </p>

        <div className="bg-[#2B2B2B] rounded-lg border border-white/10 divide-y divide-white/10">
          <div className="p-3 flex items-center justify-between text-sm">
            <span className="text-white/80">Resolution</span>
            <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded text-white font-medium">
              {resolution} (16:9)
            </span>
          </div>
          <div className="p-3 flex items-center justify-between text-sm">
            <span className="text-white/80">Refresh Rate</span>
            <span className="text-xs text-white/60">60.00 Hz</span>
          </div>
          <div className="p-3 flex items-center justify-between text-sm">
            <span className="text-white/80">Orientation</span>
            <span className="text-xs text-white/60">Landscape</span>
          </div>
          <div className="p-3 flex items-center justify-between text-sm">
            <div>
              <span className="text-white/80 block">Night Light</span>
              <span className="text-[11px] text-white/50 block">Makes screen warmer to reduce eye strain</span>
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
