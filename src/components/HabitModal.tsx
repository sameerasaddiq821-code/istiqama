import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Habit, HabitColor } from '../types';
import { COLOR_CONFIGS } from '../utils/themeUtils';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: {
    name: string;
    emoji: string;
    color: HabitColor;
    category: Habit['category'];
  }) => void;
  habitToEdit?: Habit | null;
}

const PRESET_EMOJIS = [
  '🌅', '☀️', '🌤️', '🌇', '🌙', // Prayers
  '📖', '📚', '📿', '🕌', '🤲', // Islamic & Reading
  '🏃‍♂️', '💪', '🧘', '💧', '🥗', // Health & Wellness
  '✍️', '🎯', '🌿', '⏰', '✨'  // Productivity & Mindfulness
];

const AVAILABLE_COLORS: HabitColor[] = [
  'emerald',
  'teal',
  'emerald-deep',
  'sky',
  'indigo',
  'amber',
  'orange',
  'rose',
  'purple'
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  habitToEdit
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [color, setColor] = useState<HabitColor>('emerald');
  const [category, setCategory] = useState<Habit['category']>('custom');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setEmoji(habitToEdit.emoji);
      setColor(habitToEdit.color);
      setCategory(habitToEdit.category);
    } else {
      setName('');
      setEmoji('✨');
      setColor('emerald');
      setCategory('custom');
    }
    setError('');
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a habit name.');
      return;
    }
    onSave({
      name: name.trim(),
      emoji: emoji || '✨',
      color,
      category
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Habit Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Read Quran, Morning Walk"
              maxLength={40}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Icon / Emoji
            </label>
            <div className="mt-1 grid grid-cols-5 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 max-h-36 overflow-y-auto">
              {PRESET_EMOJIS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className={`flex h-10 items-center justify-center rounded-lg text-lg transition-transform active:scale-90 ${
                    emoji === item
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Color Accent
            </label>
            <div className="mt-1 flex flex-wrap gap-2.5">
              {AVAILABLE_COLORS.map((c) => {
                const isSelected = color === c;
                const cfg = COLOR_CONFIGS[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full border-2 transition-transform active:scale-95 ${
                      isSelected
                        ? 'border-slate-800 scale-110 shadow-md dark:border-white'
                        : 'border-transparent hover:scale-105'
                    } ${cfg.badgeBg}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <div className="mt-1 grid grid-cols-4 gap-1.5 text-xs font-medium">
              {[
                { id: 'prayer', label: 'Prayer' },
                { id: 'growth', label: 'Growth' },
                { id: 'health', label: 'Health' },
                { id: 'custom', label: 'General' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as Habit['category'])}
                  className={`rounded-lg py-1.5 text-center transition ${
                    category === cat.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 active:scale-95"
            >
              {habitToEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
