/**
 * @file components/apps/settings/AboutSettings.jsx
 * @description System specs, device telemetry, and project attribution panel.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../../hooks/useTheme';

// 5. Project utilities, constants, config
import { DEFAULT_USER_NAME, ATTRIBUTION_URL, REPO_URL } from '../../../lib/constants';

// 2. Constants
const SYSTEM_SPECS = [
  { label: 'Device Name', value: 'strider-ubuntu-thinkpad' },
  { label: 'Memory', value: '16.0 GiB' },
  { label: 'Processor', value: 'Virtual JS Engine (x86_64)' },
  { label: 'Graphics', value: 'WebGL 2.0 Canvas Accelerators' },
  { label: 'Disk Capacity', value: '512 GB Virtual Storage' },
  { label: 'OS Name', value: 'Ubuntu 26.04.1 LTS' },
  { label: 'OS Type', value: '64-bit' },
  { label: 'GNOME Version', value: '42.0' },
  { label: 'Windowing System', value: 'Wayland / React DOM' },
];

// 3. Component function definition
/**
 * Renders the About System specification card.
 *
 * @returns {JSX.Element} About system panel
 */
export default function AboutSettings() {
  const { isDayTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-4 pb-2 border-b ${isDayTheme ? 'border-black/10' : 'border-white/10'}`}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ub-drk-abrgn via-ub-lite-abrgn to-ub-orange flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
          U
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isDayTheme ? 'text-[#111111]' : 'text-white'}`}>
            Ubuntu 26.04.1 LTS
          </h3>
          <p className={`text-xs ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>
            Portfolio Edition by {DEFAULT_USER_NAME}
          </p>
        </div>
      </div>

      <div
        className={`rounded-lg border divide-y ${
          isDayTheme
            ? 'bg-[#EBEBEB] border-black/10 divide-black/10'
            : 'bg-[#2B2B2B] border-white/10 divide-white/10'
        }`}
      >
        {SYSTEM_SPECS.map((spec) => (
          <div key={spec.label} className="p-3 flex items-center justify-between text-sm">
            <span className={isDayTheme ? 'text-black/80' : 'text-white/80'}>{spec.label}</span>
            <span className={`text-xs font-mono ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
          isDayTheme
            ? 'bg-black/5 border-black/10 text-black/70'
            : 'bg-white/5 border-white/10 text-white/70'
        }`}
      >
        <p>
          Repository:{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ub-orange underline hover:text-orange-400"
          >
            github.com/Strider221B/Strider221B.github.io
          </a>
        </p>
        <p>
          Inspired by the original open-source Ubuntu web simulation by Vivek Patel.{' '}
          <a
            href={ATTRIBUTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ub-orange underline hover:text-orange-400"
          >
            GitHub Project
          </a>
        </p>
      </div>
    </div>
  );
}
