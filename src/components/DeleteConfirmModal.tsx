import React from 'react';
import { Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  habit: Habit | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  habit,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <Trash2 className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          Delete "{habit.name}"?
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Are you sure you want to remove this habit and its associated streaks from your list?
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 active:scale-95"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
};
