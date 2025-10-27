import React from 'react';
import { Monster, Habit } from '../../types';
import Button from '../PixelButton';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const SkullIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="pixelated w-16 h-16 text-destructive/80">
        <path d="M7 3h10v1h1v1h1v3h-1v1h-1v1H8V9H7V8H6V5h1V4h1V3z m1 2v1h1v1h1v1h2V7h1V6h1V5H8z m2 5h4v1h1v1h1v3h-1v1h-1v1h-1v1h-2v-1H9v-1H8v-1H7v-3h1v-1h1v-1z m1 2v1h2v-1h-2z"/>
    </svg>
);

interface MonsterEncounterProps {
    monster: Monster;
    habit: Habit;
    onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
}

const MonsterEncounter: React.FC<MonsterEncounterProps> = ({ monster, habit, onUpdateHabit }) => {
    
    const handleComplete = () => {
        onUpdateHabit(habit.id, { status: 'completed' });
    }
    
    const difficultyClasses = {
        easy: 'border-l-green-500',
        medium: 'border-l-yellow-500',
        hard: 'border-l-red-500',
    };
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring' }}
            className="p-4 bg-secondary/50 rounded-lg border-2 border-border flex flex-col sm:flex-row items-center gap-4"
        >
            <div className="flex-shrink-0">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <SkullIcon />
                </motion.div>
            </div>
            <div className="flex-grow w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-mono font-bold text-destructive">{monster.name}</h3>
                        <p className="text-sm text-muted-foreground italic">"{monster.description}"</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <span className="font-mono font-bold text-lg text-foreground">{monster.hp} / {monster.maxHp}</span>
                        <p className="text-xs text-muted-foreground">HP</p>
                    </div>
                </div>
                
                <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border my-2">
                  <motion.div 
                    className="h-full bg-destructive"
                    initial={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* FIX: Removed duplicate className attribute which was causing a JSX error. */}
                <div
                    className={cn('mt-3 p-3 bg-background rounded-lg border-l-4 flex items-center justify-between gap-2', difficultyClasses[habit.difficulty])}
                >
                    <div>
                        <p className="text-sm text-muted-foreground">Vanquish by completing:</p>
                        <p className="font-semibold">{habit.text}</p>
                    </div>
                    <Button onClick={handleComplete} size="sm">Defeat</Button>
                </div>
            </div>
        </motion.div>
    )
}

export default MonsterEncounter;