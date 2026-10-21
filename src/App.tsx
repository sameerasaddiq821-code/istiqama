/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { Habit } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayTab } from './components/TodayTab';
import { HistoryTab } from './components/HistoryTab';
import { StatsTab } from './components/StatsTab';
import { AndroidTab } from './components/AndroidTab';
import { HabitModal } from './components/HabitModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

function MainScreen() {
  const { activeTab, addHabit, editHabit, deleteHabit, resetAllData, habits } = useHabits();

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDeleteId, setHabitToDeleteId] = useState<string | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setHabitToEdit(null);
    setIsHabitModalOpen(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsHabitModalOpen(true);
  };

  const handleOpenDeleteModal = (habitId: string) => {
    setHabitToDeleteId(habitId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveHabit = (data: {
    name: string;
    emoji: string;
    color: Habit['color'];
    category: Habit['category'];
  }) => {
    if (habitToEdit) {
      editHabit({
        ...habitToEdit,
        name: data.name,
        emoji: data.emoji,
        color: data.color,
        category: data.category
      });
    } else {
      addHabit(data);
    }
  };

  const habitToDelete = habits.find((h) => h.id === habitToDeleteId) || null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Mobile container centered on larger desktop displays */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-white shadow-xl min-h-screen dark:bg-slate-950 border-x border-slate-200/50 dark:border-slate-800/50">
        {/* Header */}
        <Header onOpenAddModal={handleOpenAddModal} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-4">
          {activeTab === 'today' && (
            <TodayTab
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onOpenDeleteModal={handleOpenDeleteModal}
            />
          )}

          {activeTab === 'history' && <HistoryTab />}

          {activeTab === 'stats' && <StatsTab />}

          {activeTab === 'android' && (
            <AndroidTab onOpenResetModal={() => setIsResetModalOpen(true)} />
          )}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Add / Edit Habit Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={handleSaveHabit}
        habitToEdit={habitToEdit}
      />

      {/* Delete Habit Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        habit={habitToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (habitToDeleteId) {
            deleteHabit(habitToDeleteId);
          }
        }}
      />

      {/* Reset All Data Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetAllData}
      />
    </div>
  );
}

export default function App() {
  return (
    <HabitProvider>
      <MainScreen />
    </HabitProvider>
  );
}
