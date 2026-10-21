import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { getMotivationalMessage } from '../utils/streakUtils';
import { CircularProgress } from './CircularProgress';

interface MotivationalCardProps {
  completed: number;
  total: number;
  dateString: string;
}

export const MotivationalCard: React.FC<MotivationalCardProps> = ({ completed, total, dateString }) => {
  const message = getMotivationalMessage(completed, total);
  const isComplete = total > 0 && completed === total;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 p-5 text-white shadow-lg shadow-teal-900/10 dark:shadow-emerald-950/40">
      {/* Decorative background glow circles */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-xl" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left copy & dynamic message */}
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            {isComplete ? (
              <>
                <Trophy className="h-3.5 w-3.5 text-yellow-300" />
                <span className="text-yellow-100">Daily Goal Achieved!</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                <span className="text-emerald-100">{dateString}</span>
              </>
            )}
          </div>

          <h2 className="text-xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-2xl">
            {message.title}
          </h2>

          <p className="text-xs text-teal-100 sm:text-sm font-medium">
            {message.subtitle}
          </p>
        </div>

        {/* Right Circular Progress Ring */}
        <div className="flex-shrink-0 rounded-2xl bg-white/10 p-2 backdrop-blur-md dark:bg-black/20">
          <CircularProgress completed={completed} total={total} size={110} strokeWidth={9} />
        </div>
      </div>
    </div>
  );
};
