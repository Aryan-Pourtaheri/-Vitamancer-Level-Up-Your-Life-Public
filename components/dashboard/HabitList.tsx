import React from 'react';
import { Habit } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { motion } from 'framer-motion';

interface HabitRowProps {
  habit: Habit;
  onComplete: (id: string) => void;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, onComplete }) => {
    const difficultyClasses = {
        easy: 'border-l-green-500',
        medium: 'border-l-yellow-500',
        hard: 'border-l-red-500',
    };
    const xpAmount = {
        easy: '10',
        medium: '25',
        hard: '50',
    };

    return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-between p-3 bg-secondary rounded-lg border-l-4 ${difficultyClasses[habit.difficulty]} ${habit.completed ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    checked={habit.completed}
                    onChange={() => onComplete(habit.id)}
                    disabled={habit.completed}
                    className="w-5 h-5 mr-4 cursor-pointer disabled:cursor-not-allowed accent-green-500"
                />
                <span className={`transition-colors ${habit.completed ? 'line-through text-muted-foreground' : ''}`}>{habit.text}</span>
            </div>
            {!habit.completed && (
                <div className="text-right text-sm flex-shrink-0 ml-4">
                    <span className="font-bold text-green-400">+{xpAmount[habit.difficulty]} XP</span>
                </div>
            )}
        </motion.div>
    );
}

interface HabitListProps {
  habits: Habit[];
  onCompleteHabit: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onCompleteHabit }) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Daily Quests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {habits.length > 0 ? (
            habits.map(habit => (
              <HabitRow key={habit.id} habit={habit} onComplete={onCompleteHabit} />
            ))
          ) : (
            <p className="text-muted-foreground py-4 text-center">No habits yet. Use the AI generator to create some new quests!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitList;
