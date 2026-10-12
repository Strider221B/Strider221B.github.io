/**
 * @file components/util/Attribution.jsx
 * @description Persistent attribution link recognizing Vivek Patel's Ubuntu portfolio design inspiration.
 */

// 1. React / Next.js core
import React from 'react';

// 5. Project utilities, constants, config
import { ATTRIBUTION_URL } from '../../lib/constants';

// 3. Component function definition
/**
 * Renders the Vivek Patel portfolio attribution link in the bottom-right corner.
 *
 * @returns {JSX.Element} Attribution link anchor
 */
export default function Attribution() {
  return (
    <a
      href={ATTRIBUTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-1 right-2 text-xs text-white/40 hover:text-white/70 transition-colors z-50 select-none"
    >
      Inspired by vivek9patel&apos;s Ubuntu Simulation
    </a>
  );
}
