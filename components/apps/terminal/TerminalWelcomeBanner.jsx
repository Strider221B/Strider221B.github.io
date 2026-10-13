/**
 * @file components/apps/terminal/TerminalWelcomeBanner.jsx
 * @description Header welcome splash displayed on initial terminal launch.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the terminal welcome banner and initial release header.
 *
 * @returns {JSX.Element} Welcome banner markup
 */
export default function TerminalWelcomeBanner() {
  return (
    <div className="mb-4 text-xs text-white/80 space-y-1">
      <p className="text-white font-semibold text-sm">
        Welcome to Ubuntu 26.04.1 LTS (GNU/Linux 5.15.0-89-generic x86_64)
      </p>
      <p className="text-white/60">
        * Portfolio Shell: Somesh Chatterjee (@Strider221B)
      </p>
      <p className="text-white/60">
        * Type <span className="text-ubt-green font-bold">&apos;help&apos;</span> to view commands, or <span className="text-ub-orange font-bold">&apos;apps&apos;</span> to explore system applications.
      </p>
    </div>
  );
}
