
import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '../../types';
import HabitCard from './HabitCard';
import { cn } from '../../lib/utils';

type Status = 'not_started' | 'in_progress' | 'completed';

interface KanbanColumnProps {
  title: string;
  status: Status;
  habits: Habit[];
  onDrop: (habitId: string, newStatus: Status) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, habits, onDrop }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const habitId = e.dataTransfer.getData('habitId');
    onDrop(habitId, status);
    setIsHovered(false);
  };

  const statusColors = {
    not_started: 'border-muted-foreground/50',
    in_progress: 'border-yellow-500',
    completed: 'border-green-500',
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsHovered(true);
      }}
      onDragLeave={() => setIsHovered(false)}
      onDrop={handleDrop}
      className="flex flex-col"
    >
      <h3 className="font-mono font-bold text-lg mb-3 px-2 text-primary">{title} ({habits.length})</h3>
      <motion.div
        className={cn(
          "h-full p-2 rounded-lg border-2 border-dashed bg-secondary/30 transition-colors",
          statusColors[status],
          isHovered && 'bg-accent/30'
        )}
      >
        <div className="space-y-3">
          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
          {habits.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
              Drop quests here
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default KanbanColumn;
