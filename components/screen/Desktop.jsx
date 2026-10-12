/**
 * @file components/screen/Desktop.jsx
 * @description Main desktop surface component managing wallpaper background,
 * desktop shortcut grid, window stacking and rendering, sidebar dock, and context menus.
 */

// 1. React / Next.js core
import React, { useState, useMemo, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import SideBar from './SideBar';
import StartMenu from './StartMenu';
import AllApplications from './AllApplications';
import DesktopShortcutsGrid from '../base/DesktopShortcutsGrid';
import DesktopWindows from '../base/DesktopWindows';
import DesktopContextMenu from '../base/DesktopContextMenu';
import Attribution from '../util/Attribution';

// 5. Project utilities, constants, config
import { WALLPAPERS_LIST } from '../../lib/constants';
import apps, { getDesktopApps } from '../../apps.config';

// 3. Component function definition
/**
 * Renders the interactive Ubuntu desktop workspace.
 *
 * @param {Object} props
 * @param {string} props.backgroundImage - Current wallpaper image path
 * @param {Function} props.changeBackgroundImage - Callback to update wallpaper
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Markdown content map
 * @param {boolean} [props.isStartMenuOpen=false] - Whether start menu is visible
 * @param {Function} [props.onCloseStartMenu] - Callback to dismiss start menu
 * @returns {JSX.Element} Desktop surface component
 */
export default function Desktop({
  backgroundImage,
  changeBackgroundImage,
  contentMap = {},
  isStartMenuOpen = false,
  onCloseStartMenu,
}) {
  const {
    openWindows,
    isMinimized,
    openApp,
    minimizeApp,
  } = useWindowManager();

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isAllAppsOpen, setIsAllAppsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });

  const desktopApps = useMemo(() => getDesktopApps(), []);

  // Filter list of open apps to render as Windows
  const openAppList = useMemo(() => {
    return apps.filter((app) => Boolean(openWindows[app.id]));
  }, [openWindows]);

  const desktopBackgroundStyle = useMemo(() => ({
    backgroundImage: backgroundImage
      ? `url(${backgroundImage}), linear-gradient(135deg, #77216F 0%, #5E2750 50%, #2C001E 100%)`
      : 'linear-gradient(135deg, #77216F 0%, #5E2750 50%, #2C001E 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }), [backgroundImage]);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const handleDesktopClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setSelectedAppId(null);
      if (isStartMenuOpen && onCloseStartMenu) {
        onCloseStartMenu();
      }
      if (isAllAppsOpen) {
        setIsAllAppsOpen(false);
      }
    }
    if (contextMenu.isOpen) {
      setContextMenu((prev) => ({ ...prev, isOpen: false }));
    }
  }, [contextMenu.isOpen, isStartMenuOpen, onCloseStartMenu, isAllAppsOpen]);

  const handleSelectShortcut = useCallback((event, appId) => {
    event.stopPropagation();
    setSelectedAppId(appId);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleToggleAllApps = useCallback(() => {
    if (isStartMenuOpen && onCloseStartMenu) {
      onCloseStartMenu();
    }
    setIsAllAppsOpen((prev) => !prev);
  }, [isStartMenuOpen, onCloseStartMenu]);

  const handleChangeWallpaperAction = useCallback(() => {
    const currentIndex = WALLPAPERS_LIST.indexOf(backgroundImage);
    const nextIndex = (currentIndex + 1) % WALLPAPERS_LIST.length;
    changeBackgroundImage(WALLPAPERS_LIST[nextIndex]);
    handleCloseContextMenu();
  }, [backgroundImage, changeBackgroundImage, handleCloseContextMenu]);

  const handleShowDesktop = useCallback(() => {
    openAppList.forEach((app) => {
      if (!isMinimized(app.id)) {
        minimizeApp(app.id);
      }
    });
    handleCloseContextMenu();
  }, [openAppList, isMinimized, minimizeApp, handleCloseContextMenu]);

  return (
    <main
      style={desktopBackgroundStyle}
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
      className="relative w-full h-[calc(100vh-1.75rem)] mt-7 overflow-hidden select-none"
      role="main"
      aria-label="Desktop Surface"
    >
      <SideBar
        isAllAppsOpen={isAllAppsOpen}
        toggleAllApps={handleToggleAllApps}
      />

      <DesktopShortcutsGrid
        apps={desktopApps}
        selectedAppId={selectedAppId}
        onSelect={handleSelectShortcut}
        onDoubleClick={openApp}
      />

      <DesktopWindows
        openApps={openAppList}
        contentMap={contentMap}
        changeBackgroundImage={changeBackgroundImage}
        currBgImgName={backgroundImage}
      />

      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={onCloseStartMenu}
      />

      <AllApplications
        isOpen={isAllAppsOpen}
        onClose={() => setIsAllAppsOpen(false)}
      />

      {contextMenu.isOpen && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onChangeWallpaper={handleChangeWallpaperAction}
          onOpenTerminal={() => openApp('terminal')}
          onOpenSettings={() => openApp('settings')}
          onShowDesktop={handleShowDesktop}
        />
      )}

      <Attribution />
    </main>
  );
}
