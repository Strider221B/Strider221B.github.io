/**
 * @file components/base/DesktopShortcutsGrid.jsx
 * @description Renders desktop shortcut icon grid with positioning and selection handling.
 */

// 1. React / Next.js core
import React from 'react';

// 4. Project components
import DesktopShortcut from './DesktopShortcut';

// 3. Component function definition
/**
 * Renders the desktop shortcut icon column container.
 *
 * @param {Object} props
 * @param {Array<Object>} props.apps - List of desktop application configurations
 * @param {string|null} props.selectedAppId - Currently selected app ID
 * @param {Function} props.onSelect - Selection click handler
 * @param {Function} props.onDoubleClick - Double-click activation handler
 * @returns {JSX.Element} Shortcut grid container
 */
export default function DesktopShortcutsGrid({
  apps,
  selectedAppId,
  onSelect,
  onDoubleClick,
}) {
  return (
    <div className="absolute top-4 left-16 flex flex-col flex-wrap gap-2 p-2 max-h-[calc(100%-2rem)] z-10 pointer-events-auto">
      {apps.map((app) => (
        <DesktopShortcut
          key={app.id}
          id={app.id}
          title={app.title}
          icon={app.icon}
          isSelected={selectedAppId === app.id}
          onSelect={(e) => onSelect(e, app.id)}
          onDoubleClick={() => onDoubleClick(app.id)}
        />
      ))}
    </div>
  );
}
