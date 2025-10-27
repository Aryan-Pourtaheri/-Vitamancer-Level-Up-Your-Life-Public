
import React from 'react';
import { Monster, Habit } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import MonsterEncounter from './dungeon/MonsterEncounter';

interface DungeonPageProps {
  monsters: Monster[];
  habits: Habit[];
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
}

const DungeonPage: React.FC<DungeonPageProps> = ({ monsters, habits, onUpdateHabit }) => {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-mono">The Daily Dungeon</CardTitle>
          <p className="text-muted-foreground">Yesterday's failed quests have become today's monsters. Defeat them!</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {monsters.length > 0 ? (
              monsters.map(monster => {
                const linkedHabit = habits.find(h => h.id === monster.linked_habit_id);
                if (!linkedHabit) return null;
                return <MonsterEncounter key={monster.id} monster={monster} habit={linkedHabit} onUpdateHabit={onUpdateHabit} />;
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl font-mono text-primary mb-2">The Dungeon is Clear!</p>
                <p className="text-muted-foreground">You have no monsters to fight today. Keep up the good work!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default DungeonPage;
