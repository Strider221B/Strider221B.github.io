/**
 * @file components/apps/trash/TrashEmptyState.jsx
 * @description Empty state placeholder graphic and restore action for Nautilus Trash.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the empty trash placeholder illustration and reset trigger.
 *
 * @param {Object} props
 * @param {Function} props.onPopulateSamples - Callback to refill sample items
 * @returns {JSX.Element} Empty state view
 */
export default function TrashEmptyState({ onPopulateSamples }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
        <svg className="w-8 h-8 fill-current text-white/40" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-white/90">Trash is empty</p>
      <p className="text-xs text-white/50 mt-1 max-w-xs">
        Deleted files and folders will appear here until permanently erased.
      </p>
      <button
        type="button"
        onClick={onPopulateSamples}
        className="mt-4 px-3 py-1.5 text-xs rounded bg-ub-orange hover:bg-orange-600 active:bg-orange-700 text-white font-medium transition-colors shadow-sm"
      >
        Restore Sample Files
      </button>
    </div>
  );
}
