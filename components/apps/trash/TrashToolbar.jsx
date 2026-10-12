/**
 * @file components/apps/trash/TrashToolbar.jsx
 * @description Nautilus file manager top breadcrumb and bulk action toolbar for Trash.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the Trash header toolbar.
 *
 * @param {Object} props
 * @param {number} props.itemCount - Count of items in the trash
 * @param {Function} props.onEmptyTrash - Callback to empty trash
 * @param {Function} props.onRestoreAll - Callback to restore all items
 * @returns {JSX.Element} Toolbar bar
 */
export default function TrashToolbar({
  itemCount,
  onEmptyTrash,
  onRestoreAll,
}) {
  return (
    <header className="h-11 bg-[#2B2B2B] border-b border-white/10 px-4 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>Home</span>
        <span>/</span>
        <span className="text-white font-medium">Trash</span>
      </div>

      <div className="flex items-center gap-2">
        {itemCount > 0 && (
          <>
            <button
              type="button"
              onClick={onRestoreAll}
              className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 active:bg-white/25 text-white transition-colors"
            >
              Restore All
            </button>
            <button
              type="button"
              onClick={onEmptyTrash}
              className="px-2.5 py-1 text-xs rounded bg-red-600/80 hover:bg-red-600 active:bg-red-700 text-white font-medium transition-colors"
            >
              Empty Trash
            </button>
          </>
        )}
      </div>
    </header>
  );
}
