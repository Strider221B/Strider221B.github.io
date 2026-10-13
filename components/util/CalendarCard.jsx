/**
 * @file components/util/CalendarCard.jsx
 * @description Authentic Ubuntu GNOME top-panel calendar popover and notification center.
 * Features real-time month view navigation, day picker, and system notifications tray.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useRef, useMemo } from 'react';

// 2. Constants (File-scoped)
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Ubuntu 26.04.1 LTS Active',
    detail: 'Welcome to Somesh Chatterjee portfolio simulation.',
    time: 'Just now',
  },
  {
    id: 2,
    title: 'System Up to Date',
    detail: 'All static components and packages verified.',
    time: 'Today',
  },
];

/**
 * Calculates calendar grid data for a specified month and year.
 *
 * @param {number} year - Current viewing year
 * @param {number} month - Current viewing month (0-indexed)
 * @returns {Array<{ day: number, isCurrentMonth: boolean, dateString: string }>} Days grid array
 */
function getDaysInMonthGrid(year, month) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i -= 1) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateString: `${year}-${month}-${daysInPrevMonth - i}`,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInCurrentMonth; i += 1) {
    days.push({
      day: i,
      isCurrentMonth: true,
      dateString: `${year}-${month + 1}-${i}`,
    });
  }

  // Next month leading days to complete 35 or 42 grid slots
  const remainingSlots = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingSlots; i += 1) {
    days.push({
      day: i,
      isCurrentMonth: false,
      dateString: `${year}-${month + 2}-${i}`,
    });
  }

  return days;
}

// 3. Component function definition
/**
 * Renders the GNOME notification center and interactive monthly calendar dropdown.
 *
 * @param {Object} props
 * @param {Date} props.currentDate - Live real-time date object
 * @param {Function} props.onClose - Dismiss callback for the popover card
 * @returns {JSX.Element} Interactive calendar and notification popover
 */
export default function CalendarCard({ currentDate, onClose }) {
  const cardRef = useRef(null);
  const [viewDate, setViewDate] = useState(() => new Date(currentDate));
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Outside click and Escape key dismissal
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const monthGrid = useMemo(
    () => getDaysInMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const isToday = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return false;
    return (
      day === currentDate.getDate() &&
      viewMonth === currentDate.getMonth() &&
      viewYear === currentDate.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleResetToday = () => {
    setViewDate(new Date(currentDate));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const monthName = viewDate.toLocaleString('en-US', { month: 'long' });
  const weekdayLong = currentDate.toLocaleString('en-US', { weekday: 'long' });
  const formattedFullDate = currentDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      ref={cardRef}
      id="gnome-calendar-popover"
      className="absolute top-8 left-1/2 -translate-x-1/2 w-80 sm:w-96 bg-[#2B2B2B] text-white rounded-xl shadow-2xl border border-white/10 p-4 z-50 select-none animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-3"
      role="dialog"
      aria-label="Calendar and Notifications"
    >
      {/* Top Banner Date */}
      <div className="border-b border-white/10 pb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-white/60 font-medium">{weekdayLong}</div>
          <div className="text-sm font-semibold text-white/95">{formattedFullDate}</div>
        </div>
        <button
          type="button"
          onClick={handleResetToday}
          className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          aria-label="Jump to Today"
        >
          Today
        </button>
      </div>

      {/* Monthly Calendar View */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-white/90">
            {monthName} {viewYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
              aria-label="Previous month"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
              aria-label="Next month"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-[10px] text-white/50 font-medium">
          {WEEKDAYS.map((wd) => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center text-xs gap-y-0.5">
          {monthGrid.map((item) => {
            const todayMatch = isToday(item.day, item.isCurrentMonth);
            return (
              <div
                key={item.dateString}
                className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs transition-colors ${
                  todayMatch
                    ? 'bg-ub-orange text-white font-bold shadow-sm'
                    : item.isCurrentMonth
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-white/20'
                }`}
              >
                {item.day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications Tray */}
      <div className="border-t border-white/10 pt-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-white/60 font-medium">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearNotifications}
              className="text-[11px] text-white/50 hover:text-white/80 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="text-center py-2 text-xs text-white/40">No Notifications</div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-white/5 hover:bg-white/10 transition-colors rounded p-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white/95">{notif.title}</span>
                  <span className="text-[10px] text-white/40">{notif.time}</span>
                </div>
                <div className="text-[11px] text-white/70 truncate">{notif.detail}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
