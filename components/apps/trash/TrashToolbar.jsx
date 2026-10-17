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
  isDayTheme,
}) {
  return (
    <header
      className={`h-11 border-b px-4 flex items-center justify-between shrink-0 select-none ${
        isDayTheme ? 'bg-[#F0F0F0] border-black/10 text-[#2e3436]' : 'bg-[#2B2B2B] border-white/10 text-white'
      }`}
    >
      <div className={`flex items-center gap-2 text-xs ${isDayTheme ? 'text-black/70' : 'text-white/70'}`}>
        <span>Home</span>
        <span>/</span>
        <span className={`font-medium ${isDayTheme ? 'text-[#111111]' : 'text-white'}`}>Trash</span>
      </div>

      <div className="flex items-center gap-2">
        {itemCount > 0 && (
          <>
            <button
              type="button"
              onClick={onRestoreAll}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                isDayTheme
                  ? 'bg-black/5 hover:bg-black/10 active:bg-black/15 text-black/80'
                  : 'bg-white/10 hover:bg-white/20 active:bg-white/25 text-white'
              }`}
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
