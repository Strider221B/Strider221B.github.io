/**
 * @file components/apps/settings/AboutSettings.jsx
 * @description System specs, device telemetry, and project attribution panel.
 */

// 1. React / Next.js core
import React from 'react';

// 5. Project utilities, constants, config
import { DEFAULT_USER_NAME, ATTRIBUTION_URL } from '../../../lib/constants';

// 2. Constants
const SYSTEM_SPECS = [
  { label: 'Device Name', value: 'strider-ubuntu-thinkpad' },
  { label: 'Memory', value: '16.0 GiB' },
  { label: 'Processor', value: 'Virtual JS Engine (x86_64)' },
  { label: 'Graphics', value: 'WebGL 2.0 Canvas Accelerators' },
  { label: 'Disk Capacity', value: '512 GB Virtual Storage' },
  { label: 'OS Name', value: 'Ubuntu 22.04.3 LTS' },
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-2 border-b border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ub-drk-abrgn via-ub-lite-abrgn to-ub-orange flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
          U
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Ubuntu 22.04 LTS</h3>
          <p className="text-xs text-white/60">Portfolio Edition by {DEFAULT_USER_NAME}</p>
        </div>
      </div>

      <div className="bg-[#2B2B2B] rounded-lg border border-white/10 divide-y divide-white/10">
        {SYSTEM_SPECS.map((spec) => (
          <div key={spec.label} className="p-3 flex items-center justify-between text-sm">
            <span className="text-white/80">{spec.label}</span>
            <span className="text-xs text-white/60 font-mono">{spec.value}</span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-white/70">
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
