/**
 * @file components/apps/trash/TrashItemRow.jsx
 * @description Single deleted file entry row with restoration and deletion actions.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders an individual trash file item row.
 *
 * @param {Object} props
 * @param {Object} props.item - Trash item descriptor
 * @param {boolean} props.isSelected - Selection state
 * @param {Function} props.onSelect - Item selection callback
 * @param {Function} props.onRestore - Restore item callback
 * @param {Function} props.onDelete - Delete item callback
 * @returns {JSX.Element} Table row for deleted item
 */
export default function TrashItemRow({
  item,
  isSelected,
  onSelect,
  onRestore,
  onDelete,
  isDayTheme,
}) {
  return (
    <tr
      onClick={() => onSelect(item.id)}
      className={`border-b cursor-pointer text-xs select-none transition-colors ${
        isDayTheme
          ? isSelected
            ? 'bg-ub-orange/20 text-[#111111] border-black/10'
            : 'text-black/80 hover:bg-black/5 border-black/5'
          : isSelected
          ? 'bg-ub-orange/20 text-white border-white/5'
          : 'text-white/80 hover:bg-white/5 border-white/5'
      }`}
    >
      <td className="py-2.5 px-3 flex items-center gap-2 font-medium">
        <span className="text-base" aria-hidden="true">📄</span>
        <span className="truncate max-w-[140px] sm:max-w-none">{item.name}</span>
      </td>
      <td className={`py-2.5 px-3 hidden sm:table-cell ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>{item.originalPath}</td>
      <td className={`py-2.5 px-3 ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>{item.dateDeleted}</td>
      <td className={`py-2.5 px-3 font-mono ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>{item.size}</td>
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRestore(item.id);
            }}
            className={`p-1 rounded ${
              isDayTheme
                ? 'hover:bg-black/10 text-black/70 hover:text-black'
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
            title="Restore item"
            aria-label={`Restore ${item.name}`}
          >
            ↩
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
            title="Delete permanently"
            aria-label={`Delete ${item.name} permanently`}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
