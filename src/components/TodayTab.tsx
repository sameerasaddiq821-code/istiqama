import React, { useState } from 'react';
import { Plus, CheckCheck, ListFilter } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../types';
import { formatDisplayDate, getTodayKey } from '../utils/dateUtils';
import { HabitItem } from './HabitItem';
import { MotivationalCard } from './MotivationalCard';

interface TodayTabProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (habit: Habit) => void;
  onOpenDeleteModal: (habitId: string) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal
}) => {
  const { habits, completions, toggleHabit, streaks, todayStats } = useHabits();
  const [filter, setFilter] = useState<'all' | 'prayers' | 'other'>('all');

  const todayKey = getTodayKey();
  const todayRecord = completions[todayKey] || {};
  const formattedToday = formatDisplayDate(new Date());

  const filteredHabits = habits.filter((h) => {
    if (filter === 'prayers') return h.category === 'prayer';
    if (filter === 'other') return h.category !== 'prayer';
    return true;
  });

  const prayerCount = habits.filter((h) => h.category === 'prayer').length;
  const otherCount = habits.filter((h) => h.category !== 'prayer').length;

  return (
    <div className="space-y-5 pb-24">
      {/* Motivational Card with Circular Progress Ring */}
      <MotivationalCard
        completed={todayStats.completedCount}
        total={todayStats.totalCount}
        dateString={formattedToday}
      />

      {/* Filter Tabs & Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-xl bg-slate-200/80 p-1 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-emerald-800 shadow-sm dark:bg-slate-800 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            All ({habits.length})
          </button>
          {prayerCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('prayers')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                filter === 'prayers'
                  ? 'bg-white text-emerald-800 shadow-sm dark:bg-slate-800 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Prayers ({prayerCount})
            </button>
          )}
          {otherCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('other')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                filter === 'other'
                  ? 'bg-white text-emerald-800 shadow-sm dark:bg-slate-800 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Habits ({otherCount})
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Habit List */}
      {filteredHabits.length > 0 ? (
        <div className="space-y-3">
          {filteredHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompleted={!!todayRecord[habit.id]}
              streak={
                streaks[habit.id] || {
                  habitId: habit.id,
                  currentStreak: 0,
                  bestStreak: 0,
                  totalCompletions: 0
                }
              }
              onToggle={() => toggleHabit(habit.id, todayKey)}
              onEdit={onOpenEditModal}
              onDelete={onOpenDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCheck className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No habits found in this view
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tap the button below to add your first habit or adjust your filter.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add New Habit
          </button>
        </div>
      )}
    </div>
  );
};
