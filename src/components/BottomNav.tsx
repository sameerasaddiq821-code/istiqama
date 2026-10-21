import React from 'react';
import { CheckCircle2, Calendar, BarChart3, Smartphone } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { ActiveTab } from '../types';
import { triggerHaptic } from '../utils/themeUtils';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHabits();

  const handleTabClick = (tab: ActiveTab) => {
    triggerHaptic('light');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: 'Today', icon: CheckCircle2 },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'android', label: 'Android APK', icon: Smartphone }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 pb-safe backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-all active:scale-95 ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400'
                    : ''
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] leading-none tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
