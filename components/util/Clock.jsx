/**
 * @file components/util/Clock.jsx
 * @description Real-time clock component for the Ubuntu desktop top status bar.
 * Updates formatted date and time every minute adhering to Ubuntu GNOME panel conventions.
 */

// 1. React / Next.js core
import React, { useState, useEffect } from 'react';

// 2. Constants
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
 * Renders the top status bar system clock.
 *
 * @returns {JSX.Element} Formatted date and time element
 */
export default function Clock() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, CLOCK_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, []);

  const formattedTime = new Intl.DateTimeFormat('en-US', DATE_FORMAT_OPTIONS).format(currentDate);

  return (
    <time
      dateTime={currentDate.toISOString()}
      className="px-2 py-0.5 text-xs font-medium text-white/90 hover:text-white rounded hover:bg-white/10 transition-colors cursor-default select-none focus:outline-none"
      aria-label={`Current date and time: ${formattedTime}`}
    >
      {formattedTime}
    </time>
  );
}
