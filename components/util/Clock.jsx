/**
 * @file components/util/Clock.jsx
 * @description Real-time clock button for the Ubuntu desktop top status bar.
 * Toggles the GNOME calendar and notification center popover.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useCallback } from 'react';

// 4. Project components
import CalendarCard from './CalendarCard';

// 2. Constants (File-scoped)
const CLOCK_INTERVAL_MS = 1000;
const DATE_FORMAT_OPTIONS = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

// 3. Component function definition
/**
 * Renders the top status bar system clock button and calendar popover.
 *
 * @returns {JSX.Element} Interactive top status bar clock component
 */
export default function Clock() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, CLOCK_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const formattedTime = isMounted
    ? new Intl.DateTimeFormat('en-US', DATE_FORMAT_OPTIONS).format(currentDate)
    : 'Oct 12 10:00 AM';

  return (
    <div className="relative flex items-center justify-center">
      <button
        id="top-panel-clock-button"
        type="button"
        onClick={handleToggle}
        className={`px-2 py-0.5 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-1 focus:ring-ub-orange cursor-pointer select-none ${
          isOpen ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Current date and time: ${formattedTime}. Click to view calendar and notifications.`}
      >
        <time dateTime={currentDate.toISOString()}>{formattedTime}</time>
      </button>

      {isOpen && (
        <CalendarCard
          currentDate={currentDate}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
