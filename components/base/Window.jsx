/**
 * @file components/base/Window.jsx
 * @description Window shell component supporting dragging, maximizing, minimizing,
 * focus stacking, and embedding application views.
 */

// 1. React / Next.js core
import React, { useRef } from 'react';

// 2. Third-party libraries
import Draggable from 'react-draggable';

// 4. Project components
import WindowTitleBar from './WindowTitleBar';

// 2. Constants
const DEFAULT_POSITION = { x: 90, y: 40 };

// 3. Component function definition
/**
 * Renders an interactive draggable application window frame.
 *
 * @param {Object} props
 * @param {string} props.appId - Application unique identifier
 * @param {string} props.title - Window title bar text
 * @param {string} [props.icon] - Application icon image path
 * @param {React.ReactNode} props.children - Child app component
 * @param {boolean} [props.isFocused=true] - Whether window has input focus
 * @param {boolean} [props.isMinimized=false] - Whether window is minimized
 * @param {boolean} [props.isMaximized=false] - Whether window is maximized
 * @param {number} props.zIndex - Dynamic z-index layering value
 * @param {Function} props.onClose - Window close handler
 * @param {Function} props.onMinimize - Window minimize handler
 * @param {Function} props.onMaximize - Window maximize handler
 * @param {Function} props.onFocus - Window focus handler
 * @returns {JSX.Element|null} Window shell or null when minimized
 */
export default function Window({
  appId,
  title,
  icon,
  children,
  isFocused = true,
  isMinimized = false,
  isMaximized = false,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) {
  const nodeRef = useRef(null);

  if (isMinimized) {
    return null;
  }

  const windowClasses = isMaximized
    ? 'fixed top-7 left-0 sm:left-14 right-0 bottom-0 flex flex-col bg-ub-grey overflow-hidden shadow-2xl'
    : 'absolute w-[700px] max-w-[90vw] h-[480px] max-h-[80vh] flex flex-col bg-ub-grey rounded-lg overflow-hidden window-shadow border border-white/10';

  const windowContent = (
    <div
      ref={nodeRef}
      style={{ zIndex }}
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
    </div>
  );

  if (isMaximized) {
    return windowContent;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag-handle"
      defaultPosition={DEFAULT_POSITION}
      bounds="parent"
      onMouseDown={onFocus}
    >
      {windowContent}
    </Draggable>
  );
}
