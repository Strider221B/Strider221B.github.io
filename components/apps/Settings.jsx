/**
 * @file components/apps/Settings.jsx
 * @description GNOME Control Center application for desktop appearance, displays, and system details.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useCallback } from 'react';

// 3. Project contexts and hooks
import { useTheme } from '../../hooks/useTheme';

// 4. Project components
import SettingsNav from './settings/SettingsNav';
import AppearanceSettings from './settings/AppearanceSettings';
import DisplaySettings from './settings/DisplaySettings';
import AboutSettings from './settings/AboutSettings';

// 5. Project utilities, constants, config
import { DEFAULT_WALLPAPER, STORAGE_KEYS } from '../../lib/constants';

// 3. Component function definition
/**
 * Renders the GNOME Settings Control Center window.
 *
 * @param {Object} props
 * @param {Function} [props.changeBackgroundImage] - Callback to update wallpaper
 * @param {string} [props.currBgImgName] - Current active wallpaper path
 * @param {string} [props.initialTab='appearance'] - Active settings category
 * @returns {JSX.Element} Settings application window
 */
export default function Settings({
  changeBackgroundImage,
  currBgImgName = DEFAULT_WALLPAPER,
  initialTab = 'appearance',
}) {
  const { isDayTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentWallpaper, setCurrentWallpaper] = useState(currBgImgName);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (currBgImgName) {
      setCurrentWallpaper(currBgImgName);
    }
  }, [currBgImgName]);

  const handleChangeWallpaper = useCallback((wallpaperPath) => {
    setCurrentWallpaper(wallpaperPath);
    if (changeBackgroundImage) {
      changeBackgroundImage(wallpaperPath);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WALLPAPER, wallpaperPath);
    } catch {
      // LocalStorage error handling for sandboxed environments
    }
  }, [changeBackgroundImage]);

  return (
    <div
      className={`h-full flex flex-col sm:flex-row overflow-hidden select-none ${
        isDayTheme ? 'bg-[#F6F6F6] text-[#2e3436]' : 'bg-[#333333] text-white'
      }`}
      role="region"
      aria-label="System Settings"
    >
      <SettingsNav activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6" role="tabpanel">
        {activeTab === 'appearance' && (
          <AppearanceSettings
            currentWallpaper={currentWallpaper}
            onChangeWallpaper={handleChangeWallpaper}
          />
        )}
        {activeTab === 'displays' && <DisplaySettings />}
        {activeTab === 'about' && <AboutSettings />}
      </main>
    </div>
  );
}
