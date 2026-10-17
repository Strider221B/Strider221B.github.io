/**
 * @file components/apps/settings/SettingsNav.jsx
 * @description Left sidebar navigation tabs for GNOME Control Center.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../../hooks/useTheme';

// 2. Constants
const NAV_ITEMS = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.57 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
      </svg>
    ),
  },
  {
    id: 'displays',
    label: 'Displays',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
  },
];

// 3. Component function definition
/**
 * Renders the Settings navigation sidebar.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab identifier
 * @param {Function} props.onSelectTab - Callback to switch active tab
 * @returns {JSX.Element} Settings navigation menu
 */
export default function SettingsNav({ activeTab, onSelectTab }) {
  const { isDayTheme } = useTheme();

  return (
    <nav
      className={`w-full sm:w-44 md:w-52 border-b sm:border-b-0 sm:border-r p-2 shrink-0 flex flex-row sm:flex-col gap-1 select-none overflow-x-auto ${
        isDayTheme
          ? 'bg-[#EBEBEB] border-black/10 text-[#2e3436]'
          : 'bg-[#2B2B2B] border-white/10 text-white'
      }`}
      aria-label="Settings categories"
    >
      <div
        className={`hidden sm:block px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
          isDayTheme ? 'text-black/50' : 'text-white/50'
        }`}
      >
        Settings
      </div>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
              isActive
                ? 'bg-ub-orange text-white shadow-sm'
                : isDayTheme
                ? 'text-black/80 hover:bg-black/5 active:bg-black/10'
                : 'text-white/80 hover:bg-white/10 active:bg-white/15'
            }`}
            aria-selected={isActive}
            role="tab"
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
