/**
 * @file components/screen/LockScreen.jsx
 * @description Session lock screen simulating Ubuntu GNOME lock screen experience.
 * Features blurred desktop wallpaper backdrop, digital clock shield, authentic user login prompt,
 * and comprehensive keyboard/click unlock interactions.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useCallback, useRef } from 'react';

// 5. Project utilities, constants, config
import {
  DEFAULT_WALLPAPER,
  DEFAULT_USER_NAME,
  getWallpaperStyle,
} from '../../lib/constants';

// 2. Constants (non-exported, file-scoped)
const CLOCK_INTERVAL_MS = 1000;
const TIME_FORMAT_OPTIONS = {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};
const DATE_FORMAT_OPTIONS = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

// ─── HELPER SUB-COMPONENTS (< 30 lines each) ─────────────────────────

/**
 * Minimalist GNOME top panel rendering system branding and status icons cluster.
 *
 * @returns {JSX.Element} Top bar display
 */
function LockTopBar() {
  return (
    <div className="relative z-10 w-full h-7 px-4 flex items-center justify-between text-xs text-white/80 select-none">
      <span className="font-medium tracking-wide">Ubuntu</span>
      <div className="flex items-center gap-3">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
        </svg>
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Large digital clock shield view displayed initially on the lock screen.
 *
 * @param {Object} props
 * @param {string} props.time - Formatted time string
 * @param {string} props.date - Formatted date string
 * @param {Function} props.onPromptClick - Callback to reveal password prompt
 * @returns {JSX.Element} Clock shield view
 */
function LockClockShield({ time, date, onPromptClick }) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none"
      onClick={onPromptClick}
      role="button"
      tabIndex={0}
      aria-label="Unlock screen"
    >
      <div className="text-7xl sm:text-8xl font-light tracking-tight text-white drop-shadow-md">
        {time}
      </div>
      <div className="mt-2 text-xl sm:text-2xl font-medium text-white/90 drop-shadow">
        {date}
      </div>
      <div className="mt-16 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors">
        <svg className="w-5 h-5 fill-current animate-bounce" viewBox="0 0 24 24">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
        <span className="text-sm font-medium">Click or press any key to unlock</span>
      </div>
    </div>
  );
}

/**
 * Authentic Ubuntu GNOME user authentication prompt with password input.
 *
 * @param {Object} props
 * @param {string} props.userName - Display name of the user
 * @param {string} props.password - Controlled password value
 * @param {Function} props.onPasswordChange - Password input change handler
 * @param {Function} props.onSubmit - Authentication submit handler
 * @param {Function} props.onCancel - Cancel handler to return to clock
 * @param {React.RefObject} props.inputRef - Ref pointing to password input element
 * @returns {JSX.Element} Auth prompt view
 */
function LockAuthPrompt({ userName, password, onPasswordChange, onSubmit, onCancel, inputRef }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs select-none">
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-ub-orange to-ub-med-abrgn flex items-center justify-center text-3xl font-light text-white shadow-xl ring-2 ring-ub-orange/40">
        {userName.charAt(0).toUpperCase()}
      </div>
      <span className="text-lg font-medium text-white">{userName}</span>
      <form onSubmit={onSubmit} className="w-full flex flex-col items-center gap-3">
        <div className="w-full flex items-center bg-black/50 border border-white/20 focus-within:border-ub-orange rounded-full px-3 py-1.5 backdrop-blur-md transition-colors">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            className="w-full bg-transparent text-sm text-white placeholder-white/40 px-2 py-0.5 focus:outline-none"
            aria-label="Password"
          />
          <button
            type="submit"
            className="p-1.5 rounded-full bg-ub-orange hover:bg-ub-orange/90 text-white transition-transform hover:scale-105"
            aria-label="Unlock"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
        <button type="button" onClick={onCancel} className="text-xs text-white/50 hover:text-white transition-colors">
          Cancel (Esc)
        </button>
      </form>
    </div>
  );
}

// ─── MAIN COMPONENT DEFINITION ───────────────────────────────────────

/**
 * Renders the interactive Ubuntu lock screen.
 * Supports clock shield view, password authentication view, and animated unlock transition.
 *
 * @param {Object} props
 * @param {boolean} [props.isLocked=true] - Whether session is locked
 * @param {Function} props.onUnlock - Callback to unlock session
 * @param {string} [props.backgroundImage=DEFAULT_WALLPAPER] - Wallpaper backdrop image path
 * @param {string} [props.userName=DEFAULT_USER_NAME] - Display name of active account
 * @returns {JSX.Element|null} Lock screen view
 */
export default function LockScreen({
  isLocked = true,
  onUnlock,
  backgroundImage = DEFAULT_WALLPAPER,
  userName = DEFAULT_USER_NAME,
}) {
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const inputRef = useRef(null);

  // Keep digital clock time synchronized every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, CLOCK_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, []);

  // Automatically focus password input field when entering auth view
  useEffect(() => {
    if (isAuthVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthVisible]);

  const handleShowAuth = useCallback(() => {
    setIsAuthVisible(true);
  }, []);

  const handleCancelAuth = useCallback(() => {
    setIsAuthVisible(false);
    setPassword('');
  }, []);

  const handlePasswordSubmit = useCallback((event) => {
    event?.preventDefault?.();
    onUnlock?.();
  }, [onUnlock]);

  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  // Global keyboard shortcuts (Any key to show auth, Escape to cancel)
  const handleKeyDown = useCallback((event) => {
    if (!isAuthVisible) {
      handleShowAuth();
    } else if (event.key === 'Escape') {
      handleCancelAuth();
    }
  }, [isAuthVisible, handleShowAuth, handleCancelAuth]);

  if (!isLocked) {
    return null;
  }

  const formattedTime = new Intl.DateTimeFormat('en-US', TIME_FORMAT_OPTIONS).format(currentDate);
  const formattedDate = new Intl.DateTimeFormat('en-US', DATE_FORMAT_OPTIONS).format(currentDate);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between select-none overflow-hidden focus:outline-none"
      role="region"
      aria-label="Ubuntu Lock Screen"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-md scale-105 z-0"
        style={getWallpaperStyle(backgroundImage)}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <LockTopBar />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {!isAuthVisible ? (
          <LockClockShield
            time={formattedTime}
            date={formattedDate}
            onPromptClick={handleShowAuth}
          />
        ) : (
          <LockAuthPrompt
            userName={userName}
            password={password}
            onPasswordChange={handlePasswordChange}
            onSubmit={handlePasswordSubmit}
            onCancel={handleCancelAuth}
            inputRef={inputRef}
          />
        )}
      </main>

      <footer className="relative z-10 h-8 flex items-center justify-center text-xs text-white/40">
        Ubuntu 26.04.1 LTS
      </footer>
    </div>
  );
}
