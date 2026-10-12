/**
 * @file components/apps/Trash.jsx
 * @description System trash folder viewer application window.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the Trash file manager window.
 *
 * @returns {JSX.Element} Trash application window
 */
export default function Trash() {
  return (
    <div className="h-full bg-ub-cool-grey text-white p-6 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
        <svg className="w-8 h-8 fill-current text-white/50" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </div>
      <p className="text-base font-medium text-white/90">Trash is empty</p>
      <p className="text-xs text-white/50 mt-1">Deleted files will appear here</p>
    </div>
  );
}
