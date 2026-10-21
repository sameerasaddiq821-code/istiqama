import { DailyCompletions, Habit } from '../types';
import { formatDateKey, getTodayKey, subtractDays } from './dateUtils';

export const STORAGE_KEYS = {
  HABITS: 'istiqama_habits_v1',
  COMPLETIONS: 'istiqama_completions_v1',
  THEME: 'istiqama_theme_v1'
};

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'fajr',
    name: 'Fajr Prayer',
    emoji: '🌅',
    color: 'emerald',
    category: 'prayer',
    createdAt: '2026-01-01'
  },
  {
    id: 'zuhr',
    name: 'Zuhr Prayer',
    emoji: '☀️',
    color: 'amber',
    category: 'prayer',
    createdAt: '2026-01-01'
  },
  {
    id: 'asr',
    name: 'Asr Prayer',
    emoji: '🌤️',
    color: 'teal',
    category: 'prayer',
    createdAt: '2026-01-01'
  },
  {
    id: 'maghrib',
    name: 'Maghrib Prayer',
    emoji: '🌇',
    color: 'orange',
    category: 'prayer',
    createdAt: '2026-01-01'
  },
  {
    id: 'isha',
    name: 'Isha Prayer',
    emoji: '🌙',
    color: 'indigo',
    category: 'prayer',
    createdAt: '2026-01-01'
  },
  {
    id: 'study',
    name: 'Study & Reading',
    emoji: '📚',
    color: 'sky',
    category: 'growth',
    createdAt: '2026-01-01'
  },
  {
    id: 'exercise',
    name: 'Daily Exercise',
    emoji: '🏃‍♂️',
    color: 'rose',
    category: 'health',
    createdAt: '2026-01-01'
  },
  {
    id: 'quran',
    name: 'Quran Recitation',
    emoji: '📖',
    color: 'emerald-deep',
    category: 'prayer',
    createdAt: '2026-01-01'
  }
];

/**
 * Creates realistic initial data so the user sees streaks, calendar colors, and weekly charts on first launch
 */
export function generateInitialCompletions(): DailyCompletions {
  const completions: DailyCompletions = {};
  const today = new Date();

  // Populate realistic completions for the past 6 days + partial today
  for (let i = 6; i >= 1; i--) {
    const dayKey = formatDateKey(subtractDays(today, i));
    completions[dayKey] = {};

    // For prayers: mostly completed (building a streak of 6 days)
    completions[dayKey]['fajr'] = true;
    completions[dayKey]['zuhr'] = true;
    completions[dayKey]['asr'] = true;
    completions[dayKey]['maghrib'] = true;
    completions[dayKey]['isha'] = true;
    completions[dayKey]['quran'] = i !== 3; // Quran done 5 of 6 days
    completions[dayKey]['exercise'] = i % 2 === 0; // Exercise every other day
    completions[dayKey]['study'] = i !== 4; // Study done most days
  }

  // Today partial completion: Fajr and Quran already completed
  const todayKey = getTodayKey();
  completions[todayKey] = {
    fajr: true,
    quran: true
  };

  return completions;
}

export function loadHabitsFromStorage(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      saveHabitsToStorage(DEFAULT_HABITS);
      return DEFAULT_HABITS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_HABITS;
  } catch (err) {
    console.error('Failed to load habits from localStorage:', err);
    return DEFAULT_HABITS;
  }
}

export function saveHabitsToStorage(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits to localStorage:', err);
  }
}

export function loadCompletionsFromStorage(): DailyCompletions {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    if (!raw) {
      const initial = generateInitialCompletions();
      saveCompletionsToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.error('Failed to load completions from localStorage:', err);
    return {};
  }
}

export function saveCompletionsToStorage(completions: DailyCompletions): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  } catch (err) {
    console.error('Failed to save completions to localStorage:', err);
  }
}

export function clearAllStorageData(): void {
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.COMPLETIONS);
}
