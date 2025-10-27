
import React, { useState } from 'react';
import { Habit } from '../../types';
import Button from '../PixelButton';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { cn } from '../../lib/utils';

interface AddHabitFormProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>) => void;
}

const DifficultySelector: React.FC<{ value: 'easy' | 'medium' | 'hard'; onChange: (value: 'easy' | 'medium' | 'hard') => void; }> = ({ value, onChange }) => {
    const difficulties = [
        { id: 'easy', label: 'Easy', color: 'bg-green-500 hover:bg-green-600', selectedColor: 'bg-green-500' },
        { id: 'medium', label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600', selectedColor: 'bg-yellow-500' },
        { id: 'hard', label: 'Hard', color: 'bg-red-500 hover:bg-red-600', selectedColor: 'bg-red-500' },
    ] as const;

    return (
        <div className="flex gap-2">
            {difficulties.map(d => (
                <button
                    key={d.id}
                    type="button"
                    onClick={() => onChange(d.id)}
                    className={cn(
                        'flex-1 h-10 rounded-md text-sm font-mono font-bold text-primary-foreground transition-all',
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


const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
    const [text, setText] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            onAddHabit({ text, difficulty });
            setText('');
            setDifficulty('easy');
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
                    <DifficultySelector value={difficulty} onChange={setDifficulty} />
                    <Button type="submit" className="w-full" disabled={loading || !text.trim()}>
                        {loading ? 'Adding...' : 'Add Quest'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddHabitForm;
