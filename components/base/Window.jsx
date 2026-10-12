/**
 * @file components/base/Window.jsx
 * @description Draggable, resizable application window shell with focus stacking,
 * maximize/minimize toggles, and integrated header controls.
 */

// 1. React / Next.js core
import React, { useRef, useState, useEffect } from 'react';

// 2. Third-party libraries
import Draggable from 'react-draggable';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import WindowTitleBar from './WindowTitleBar';

// 5. Project utilities, constants, config
import { Z_INDEX_BASE } from '../../lib/constants';

// 2. Constants
const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 480;
const MIN_WINDOW_WIDTH = 340;
const MIN_WINDOW_HEIGHT = 220;
const DEFAULT_POSITION = { x: 90, y: 40 };
const MOBILE_DEFAULT_POSITION = { x: 10, y: 10 };
const MOBILE_BREAKPOINT = 640;

// ─── HELPER SUB-COMPONENT ───────────────────────────────────────────
/**
 * Edge and corner handles for interactive window resizing.
 *
 * @param {Object} props
 * @param {Function} props.onResizeStart - Resize initiation handler
 */
function WindowResizeHandles({ onResizeStart }) {
  return (
    <>
      <div
        className="window-y-border absolute right-0 top-1 bottom-1 w-2 cursor-e-resize z-20"
        onMouseDown={(e) => onResizeStart('e', e)}
        aria-hidden="true"
      />
      <div
        className="window-x-border absolute bottom-0 left-1 right-1 h-2 cursor-s-resize z-20"
        onMouseDown={(e) => onResizeStart('s', e)}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize z-30"
        onMouseDown={(e) => onResizeStart('se', e)}
        aria-hidden="true"
      />
    </>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────
/**
 * Renders an interactive draggable, resizable application window frame.
 *
 * @param {Object} props
 * @param {string} props.appId - Application unique identifier
 * @param {string} props.title - Window title bar text
 * @param {string} [props.icon] - Application icon image path
 * @param {React.ReactNode} props.children - Child app component
 * @param {boolean} [props.isFocused] - Optional focus override
 * @param {boolean} [props.isMinimized] - Optional minimized override
 * @param {boolean} [props.isMaximized] - Optional maximized override
 * @param {number} [props.zIndex] - Optional z-index override
 * @param {Function} [props.onClose] - Optional close override
 * @param {Function} [props.onMinimize] - Optional minimize override
 * @param {Function} [props.onMaximize] - Optional maximize override
 * @param {Function} [props.onFocus] - Optional focus override
 * @returns {JSX.Element} Interactive window shell
 */
export default function Window({
  appId,
  title,
  icon,
  children,
  ...customProps
}) {
  const nodeRef = useRef(null);
  const wm = useWindowManager();

  const isFocused = customProps.isFocused ?? (wm ? wm.isFocused(appId) : true);
  const isMinimized = customProps.isMinimized ?? (wm ? wm.isMinimized(appId) : false);
  const isMaximized = customProps.isMaximized ?? (wm ? wm.isMaximized(appId) : false);
  const zIndex = customProps.zIndex ?? (wm ? wm.getZIndex(appId) : Z_INDEX_BASE);
  const onClose = customProps.onClose ?? (() => wm?.closeApp(appId));
  const onMinimize = customProps.onMinimize ?? (() => wm?.minimizeApp(appId));
  const onMaximize = customProps.onMaximize ?? (() => wm?.toggleMaximize(appId));
  const onFocus = customProps.onFocus ?? (() => wm?.focusApp(appId));

  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT) {
      setPosition(MOBILE_DEFAULT_POSITION);
      setSize({
        width: Math.max(MIN_WINDOW_WIDTH, window.innerWidth - 20),
        height: Math.max(MIN_WINDOW_HEIGHT, Math.floor(window.innerHeight * 0.7)),
      });
    }
  }, []);

  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleResizeStart = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { width: startW, height: startH } = size;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setSize({
        width: direction === 's' ? startW : Math.max(MIN_WINDOW_WIDTH, startW + deltaX),
        height: direction === 'e' ? startH : Math.max(MIN_WINDOW_HEIGHT, startH + deltaY),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const windowClasses = isMaximized
    ? 'fixed top-7 left-0 sm:left-14 right-0 bottom-0 flex flex-col bg-ub-grey overflow-hidden shadow-2xl'
    : 'absolute flex flex-col bg-ub-grey rounded-lg overflow-hidden window-shadow border border-white/10';

  const windowStyles = {
    zIndex,
    display: isMinimized ? 'none' : 'flex',
    ...(isMaximized ? {} : { width: `${size.width}px`, height: `${size.height}px` }),
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag-handle"
      disabled={isMaximized}
      position={isMaximized ? { x: 0, y: 0 } : position}
      onStop={handleDragStop}
      onMouseDown={onFocus}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        style={windowStyles}
        onClick={onFocus}
        className={`${windowClasses} ${!isFocused ? 'notFocused' : ''}`}
        role="region"
        aria-label={`${title} application window`}
      >
        <WindowTitleBar
          title={title}
          icon={icon}
          isFocused={isFocused}
          isMaximized={isMaximized}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
        />
        <div className="flex-1 w-full overflow-auto bg-ub-grey text-ubt-grey windowMainScreen relative">
          {children}
        </div>
        {!isMaximized && (
          <WindowResizeHandles onResizeStart={handleResizeStart} />
        )}
      </div>
    </Draggable>
  );
}
