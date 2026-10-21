import confetti from 'canvas-confetti';
import { HabitColor } from '../types';

export function triggerHaptic(type: 'light' | 'medium' | 'success' = 'light') {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    if (type === 'light') {
      navigator.vibrate(12);
    } else if (type === 'medium') {
      navigator.vibrate(25);
    } else {
      navigator.vibrate([20, 40, 30]);
    }
  }
}

export function triggerCelebration() {
  triggerHaptic('success');
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#059669', '#14b8a6', '#10b981', '#34d399', '#f59e0b', '#3b82f6']
    });
  } catch (e) {
    // Canvas confetti fallback
  }
}

export interface ColorScheme {
  badgeBg: string;
  badgeText: string;
  borderLight: string;
  ringColor: string;
  activeCheck: string;
  pillBg: string;
}

export const COLOR_CONFIGS: Record<HabitColor, ColorScheme> = {
  emerald: {
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    borderLight: 'border-emerald-200 dark:border-emerald-800/40',
    ringColor: 'focus:ring-emerald-500',
    activeCheck: 'bg-emerald-600 border-emerald-600 text-white',
    pillBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  },
  'emerald-deep': {
    badgeBg: 'bg-emerald-200/80 dark:bg-emerald-900/50',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    borderLight: 'border-emerald-300 dark:border-emerald-700/50',
    ringColor: 'focus:ring-emerald-600',
    activeCheck: 'bg-emerald-700 border-emerald-700 text-white',
    pillBg: 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
  },
  teal: {
    badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
    badgeText: 'text-teal-700 dark:text-teal-300',
    borderLight: 'border-teal-200 dark:border-teal-800/40',
    ringColor: 'focus:ring-teal-500',
    activeCheck: 'bg-teal-600 border-teal-600 text-white',
    pillBg: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
  },
  amber: {
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    borderLight: 'border-amber-200 dark:border-amber-800/40',
    ringColor: 'focus:ring-amber-500',
    activeCheck: 'bg-amber-600 border-amber-600 text-white',
    pillBg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  },
  orange: {
    badgeBg: 'bg-orange-100 dark:bg-orange-950/60',
    badgeText: 'text-orange-700 dark:text-orange-300',
    borderLight: 'border-orange-200 dark:border-orange-800/40',
    ringColor: 'focus:ring-orange-500',
    activeCheck: 'bg-orange-600 border-orange-600 text-white',
    pillBg: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  },
  indigo: {
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    borderLight: 'border-indigo-200 dark:border-indigo-800/40',
    ringColor: 'focus:ring-indigo-500',
    activeCheck: 'bg-indigo-600 border-indigo-600 text-white',
    pillBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
  },
  sky: {
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    borderLight: 'border-sky-200 dark:border-sky-800/40',
    ringColor: 'focus:ring-sky-500',
    activeCheck: 'bg-sky-600 border-sky-600 text-white',
    pillBg: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
  },
  rose: {
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    borderLight: 'border-rose-200 dark:border-rose-800/40',
    ringColor: 'focus:ring-rose-500',
    activeCheck: 'bg-rose-600 border-rose-600 text-white',
    pillBg: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  },
  purple: {
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    borderLight: 'border-purple-200 dark:border-purple-800/40',
    ringColor: 'focus:ring-purple-500',
    activeCheck: 'bg-purple-600 border-purple-600 text-white',
    pillBg: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  }
};
