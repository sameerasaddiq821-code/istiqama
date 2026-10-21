import React from 'react';
import { Check, Flame, MoreVertical, Pencil, Star, Trash2 } from 'lucide-react';
import { Habit, HabitStreak } from '../types';
import { COLOR_CONFIGS } from '../utils/themeUtils';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  streak: HabitStreak;
  onToggle: () => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isCompleted,
  streak,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const colorCfg = COLOR_CONFIGS[habit.color] || COLOR_CONFIGS.emerald;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-500/30 bg-white/90 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/90'
          : 'border-slate-200/80 bg-white shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between p-4 sm:p-4.5">
        {/* Left Side: Checkbox & Info */}
        <div className="flex flex-1 items-center gap-3.5">
          {/* Large touch-friendly Checkbox */}
          <button
            type="button"
            onClick={onToggle}
            aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isCompleted
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-emerald-500'
                : 'border-slate-300 bg-slate-50 text-transparent hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-500'
            }`}
          >
            <Check
              className={`h-6 w-6 stroke-[3] transition-transform duration-200 ${
                isCompleted ? 'scale-100' : 'scale-50 opacity-0'
              }`}
            />
          </button>

          {/* Emoji Badge */}
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl shadow-inner ${colorCfg.badgeBg}`}
          >
            <span>{habit.emoji}</span>
          </div>

          {/* Habit Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                onClick={onToggle}
                className={`cursor-pointer truncate text-base font-semibold transition-colors ${
                  isCompleted
                    ? 'text-slate-500 line-through decoration-emerald-500/60 decoration-2 dark:text-slate-400'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {habit.name}
              </h3>
            </div>

            {/* Streak Badges */}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {/* Current Streak */}
              <div
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                  streak.currentStreak > 0
                    ? 'bg-amber-100/90 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
                title={`Current streak: ${streak.currentStreak} day${streak.currentStreak !== 1 ? 's' : ''}`}
              >
                <Flame
                  className={`h-3.5 w-3.5 ${
                    streak.currentStreak > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'
                  }`}
                />
                <span>{streak.currentStreak}d streak</span>
              </div>

              {/* Best Streak */}
              <div
                className="inline-flex items-center gap-1 rounded-md bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
                title={`Best streak record: ${streak.bestStreak} day${streak.bestStreak !== 1 ? 's' : ''}`}
              >
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-400" />
                <span>Best {streak.bestStreak}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Options Menu */}
        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Habit options"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* Popup Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-10 z-40 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(habit);
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                  Edit Habit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(habit.id);
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
