/**
 * @file components/base/DesktopWindows.jsx
 * @description Renders all currently open application windows, mapping each to its
 * registered view component inside an interactive Window frame.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import Window from './Window';

// 5. Project utilities, constants, config
import { getComponent } from '../../lib/componentRegistry';

// 3. Component function definition
/**
 * Renders open application windows for the desktop surface.
 *
 * @param {Object} props
 * @param {Array<Object>} props.openApps - List of active application configs
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Markdown content map
 * @returns {JSX.Element} Fragment rendering open windows
 */
export default function DesktopWindows({ openApps, contentMap = {} }) {
  const {
    isFocused,
    isMinimized,
    isMaximized,
    getZIndex,
    closeApp,
    minimizeApp,
    toggleMaximize,
    focusApp,
  } = useWindowManager();

  const renderAppContent = (app) => {
    const Component = getComponent(app.component);
    if (!Component) {
      return (
        <div className="p-6 text-white text-center">
          <p className="text-lg font-semibold">{app.title}</p>
          <p className="text-sm text-white/60 mt-1">Application loading...</p>
        </div>
      );
    }
    return <Component {...app.componentProps} contentMap={contentMap} />;
  };

  return (
    <>
      {openApps.map((app) => (
        <Window
          key={app.id}
          appId={app.id}
          title={app.title}
          icon={app.icon}
          isFocused={isFocused(app.id)}
          isMinimized={isMinimized(app.id)}
          isMaximized={isMaximized(app.id)}
          zIndex={getZIndex(app.id)}
          onClose={() => closeApp(app.id)}
          onMinimize={() => minimizeApp(app.id)}
          onMaximize={() => toggleMaximize(app.id)}
          onFocus={() => focusApp(app.id)}
        >
          {renderAppContent(app)}
        </Window>
      ))}
    </>
  );
}
