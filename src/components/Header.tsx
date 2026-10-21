import React from 'react';
import { Moon, Sun, Plus, WifiOff, Smartphone, ShieldCheck } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  const { isDarkMode, toggleDarkMode, isOnline, setActiveTab } = useHabits();
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20">
            <span className="text-xl">🕌</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Istiqama
              </h1>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                OFFLINE
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Daily Consistency Tracker
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Offline indicator */}
          {!isOnline && (
            <div
              title="Working in offline mode"
              className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
            >
              <WifiOff className="h-3 w-3" />
              <span className="hidden xs:inline">Offline</span>
            </div>
          )}

          {/* Direct Install PWA Button */}
          {isInstallable && (
            <button
              type="button"
              onClick={install}
              title="Install to Android device"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Add Habit (+) */}
          <button
            type="button"
            onClick={onOpenAddModal}
            aria-label="Add new habit"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-95 dark:bg-emerald-600"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
