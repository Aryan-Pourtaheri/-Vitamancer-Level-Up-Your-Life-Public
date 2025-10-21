
import React from 'react';
import { PlayerProfile, Habit } from '../types';
import Header from './dashboard/Header';
import HabitList from './dashboard/HabitList';
import StatsPanel from './dashboard/StatsPanel';
import HabitGenerator from './dashboard/HabitGenerator';

interface DashboardProps {
  playerProfile: PlayerProfile;
  habits: Habit[];
  onCompleteHabit: (habitId: string) => void;
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
  onAddNewHabits: (habits: Omit<Habit, 'id' | 'user_id' | 'completed'>[]) => void;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ playerProfile, habits, onCompleteHabit, onUpdateHabit, onAddNewHabits, onSignOut }) => {
  return (
    <div className="w-full min-h-screen bg-secondary/20">
      <Header playerProfile={playerProfile} onSignOut={onSignOut} />
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <HabitList habits={habits} onCompleteHabit={onCompleteHabit} onUpdateHabit={onUpdateHabit} />
          <HabitGenerator onAddHabits={onAddNewHabits} />
        </div>
        <aside className="lg:col-span-4">
          <StatsPanel playerProfile={playerProfile} />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
