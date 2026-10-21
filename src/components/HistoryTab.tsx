import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../types';
import { formatDisplayDate, getMonthCalendarGrid, getTodayKey, parseDateKey } from '../utils/dateUtils';
import { getDayCompletionStatus } from '../utils/streakUtils';

export const HistoryTab: React.FC = () => {
  const { habits, completions, toggleHabit } = useHabits();

  const todayKey = getTodayKey();
  const todayDate = parseDateKey(todayKey);

  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth()); // 0-indexed
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  const calendarDays = getMonthCalendarGrid(currentYear, currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonth(todayDate.getMonth());
    setSelectedDateKey(todayKey);
  };

  // Selected date details
  const selectedDayStatus = getDayCompletionStatus(selectedDateKey, habits, completions);
  const selectedDayRecord = completions[selectedDateKey] || {};

  return (
    <div className="space-y-5 pb-24">
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tap any day to see completion breakdown
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleJumpToToday}
            className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map(({ date, dateKey, isCurrentMonth }) => {
            const dayNum = date.getDate();
            const { status, percentage } = getDayCompletionStatus(dateKey, habits, completions);
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDateKey;

            // Determine background color based on status:
            // green = all done, yellow = partial, grey = none
            let statusClasses = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
            if (isCurrentMonth) {
              if (status === 'all') {
                statusClasses = 'bg-emerald-500 text-white font-bold shadow-xs';
              } else if (status === 'partial') {
                statusClasses = 'bg-amber-400 text-amber-950 font-bold';
              } else {
                statusClasses = 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400';
              }
            } else {
              statusClasses = 'opacity-25 bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-600';
            }

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDateKey(dateKey)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-xl p-1 text-xs transition-all active:scale-95 ${statusClasses} ${
                  isSelected ? 'ring-2 ring-emerald-600 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10' : ''
                } ${isToday && !isSelected ? 'border-2 border-emerald-600' : ''}`}
              >
                <span>{dayNum}</span>
                {isCurrentMonth && status !== 'none' && (
                  <span className="text-[9px] opacity-90 leading-none mt-0.5">
                    {percentage}%
                  </span>
                )}
                {isToday && (
                  <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-500 shadow-xs" />
            <span>All Done (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-400" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-slate-200 dark:bg-slate-700" />
            <span>None (0%)</span>
          </div>
        </div>
      </div>

      {/* Selected Day Breakdown Detail Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-slate-800 dark:text-white">
                {formatDisplayDate(selectedDateKey)}
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {selectedDayStatus.completedCount} of {selectedDayStatus.totalCount} habits completed ({selectedDayStatus.percentage}%)
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              selectedDayStatus.status === 'all'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : selectedDayStatus.status === 'partial'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {selectedDayStatus.status === 'all'
              ? 'All Completed'
              : selectedDayStatus.status === 'partial'
              ? 'Partially Done'
              : 'No Logs'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              selectedDayStatus.status === 'all'
                ? 'bg-emerald-500'
                : selectedDayStatus.status === 'partial'
                ? 'bg-amber-400'
                : 'bg-slate-300'
            }`}
            style={{ width: `${selectedDayStatus.percentage}%` }}
          />
        </div>

        {/* Habits Checklist for Selected Day */}
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {habits.map((h: Habit) => {
            const isDone = !!selectedDayRecord[h.id];
            return (
              <div
                key={h.id}
                onClick={() => toggleHabit(h.id, selectedDateKey)}
                className="flex cursor-pointer items-center justify-between py-2.5 hover:bg-slate-50 rounded-lg px-2 transition-colors dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{h.emoji}</span>
                  <span
                    className={`text-sm font-medium ${
                      isDone
                        ? 'text-slate-800 font-semibold dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {h.name}
                  </span>
                </div>

                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                    isDone
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-300 text-transparent hover:border-slate-400 dark:border-slate-700'
                  }`}
                >
                  <Check className={`h-4 w-4 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
