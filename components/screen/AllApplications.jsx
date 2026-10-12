/**
 * @file components/screen/AllApplications.jsx
 * @description Full-screen GNOME application drawer overlay featuring real-time
 * search filtering, category tabs, and interactive grid launcher for all installed applications.
 */

// 1. React / Next.js core
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import AllApplicationsItem from '../base/AllApplicationsItem';

// 5. Project utilities, constants, config
import defaultApps from '../../apps.config';

// 2. Constants
const TAB_ALL = 'all';
const TAB_FREQUENT = 'frequent';

// ─── HELPER SUB-COMPONENTS (< 30 lines each) ────────────────────────

/**
 * Centered search input bar with search icon and reset button.
 */
function AllAppsSearchBar({ searchQuery, onSearchChange, onClearSearch }) {
  return (
    <div className="relative w-full max-w-md mb-6">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Type to search..."
        autoFocus
        className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 text-sm rounded-full pl-10 pr-10 py-2.5 transition-all outline-none focus:ring-2 focus:ring-ub-orange/80 border border-white/10"
        aria-label="Search applications"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={onClearSearch}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/50 hover:text-white"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Category navigation pill tabs ("Frequent" vs "All").
 */
function AllAppsCategoryTabs({ activeTab, onTabSelect }) {
  return (
    <div className="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-full border border-white/10">
      <button
        type="button"
        onClick={() => onTabSelect(TAB_FREQUENT)}
        className={`px-4 py-1 rounded-full text-xs font-medium transition-colors ${
          activeTab === TAB_FREQUENT ? 'bg-ub-orange text-white shadow-sm' : 'text-white/70 hover:text-white'
        }`}
      >
        Frequent
      </button>
      <button
        type="button"
        onClick={() => onTabSelect(TAB_ALL)}
        className={`px-4 py-1 rounded-full text-xs font-medium transition-colors ${
          activeTab === TAB_ALL ? 'bg-ub-orange text-white shadow-sm' : 'text-white/70 hover:text-white'
        }`}
      >
        All
      </button>
    </div>
  );
}

/**
 * Empty search results feedback display.
 */
function EmptySearchResults({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-white/50">
      <span className="text-4xl mb-3">🔍</span>
      <p className="text-sm font-medium">No applications found matching &quot;{query}&quot;</p>
      <span className="text-xs text-white/30 mt-1">Try searching by app name</span>
    </div>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders the full-workspace applications grid launcher overlay.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Whether application drawer is open
 * @param {Function} props.onClose - Callback to close application drawer
 * @param {Array<Object>} [props.appsList=defaultApps] - Applications registry list
 * @returns {JSX.Element|null} All applications drawer component
 */
export default function AllApplications({
  isOpen = false,
  onClose,
  appsList = defaultApps,
}) {
  const { openWindows, openApp } = useWindowManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(TAB_ALL);
  const containerRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search and tab on modal open/close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveTab(TAB_ALL);
    }
  }, [isOpen]);

  // Filter application list based on active tab and search query
  const filteredApps = useMemo(() => {
    const enabledApps = appsList.filter((app) => !app.disabled);
    let list = enabledApps;

    if (activeTab === TAB_FREQUENT && !searchQuery.trim()) {
      list = enabledApps.filter((app) => Boolean(app.favourite));
    }

    if (!searchQuery.trim()) {
      return list;
    }

    const query = searchQuery.toLowerCase().trim();
    return enabledApps.filter((app) => {
      const matchTitle = app.title?.toLowerCase().includes(query);
      const matchId = app.id?.toLowerCase().includes(query);
      return matchTitle || matchId;
    });
  }, [appsList, activeTab, searchQuery]);

  const handleLaunchApp = useCallback((appId) => {
    openApp(appId);
    onClose();
  }, [openApp, onClose]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onClick={handleBackdropClick}
      className="fixed top-7 left-14 right-0 bottom-0 z-30 bg-black/85 backdrop-blur-xl flex flex-col items-center select-none overflow-y-auto px-4 py-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Applications Launcher"
    >
      <div className="w-full max-w-4xl flex flex-col items-center">
        <AllAppsSearchBar
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClearSearch={() => setSearchQuery('')}
        />

        {!searchQuery.trim() && (
          <AllAppsCategoryTabs
            activeTab={activeTab}
            onTabSelect={setActiveTab}
          />
        )}

        {filteredApps.length === 0 ? (
          <EmptySearchResults query={searchQuery} />
        ) : (
          <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 pt-2 pb-12">
            {filteredApps.map((app) => (
              <AllApplicationsItem
                key={app.id}
                id={app.id}
                title={app.title}
                icon={app.icon}
                isOpen={Boolean(openWindows[app.id])}
                onClick={() => handleLaunchApp(app.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
