

import React, { useState } from 'react';
import { Habit } from '../../types';
import Button from '../PixelButton';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { cn } from '../../lib/utils';

interface AddHabitFormProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>) => void;
}

type HabitType = 'daily' | 'monthly' | 'yearly';

const DifficultySelector: React.FC<{ value: 'easy' | 'medium' | 'hard'; onChange: (value: 'easy' | 'medium' | 'hard') => void; }> = ({ value, onChange }) => {
    const difficulties = [
        { id: 'easy', label: 'Easy', color: 'bg-green-500 hover:bg-green-600', selectedColor: 'bg-green-500' },
        { id: 'medium', label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600', selectedColor: 'bg-yellow-500' },
        { id: 'hard', label: 'Hard', color: 'bg-red-500 hover:bg-red-600', selectedColor: 'bg-red-500' },
    ] as const;

    return (
        <div className="grid grid-cols-3 gap-2">
            {difficulties.map(d => (
                <button
                    key={d.id}
                    type="button"
                    onClick={() => onChange(d.id)}
                    className={cn(
                        'h-10 rounded-md text-sm font-mono font-bold text-primary-foreground transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        value === d.id ? `${d.selectedColor} ring-2 ring-offset-2 ring-primary-foreground/50` : `${d.color} opacity-70`
                    )}
                >
                    {d.label}
                </button>
            ))}
        </div>
    );
};

const TypeSelector: React.FC<{ value: HabitType; onChange: (value: HabitType) => void; }> = ({ value, onChange }) => {
    const types: { id: HabitType, label: string }[] = [
        { id: 'daily', label: 'Daily' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' },
    ];
    return (
         <div className="p-1 bg-secondary rounded-lg flex gap-1">
            {types.map(t => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => onChange(t.id)}
                    className={cn(
                        'flex-1 py-1.5 text-sm rounded-md font-mono font-semibold transition-colors',
                        value === t.id ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:bg-background/50'
                    )}
                >
                    {t.label}
                </button>
            ))}
        </div>
    )
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
    const [text, setText] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [type, setType] = useState<HabitType>('daily');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            onAddHabit({ text, difficulty, type });
            setText('');
            setDifficulty('easy');
            setType('daily');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Add a New Quest</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="e.g., Meditate for 10 minutes"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-sm font-semibold text-muted-foreground mb-2 block">Difficulty</label>
                           <DifficultySelector value={difficulty} onChange={setDifficulty} />
                        </div>
                        <div>
                           <label className="text-sm font-semibold text-muted-foreground mb-2 block">Quest Type</label>
                           <TypeSelector value={type} onChange={setType} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !text.trim()}>
                        {loading ? 'Adding...' : 'Add Quest'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddHabitForm;