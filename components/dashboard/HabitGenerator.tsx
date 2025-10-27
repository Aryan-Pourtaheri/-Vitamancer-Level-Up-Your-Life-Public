
import React, { useState } from 'react';
import { generateHabitSuggestions } from '../../services/geminiService';
import Button from '../PixelButton';
import { Habit } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';

interface HabitGeneratorProps {
  onAddHabits: (habits: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>[]) => void;
}

const HabitGenerator: React.FC<HabitGeneratorProps> = ({ onAddHabits }) => {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError('Please enter a goal.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newHabits = await generateHabitSuggestions(goal);
      onAddHabits(newHabits);
      setGoal('');
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">AI Quest Forge</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Tell the Vitamancer AI your goal, and it will forge new quests for you.</p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., 'be healthier' or 'learn a new skill'"
            className="flex-grow"
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Quests'}
          </Button>
        </div>
        {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default HabitGenerator;
