/**
 * @file components/apps/Trash.jsx
 * @description Nautilus file manager trash folder viewer with restore and empty capabilities.
 */

// 1. React / Next.js core
import React, { useState, useCallback } from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../hooks/useTheme';

// 4. Project components
import TrashToolbar from './trash/TrashToolbar';
import TrashEmptyState from './trash/TrashEmptyState';
import TrashItemRow from './trash/TrashItemRow';

// 2. Constants
const SAMPLE_TRASH_ITEMS = [
  {
    id: 'trash-1',
    name: 'old_portfolio_v1.zip',
    originalPath: '~/Downloads',
    dateDeleted: 'Yesterday',
    size: '14.2 MB',
  },
  {
    id: 'trash-2',
    name: 'deprecated_api_script.py',
    originalPath: '~/Projects/ml-pipelines',
    dateDeleted: '3 days ago',
    size: '8.4 KB',
  },
  {
    id: 'trash-3',
    name: 'debug_trace_2022.log',
    originalPath: '~/Documents',
    dateDeleted: '1 week ago',
    size: '42.1 KB',
  },
  {
    id: 'trash-4',
    name: 'scratch_notes.txt',
    originalPath: '~/Desktop',
    dateDeleted: '2 weeks ago',
    size: '1.2 KB',
  },
];

// 3. Component function definition
/**
 * Renders the Trash file manager window.
 *
 * @returns {JSX.Element} Interactive Trash window
 */
export default function Trash() {
  const { isDayTheme } = useTheme();
  const [items, setItems] = useState(SAMPLE_TRASH_ITEMS);
  const [selectedId, setSelectedId] = useState(null);

  const handleEmptyTrash = useCallback(() => {
    setItems([]);
    setSelectedId(null);
  }, []);

  const handleRestoreAll = useCallback(() => {
    setItems([]);
    setSelectedId(null);
  }, []);

  const handleRestore = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleDelete = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handlePopulateSamples = useCallback(() => {
    setItems(SAMPLE_TRASH_ITEMS);
  }, []);

  return (
    <div
      className={`h-full flex flex-col overflow-hidden select-none ${
        isDayTheme ? 'bg-white text-[#2e3436]' : 'bg-ub-cool-grey text-white'
      }`}
      role="region"
      aria-label="Trash Folder"
    >
      <TrashToolbar
        itemCount={items.length}
        onEmptyTrash={handleEmptyTrash}
        onRestoreAll={handleRestoreAll}
        isDayTheme={isDayTheme}
      />

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <TrashEmptyState onPopulateSamples={handlePopulateSamples} />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] uppercase tracking-wider ${
                  isDayTheme
                    ? 'border-black/10 text-black/50 bg-black/5'
                    : 'border-white/10 text-white/40'
                }`}
              >
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3 hidden sm:table-cell">Original Path</th>
                <th className="py-2 px-3">Deleted</th>
                <th className="py-2 px-3">Size</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <TrashItemRow
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onSelect={setSelectedId}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  isDayTheme={isDayTheme}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer
        className={`h-7 border-t px-3 flex items-center justify-between text-[11px] shrink-0 ${
          isDayTheme
            ? 'bg-[#EBEBEB] border-black/10 text-black/50'
            : 'bg-[#2B2B2B] border-white/10 text-white/50'
        }`}
      >
        <span>{items.length} {items.length === 1 ? 'item' : 'items'} in Trash</span>
        <span>384.2 GB available</span>
      </footer>
    </div>
  );
}
