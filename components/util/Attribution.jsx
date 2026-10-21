/**
 * @file components/util/Attribution.jsx
 * @description Persistent attribution badge recognizing Vivek Patel's Ubuntu portfolio design inspiration.
 */

// 1. React / Next.js core
import React from 'react';

// 5. Project utilities, constants, config
import { ATTRIBUTION_URL } from '../../lib/constants';

// 2. Constants (File-scoped)
const ATTRIBUTION_TEXT = "Inspired by vivek9patel's Ubuntu Simulation";
const ATTRIBUTION_ARIA_LABEL =
  "Visit vivek9patel's original Ubuntu simulation repository on GitHub (opens in a new tab)";

// 3. Component function definition
/**
 * Renders the Vivek Patel portfolio attribution link on the desktop surface.
 *
 * @returns {JSX.Element} Attribution link anchor element
 */
export default function Attribution() {
  return (
    <a
      id="desktop-attribution-link"
      href={ATTRIBUTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ATTRIBUTION_ARIA_LABEL}
      className="absolute bottom-1.5 right-2 z-0 text-[11px] font-normal text-white/50 hover:text-white/90 bg-black/30 hover:bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 hover:border-white/30 transition-all select-none focus:outline-none focus:ring-1 focus:ring-ub-orange focus:text-white/90 shadow-sm"
    >
      {ATTRIBUTION_TEXT}
    </a>
  );
}
