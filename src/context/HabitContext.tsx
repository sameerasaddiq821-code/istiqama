import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActiveTab, DailyCompletions, Habit, HabitStreak } from '../types';
import { getTodayKey } from '../utils/dateUtils';
import {
  clearAllStorageData,
  DEFAULT_HABITS,
  generateInitialCompletions,
  loadCompletionsFromStorage,
  loadHabitsFromStorage,
  saveCompletionsToStorage,
  saveHabitsToStorage,
  STORAGE_KEYS
} from '../utils/storage';
import { calculateHabitStreak, getDayCompletionStatus } from '../utils/streakUtils';
import { triggerCelebration, triggerHaptic } from '../utils/themeUtils';

interface HabitContextType {
  habits: Habit[];
  completions: DailyCompletions;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOnline: boolean;
  toggleHabit: (habitId: string, dateKey?: string) => void;
  addHabit: (data: { name: string; emoji: string; color: Habit['color']; category?: Habit['category'] }) => void;
  editHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  streaks: Record<string, HabitStreak>;
  todayStats: {
    status: 'all' | 'partial' | 'none';
    completedCount: number;
    totalCount: number;
    percentage: number;
  };
}

const HabitContext = createContext<HabitContextType | null>(null);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabitsFromStorage());
  const [completions, setCompletions] = useState<DailyCompletions>(() => loadCompletionsFromStorage());
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Theme setup
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored !== null) {
        return stored === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    triggerHaptic('light');
    setIsDarkMode((prev) => !prev);
  };

  // Online / Offline tracking
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    saveHabitsToStorage(habits);
  }, [habits]);

  useEffect(() => {
    saveCompletionsToStorage(completions);
  }, [completions]);

  // Compute streaks
  const streaks = useMemo(() => {
    const map: Record<string, HabitStreak> = {};
    for (const h of habits) {
      map[h.id] = calculateHabitStreak(h.id, completions);
    }
    return map;
  }, [habits, completions]);

  // Today stats
  const todayKey = getTodayKey();
  const todayStats = useMemo(() => {
    return getDayCompletionStatus(todayKey, habits, completions);
  }, [todayKey, habits, completions]);

  // Toggle habit completion for a day (defaults to today)
  const toggleHabit = (habitId: string, targetDateKey: string = todayKey) => {
    triggerHaptic('medium');

    setCompletions((prev) => {
      const dayRecord = { ...(prev[targetDateKey] || {}) };
      const currentlyDone = !!dayRecord[habitId];
      const willBeDone = !currentlyDone;

      if (willBeDone) {
        dayRecord[habitId] = true;
      } else {
        delete dayRecord[habitId];
      }

      const next = { ...prev, [targetDateKey]: dayRecord };

      // Check if this action completed all habits today
      if (targetDateKey === todayKey && willBeDone) {
        let count = 0;
        for (const h of habits) {
          if (dayRecord[h.id]) count++;
        }
        if (count === habits.length && habits.length > 0) {
          triggerCelebration();
        }
      }

      return next;
    });
  };

  const addHabit = (data: { name: string; emoji: string; color: Habit['color']; category?: Habit['category'] }) => {
    triggerHaptic('medium');
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      emoji: data.emoji || '✨',
      color: data.color || 'emerald',
      category: data.category || 'custom',
      createdAt: getTodayKey()
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const editHabit = (updatedHabit: Habit) => {
    triggerHaptic('light');
    setHabits((prev) => prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)));
  };

  const deleteHabit = (habitId: string) => {
    triggerHaptic('medium');
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    // Also clean up future completions
    setCompletions((prev) => {
      const copy = { ...prev };
      for (const d in copy) {
        if (copy[d][habitId]) {
          const dayCopy = { ...copy[d] };
          delete dayCopy[habitId];
          copy[d] = dayCopy;
        }
      }
      return copy;
    });
  };

  const resetAllData = () => {
    triggerHaptic('medium');
    clearAllStorageData();
    setHabits(DEFAULT_HABITS);
    const initial = generateInitialCompletions();
    saveCompletionsToStorage(initial);
    saveHabitsToStorage(DEFAULT_HABITS);
    setCompletions(initial);
  };

  const exportData = () => {
    const data = {
      version: 1,
      appName: 'Istiqama',
      exportDate: new Date().toISOString(),
      habits,
      completions
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.habits) && parsed.completions && typeof parsed.completions === 'object') {
        setHabits(parsed.habits);
        setCompletions(parsed.completions);
        saveHabitsToStorage(parsed.habits);
        saveCompletionsToStorage(parsed.completions);
        triggerHaptic('success');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        isOnline,
        toggleHabit,
        addHabit,
        editHabit,
        deleteHabit,
        resetAllData,
        exportData,
        importData,
        streaks,
        todayStats
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return ctx;
};
