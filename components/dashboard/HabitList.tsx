

import React, { useState } from 'react';
import { Habit } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import Button from '../PixelButton';
import EditHabitModal from './EditHabitModal';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      <path d="m15 5 4 4"/>
    </svg>
);
  
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
);

interface HabitRowProps {
  habit: Habit;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
);


const HabitRow: React.FC<HabitRowProps> = React.memo(({ habit, onUpdate, onDelete, onEdit }) => {
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [notes, setNotes] = useState(habit.notes || '');

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

    const handleSave = () => {
        onUpdate(habit.id, { notes });
        setIsNotesOpen(false);
    };

    const handleCancel = () => {
        setNotes(habit.notes || '');
        setIsNotesOpen(false);
    };

    return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={cn(`p-3 bg-secondary rounded-lg border-l-4 ${difficultyClasses[habit.difficulty]}`, habit.status === 'completed' ? 'opacity-50' : '')}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        checked={habit.status === 'completed'}
                        onChange={() => onUpdate(habit.id, { status: habit.status === 'completed' ? 'not_started' : 'completed' })}
                        className="w-5 h-5 mr-4 cursor-pointer accent-green-500"
                    />
                    <span className={`transition-colors ${habit.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{habit.text}</span>
                </div>
                <div className="flex items-center gap-0.5">
                    {habit.status !== 'completed' && (
                        <div className="text-right text-sm flex-shrink-0 mr-2">
                            <span className="font-bold text-green-400">+{xpAmount[habit.difficulty]} XP</span>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsNotesOpen(p => !p)}>
                       <FileTextIcon className={cn("w-4 h-4 text-muted-foreground", habit.notes && 'fill-muted-foreground/20')} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(habit)}>
                        <EditIcon className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 group hover:bg-destructive/10" onClick={() => { if (window.confirm('Are you sure you want to delete this quest? This will also remove any monster linked to it and cannot be undone.')) onDelete(habit.id); }}>
                        <TrashIcon className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                    </Button>
                </div>
            </div>
            <AnimatePresence>
                {isNotesOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: '0.75rem' }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes, reflections, or a journal entry..."
                            className="w-full h-24 p-2 rounded-md border-2 border-input bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                            <Button size="sm" onClick={handleSave}>Save</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

interface HabitListProps {
  habits: Habit[];
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onUpdateHabit, onDeleteHabit }) => {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleSaveEdit = (updates: Partial<Habit>) => {
      if (!editingHabit) return;
      onUpdateHabit(editingHabit.id, updates);
      setEditingHabit(null);
  };

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Daily Quests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {habits.length > 0 ? (
              habits.map(habit => (
                <HabitRow key={habit.id} habit={habit} onUpdate={onUpdateHabit} onDelete={onDeleteHabit} onEdit={setEditingHabit} />
              ))
            ) : (
              <p className="text-muted-foreground py-4 text-center">No habits yet. Add a new quest or use the AI generator to create some!</p>
            )}
          </div>
        </CardContent>
      </Card>
      {editingHabit && (
          <EditHabitModal
              habit={editingHabit}
              isOpen={!!editingHabit}
              onClose={() => setEditingHabit(null)}
              onSave={handleSaveEdit}
          />
      )}
    </>
  );
};

export default HabitList;