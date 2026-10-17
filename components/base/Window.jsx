/**
 * @file components/base/Window.jsx
 * @description Draggable, resizable application window shell with focus stacking,
 * maximize/minimize toggles, and integrated header controls.
 */

// 1. React / Next.js core
import React, { useRef, useState, useEffect, useCallback } from 'react';

// 2. Third-party libraries
import Draggable from 'react-draggable';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';
import { useTheme } from '../../hooks/useTheme';

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
const MOBILE_DEFAULT_POSITION = { x: 60, y: 10 };
const MOBILE_BREAKPOINT = 640;
const DOCK_WIDTH_OFFSET = 68;

// ─── HELPER SUB-COMPONENT ───────────────────────────────────────────
/**
 * Edge and corner handles for interactive window resizing.
 * Confined strictly to narrow window perimeter zones to prevent interfering with window content clicks.
 *
 * @param {Object} props
 * @param {Function} props.onResizeStart - Resize initiation handler
 */
function WindowResizeHandles({ onResizeStart }) {
  return (
    <>
      {/* Right border handle */}
      <div
        className="absolute right-0 top-2 bottom-2 w-1.5 cursor-e-resize z-20 select-none hover:bg-white/10 transition-colors"
        onMouseDown={(e) => onResizeStart('e', e)}
        aria-hidden="true"
      />
      {/* Bottom border handle */}
      <div
        className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize z-20 select-none hover:bg-white/10 transition-colors"
        onMouseDown={(e) => onResizeStart('s', e)}
        aria-hidden="true"
      />
      {/* Left border handle */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1.5 cursor-w-resize z-20 select-none hover:bg-white/10 transition-colors"
        onMouseDown={(e) => onResizeStart('w', e)}
        aria-hidden="true"
      />
      {/* Bottom-right corner handle */}
      <div
        className="absolute right-0 bottom-0 w-3 h-3 cursor-se-resize z-30 select-none"
        onMouseDown={(e) => onResizeStart('se', e)}
        aria-hidden="true"
      />
      {/* Bottom-left corner handle */}
      <div
        className="absolute left-0 bottom-0 w-3 h-3 cursor-sw-resize z-30 select-none"
        onMouseDown={(e) => onResizeStart('sw', e)}
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
  const { isDayTheme } = useTheme();

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

  // Mobile layout adjustment & auto-maximize
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT) {
      setPosition(MOBILE_DEFAULT_POSITION);
      const safeWidth = Math.max(260, window.innerWidth - DOCK_WIDTH_OFFSET);
      const safeHeight = Math.max(MIN_WINDOW_HEIGHT, Math.floor(window.innerHeight * 0.7));
      setSize({ width: safeWidth, height: safeHeight });

      if (!isMaximized) {
        onMaximize();
      }
    }
  }, []);

  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleInteractionFocus = useCallback(() => {
    if (!isFocused) {
      onFocus();
    }
  }, [isFocused, onFocus]);

  const handleResizeStart = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { width: startW, height: startH } = size;
    const { x: startXPos, y: startYPos } = position;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startW;
      let newHeight = startH;
      let newX = startXPos;

      if (direction.includes('e')) {
        newWidth = Math.max(MIN_WINDOW_WIDTH, startW + deltaX);
      } else if (direction.includes('w')) {
        const potentialWidth = startW - deltaX;
        newWidth = Math.max(MIN_WINDOW_WIDTH, potentialWidth);
        newX = startXPos + (startW - newWidth);
      }

      if (direction.includes('s')) {
        newHeight = Math.max(MIN_WINDOW_HEIGHT, startH + deltaY);
      }

      setSize({ width: newWidth, height: newHeight });
      if (direction.includes('w')) {
        setPosition((prev) => ({ ...prev, x: newX }));
      }
    };

    const onMouseUp = () => {
      if (typeof document !== 'undefined') {
        document.body.style.userSelect = '';
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    if (typeof document !== 'undefined') {
      document.body.style.userSelect = 'none';
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const windowClasses = isMaximized
    ? `fixed top-7 left-14 right-0 bottom-0 flex flex-col overflow-hidden shadow-2xl ${
        isDayTheme ? 'bg-white text-[#2e3436]' : 'bg-ub-grey text-ubt-grey'
      }`
    : `absolute flex flex-col rounded-lg overflow-hidden window-shadow border ${
        isDayTheme
          ? 'bg-white text-[#2e3436] border-black/15 shadow-xl'
          : 'bg-ub-grey text-ubt-grey border-white/10'
      }`;

  const windowStyles = {
    zIndex,
    display: isMinimized ? 'none' : 'flex',
    ...(isMaximized ? {} : { width: `${size.width}px`, height: `${size.height}px` }),
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag-handle"
      cancel="button, [role='button'], .no-drag, input, select, textarea, a"
      disabled={isMaximized}
      position={isMaximized ? { x: 0, y: 0 } : position}
      onStop={handleDragStop}
      onMouseDown={handleInteractionFocus}
      onTouchStart={handleInteractionFocus}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        style={windowStyles}
        onMouseDown={handleInteractionFocus}
        onTouchStart={handleInteractionFocus}
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
        <div
          className={`flex-1 w-full overflow-auto windowMainScreen relative ${
            isDayTheme ? 'bg-white text-[#2e3436]' : 'bg-ub-grey text-ubt-grey'
          }`}
        >
          {children}
        </div>
        {!isMaximized && (
          <div className="hidden sm:block">
            <WindowResizeHandles onResizeStart={handleResizeStart} />
          </div>
        )}
      </div>
    </Draggable>
  );
}
