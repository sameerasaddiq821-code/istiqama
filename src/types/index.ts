export type HabitColor = 
  | 'emerald'
  | 'teal'
  | 'sky'
  | 'indigo'
  | 'amber'
  | 'orange'
  | 'rose'
  | 'purple'
  | 'emerald-deep';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: HabitColor;
  category: 'prayer' | 'growth' | 'health' | 'custom';
  createdAt: string; // YYYY-MM-DD
}

// date key: YYYY-MM-DD -> habitId -> boolean
export type DailyCompletions = Record<string, Record<string, boolean>>;

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}

export type ActiveTab = 'today' | 'history' | 'stats' | 'android';
