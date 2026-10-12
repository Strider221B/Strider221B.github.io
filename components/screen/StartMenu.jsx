/**
 * @file components/screen/StartMenu.jsx
 * @description Hierarchical nested application launcher menu overlay for the Ubuntu desktop.
 * Renders structured categories, submenus, and quick application links configured in apps.config.js.
 */

// 1. React / Next.js core
import React, { useEffect, useRef } from 'react';

// 4. Project components
import StartMenuItem from '../base/StartMenuItem';

// 5. Project utilities, constants, config
import { startMenuTree } from '../../apps.config';

// 2. Constants
const START_MENU_WIDTH_CLASS = 'w-56';

// 3. Component function definition
/**
 * Renders the hierarchical Start Menu overlay.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Whether start menu is visible
 * @param {Function} props.onClose - Callback to dismiss the menu
 * @param {Array<Object>} [props.menuTree=startMenuTree] - Start menu tree hierarchy
 * @returns {JSX.Element|null} Start menu overlay component
 */
export default function StartMenu({
  isOpen = false,
  onClose,
  menuTree = startMenuTree,
}) {
  const menuContainerRef = useRef(null);

  // Dismiss menu on outside click or Escape key
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <nav
      ref={menuContainerRef}
      className={`fixed top-8 left-2 ${START_MENU_WIDTH_CLASS} bg-[#2B2B2B]/95 backdrop-blur-md border border-white/10 rounded-md shadow-2xl py-1.5 z-50 select-none text-white animate-in fade-in zoom-in-95 duration-100 max-h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar`}
      role="menu"
      aria-label="Start Menu"
    >
      <div className="px-3 py-1 mb-1 border-b border-white/10 flex items-center justify-between text-[11px] text-white/50 font-medium tracking-wide uppercase">
        <span>Applications</span>
        <span className="text-[10px] lowercase text-white/30">Ubuntu</span>
      </div>

      <div className="flex flex-col">
        {menuTree.map((item, index) => (
          <StartMenuItem
            key={item.appId || item.label || index}
            item={item}
            depth={0}
            onItemClick={onClose}
          />
        ))}
      </div>
    </nav>
  );
}
