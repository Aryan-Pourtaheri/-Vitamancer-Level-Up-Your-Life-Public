
import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../../types';
import { cn } from '../../lib/utils';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('habitId', habit.id);
  };

  const difficultyClasses = {
    easy: 'bg-green-500/20 text-green-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    hard: 'bg-red-500/20 text-red-300',
  };
  const xpAmount = {
    easy: '10',
    medium: '25',
    hard: '50',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      draggable
      onDragStart={handleDragStart}
      className="p-3 bg-card rounded-lg border-2 border-border cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm mb-2">{habit.text}</p>
      <div className="flex justify-between items-center text-xs">
        <span className={cn('px-2 py-0.5 rounded-full font-mono font-bold', difficultyClasses[habit.difficulty])}>
            {habit.difficulty}
        </span>
        <span className="font-mono font-bold text-green-400">
            +{xpAmount[habit.difficulty]} XP
        </span>
      </div>
    </motion.div>
  );
};

export default HabitCard;
