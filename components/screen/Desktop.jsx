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
import { WALLPAPERS_LIST, getWallpaperStyle } from '../../lib/constants';
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
  terminalBootProps = {},
}) {
  const {
    openWindows,
    isMinimized,
    openApp,
    minimizeApp,
  } = useWindowManager();

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isAllAppsOpen, setIsAllAppsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });

  const desktopApps = useMemo(() => getDesktopApps(), []);

  // Filter list of open apps to render as Windows (including dynamic blog articles)
  const openAppList = useMemo(() => {
    const list = apps
      .filter((app) => Boolean(openWindows[app.id]))
      .map((app) => {
        if (app.id === 'reader' && terminalBootProps?.initialBootSlug) {
          const cat = terminalBootProps.initialBootCategory || '';
          const slug = terminalBootProps.initialBootSlug || '';

          let matchedPost = null;
          if (contentMap && contentMap[cat]) {
            matchedPost = contentMap[cat].find((p) => p.slug === slug);
          }

          if (!matchedPost && terminalBootProps) {
            matchedPost = {
              title: terminalBootProps.initialTitle || slug,
              slug,
              category: cat,
              rawContent: terminalBootProps.initialContent,
              htmlContent: terminalBootProps.initialHtmlContent || '',
            };
          }

          return {
            ...app,
            title: matchedPost?.title || terminalBootProps.initialTitle || app.title,
            componentProps: {
              ...app.componentProps,
              post: matchedPost,
              title: matchedPost?.title || terminalBootProps.initialTitle,
              contentPath: `${cat}/${slug}`,
              rawContent: terminalBootProps.initialContent,
              htmlContent:
                matchedPost?.articleHtml ||
                matchedPost?.htmlContent ||
                terminalBootProps.initialHtmlContent,
              contentMap,
            },
          };
        }
        return app;
      });

    // Include dynamically opened article windows
    Object.keys(openWindows).forEach((appId) => {
      if (openWindows[appId] && !apps.some((app) => app.id === appId)) {
        if (appId.startsWith('post-')) {
          // If reader is already open and showing this post, prevent duplicate window
          if (
            openWindows['reader'] &&
            terminalBootProps?.initialBootSlug &&
            (appId === `post-${terminalBootProps.initialBootCategory}-${terminalBootProps.initialBootSlug}` ||
              appId === `post-${terminalBootProps.initialBootSlug}`)
          ) {
            return;
          }

          let matchedPost = null;
          let matchedCategory = '';

          // 1. Check current active deep-linked article
          if (terminalBootProps?.initialBootSlug) {
            const bootCat = terminalBootProps.initialBootCategory || '';
            const bootSlug = terminalBootProps.initialBootSlug || '';
            if (appId === `post-${bootCat}-${bootSlug}` || appId === `post-${bootSlug}`) {
              matchedCategory = bootCat;
              matchedPost = {
                title: terminalBootProps.initialTitle || bootSlug,
                slug: bootSlug,
                category: bootCat,
                rawContent: terminalBootProps.initialContent,
                htmlContent: terminalBootProps.initialHtmlContent || '',
              };
            }
          }

          // 2. Check contentMap
          if (!matchedPost && contentMap) {
            for (const [cat, posts] of Object.entries(contentMap)) {
              if (Array.isArray(posts)) {
                const found = posts.find(
                  (p) => `post-${cat}-${p.slug}` === appId || `post-${p.slug}` === appId
                );
                if (found) {
                  matchedPost = found;
                  matchedCategory = cat;
                  break;
                }
              }
            }
          }

          if (matchedPost) {
            list.push({
              id: appId,
              title: matchedPost.title || 'Article',
              icon: '/themes/Yaru/apps/reader.png',
              type: 'window',
              component: 'MarkdownViewer',
              componentProps: {
                post: matchedPost,
                htmlContent: matchedPost.articleHtml || matchedPost.htmlContent,
                title: matchedPost.title,
                contentPath: `${matchedCategory}/${matchedPost.slug}`,
                contentMap,
              },
            });
          }
        }
      }
    });

    return list;
  }, [openWindows, contentMap, terminalBootProps]);

  const desktopBackgroundStyle = useMemo(
    () => getWallpaperStyle(backgroundImage),
    [backgroundImage]
  );

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

  const handleOpenChangeBackground = useCallback(() => {
    setSettingsTab('appearance');
    openApp('settings');
    handleCloseContextMenu();
  }, [openApp, handleCloseContextMenu]);

  const handleOpenDisplaySettings = useCallback(() => {
    setSettingsTab('displays');
    openApp('settings');
    handleCloseContextMenu();
  }, [openApp, handleCloseContextMenu]);

  const handleOpenTerminal = useCallback(() => {
    openApp('terminal');
    handleCloseContextMenu();
  }, [openApp, handleCloseContextMenu]);

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
      className="relative w-full h-[calc(100vh-1.75rem)] [@supports(height:100dvh)]:h-[calc(100dvh-1.75rem)] mt-7 overflow-hidden select-none"
      role="main"
      aria-label="Desktop Surface"
    >
      <h1 className="sr-only">Somesh Chatterjee - Ubuntu 26.04.1 LTS Desktop Portfolio</h1>

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
        settingsTab={settingsTab}
        terminalBootProps={terminalBootProps}
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
          onChangeWallpaper={handleOpenChangeBackground}
          onOpenTerminal={handleOpenTerminal}
          onOpenSettings={handleOpenDisplaySettings}
          onShowDesktop={handleShowDesktop}
        />
      )}

      <Attribution />
    </main>
  );
}
