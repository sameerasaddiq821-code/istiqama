import React from 'react';
import { Award, BarChart3, CheckCircle, Flame, Star, TrendingUp } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { getPastNDaysKeys, getWeekdayLabel, parseDateKey } from '../utils/dateUtils';
import { getDayCompletionStatus } from '../utils/streakUtils';

export const StatsTab: React.FC = () => {
  const { habits, completions, streaks } = useHabits();

  // 1. Weekly completion bar chart (Past 7 days)
  const past7DayKeys = getPastNDaysKeys(7);
  const weeklyData = past7DayKeys.map((key) => {
    const { percentage, completedCount, totalCount } = getDayCompletionStatus(key, habits, completions);
    const date = parseDateKey(key);
    const dayLabel = getWeekdayLabel(date);
    return {
      key,
      date,
      dayLabel,
      percentage,
      completedCount,
      totalCount
    };
  });

  const weeklyAverage = Math.round(
    weeklyData.reduce((acc, curr) => acc + curr.percentage, 0) / 7
  );

  // 2. Top 3 habits by streak (sort by current streak desc, then best streak desc)
  const sortedHabits = [...habits].sort((a, b) => {
    const streakA = streaks[a.id]?.currentStreak || 0;
    const streakB = streaks[b.id]?.currentStreak || 0;
    if (streakB !== streakA) return streakB - streakA;

    const bestA = streaks[a.id]?.bestStreak || 0;
    const bestB = streaks[b.id]?.bestStreak || 0;
    return bestB - bestA;
  });

  const top3Habits = sortedHabits.slice(0, 3);

  // 3. Overall lifetime metrics
  let totalCompletionsEver = 0;
  let perfectDaysCount = 0;

  for (const dateKey in completions) {
    const dayRecord = completions[dateKey];
    let count = 0;
    for (const h of habits) {
      if (dayRecord[h.id]) {
        count++;
        totalCompletionsEver++;
      }
    }
    if (count === habits.length && habits.length > 0) {
      perfectDaysCount++;
    }
  }

  const medals = [
    { rank: '1st', badge: '🥇', label: 'Gold', bg: 'from-amber-400 to-amber-500' },
    { rank: '2nd', badge: '🥈', label: 'Silver', bg: 'from-slate-300 to-slate-400' },
    { rank: '3rd', badge: '🥉', label: 'Bronze', bg: 'from-amber-600 to-amber-700' }
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Weekly Performance Bar Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Weekly Completion
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Last 7 days completion percentage
            </p>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {weeklyAverage}%
            </span>
            <p className="text-[10px] font-medium text-slate-400">Weekly Avg</p>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="mt-6 flex h-44 items-end justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
          {weeklyData.map((day) => {
            const heightPercent = Math.max(day.percentage, 6); // Minimum bar height for visibility
            const isFull = day.percentage === 100;
            const isZero = day.percentage === 0;

            return (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-2 group">
                {/* Tooltip / percentage on hover or focus */}
                <span className="text-[10px] font-bold text-slate-600 transition-opacity group-hover:opacity-100 dark:text-slate-300">
                  {day.percentage}%
                </span>

                {/* Vertical Bar */}
                <div className="relative flex h-32 w-full max-w-[28px] items-end justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isFull
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-500 shadow-xs'
                        : isZero
                        ? 'bg-slate-200 dark:bg-slate-700'
                        : 'bg-gradient-to-t from-teal-500 to-teal-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {day.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Habits by Streak */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-white">
            Top 3 Habits by Streak
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Your most consistent habits ranked by active streak
        </p>

        <div className="mt-4 space-y-3">
          {top3Habits.map((habit, index) => {
            const streak = streaks[habit.id] || {
              habitId: habit.id,
              currentStreak: 0,
              bestStreak: 0,
              totalCompletions: 0
            };
            const medal = medals[index];

            return (
              <div
                key={habit.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center text-xl">
                    {medal.badge}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-xs dark:bg-slate-900">
                    {habit.emoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>{streak.totalCompletions} total completed</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                    <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>{streak.currentStreak}d</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Best: {streak.bestStreak}d
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifetime Summary Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-semibold">Total Completed</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800 dark:text-white">
            {totalCompletionsEver}
          </div>
          <p className="text-[11px] text-slate-400">Habits checked all-time</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <Star className="h-4 w-4 fill-teal-500 text-teal-500" />
            <span className="text-xs font-semibold">Perfect Days</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800 dark:text-white">
            {perfectDaysCount}
          </div>
          <p className="text-[11px] text-slate-400">100% completion days</p>
        </div>
      </div>
    </div>
  );
};
