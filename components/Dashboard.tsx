
import React from 'react';
import { PlayerProfile, Habit } from '../types';
import Header from './dashboard/Header';
import HabitList from './dashboard/HabitList';
import StatsPanel from './dashboard/StatsPanel';
import HabitGenerator from './dashboard/HabitGenerator';
import Calendar from './dashboard/Calendar';

interface DashboardProps {
  playerProfile: PlayerProfile;
  habits: Habit[];
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
  onAddNewHabits: (habits: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>[]) => void;
  onSignOut: () => void;
  onNavigateToBoard: () => void;
  activeView: 'dashboard' | 'board';
}

const Dashboard: React.FC<DashboardProps> = ({ playerProfile, habits, onUpdateHabit, onAddNewHabits, onSignOut, onNavigateToBoard, activeView }) => {
  return (
    <div className="w-full min-h-screen bg-secondary/20">
      <Header 
        playerProfile={playerProfile} 
        onSignOut={onSignOut} 
        onNavigateToBoard={onNavigateToBoard}
        activeView={activeView}
      />
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <HabitList habits={habits} onUpdateHabit={onUpdateHabit} />
          <HabitGenerator onAddHabits={onAddNewHabits} />
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <StatsPanel playerProfile={playerProfile} />
          <Calendar habits={habits} />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
