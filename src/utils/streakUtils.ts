import { DailyCompletions, Habit, HabitStreak } from '../types';
import { formatDateKey, getTodayKey, parseDateKey, subtractDays } from './dateUtils';

/**
 * Calculates current streak and best streak for a specific habit
 */
export function calculateHabitStreak(habitId: string, completions: DailyCompletions): HabitStreak {
  const todayKey = getTodayKey();
  const todayDate = parseDateKey(todayKey);
  const yesterdayKey = formatDateKey(subtractDays(todayDate, 1));

  const isCompletedToday = !!completions[todayKey]?.[habitId];
  const isCompletedYesterday = !!completions[yesterdayKey]?.[habitId];

  // 1. Current Streak Calculation
  let currentStreak = 0;

  if (isCompletedToday) {
    currentStreak = 1;
    let checkDate = subtractDays(todayDate, 1);
    while (true) {
      const key = formatDateKey(checkDate);
      if (completions[key]?.[habitId]) {
        currentStreak++;
        checkDate = subtractDays(checkDate, 1);
      } else {
        break;
      }
    }
  } else if (isCompletedYesterday) {
    // Today hasn't been completed yet, but yesterday was, so streak is active pending today
    currentStreak = 1;
    let checkDate = subtractDays(todayDate, 2);
    while (true) {
      const key = formatDateKey(checkDate);
      if (completions[key]?.[habitId]) {
        currentStreak++;
        checkDate = subtractDays(checkDate, 1);
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  // 2. Best Streak & Total Completions across all recorded history
  // Gather all unique date keys where habit was completed
  const completedDateKeys = Object.keys(completions)
    .filter((k) => completions[k]?.[habitId])
    .sort();

  const totalCompletions = completedDateKeys.length;

  let bestStreak = 0;
  let runningStreak = 0;
  let lastTimestamp: number | null = null;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  for (const dateKey of completedDateKeys) {
    const curDate = parseDateKey(dateKey);
    const curTime = curDate.getTime();

    if (lastTimestamp === null) {
      runningStreak = 1;
    } else {
      // Check if this date is exactly 1 day after the previous date
      // Round to nearest integer day to prevent daylight savings drift
      const diffDays = Math.round((curTime - lastTimestamp) / ONE_DAY_MS);
      if (diffDays === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }

    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }
    lastTimestamp = curTime;
  }

  // Best streak cannot be less than current streak
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return {
    habitId,
    currentStreak,
    bestStreak,
    totalCompletions
  };
}

/**
 * Get completion status for a specific date
 */
export function getDayCompletionStatus(
  dateKey: string,
  habits: Habit[],
  completions: DailyCompletions
): {
  status: 'all' | 'partial' | 'none';
  completedCount: number;
  totalCount: number;
  percentage: number;
} {
  const totalCount = habits.length;
  if (totalCount === 0) {
    return { status: 'none', completedCount: 0, totalCount: 0, percentage: 0 };
  }

  const dayRecord = completions[dateKey] || {};
  let completedCount = 0;
  for (const h of habits) {
    if (dayRecord[h.id]) {
      completedCount++;
    }
  }

  const percentage = Math.round((completedCount / totalCount) * 100);

  let status: 'all' | 'partial' | 'none' = 'none';
  if (completedCount === totalCount && totalCount > 0) {
    status = 'all';
  } else if (completedCount > 0) {
    status = 'partial';
  }

  return { status, completedCount, totalCount, percentage };
}

/**
 * Compute motivational message based on percentage
 */
export function getMotivationalMessage(completedCount: number, totalCount: number): {
  title: string;
  subtitle: string;
} {
  if (totalCount === 0) {
    return {
      title: "No habits yet",
      subtitle: "Add your first habit to begin your journey."
    };
  }

  const pct = (completedCount / totalCount) * 100;

  if (completedCount === 0) {
    return {
      title: "Bismillah! Ready for a blessed day?",
      subtitle: "Every journey begins with a single step."
    };
  }

  if (pct < 35) {
    return {
      title: "Great start! Keep going!",
      subtitle: `${completedCount} of ${totalCount} habits done today.`
    };
  }

  if (pct < 70) {
    return {
      title: "Halfway there, almost done!",
      subtitle: "Consistency transforms small steps into greatness."
    };
  }

  if (pct < 100) {
    return {
      title: "So close to 100%! Finish strong!",
      subtitle: `Only ${totalCount - completedCount} habit${totalCount - completedCount > 1 ? 's' : ''} remaining.`
    };
  }

  return {
    title: "All habits done, MashaAllah! 🎉",
    subtitle: "You completed everything planned for today!"
  };
}
