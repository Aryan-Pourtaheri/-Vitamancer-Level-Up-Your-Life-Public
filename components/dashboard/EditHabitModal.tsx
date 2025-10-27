
import React, { useState, useEffect } from 'react';
import { Habit } from '../../types';
import Button from '../PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '../Modal';
import { Input } from '../Input';
import { cn } from '../../lib/utils';

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

interface EditHabitModalProps {
    habit: Habit;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updates: Partial<Habit>) => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, isOpen, onClose, onSave }) => {
    const [text, setText] = useState(habit.text);
    const [difficulty, setDifficulty] = useState(habit.difficulty);

    useEffect(() => {
        setText(habit.text);
        setDifficulty(habit.difficulty);
    }, [habit]);

    const handleSave = () => {
        onSave({ text, difficulty });
    };

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle className="font-mono text-2xl">Edit Quest</ModalTitle>
                </ModalHeader>
                <div className="mt-4 space-y-4">
                    <Input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Quest description"
                    />
                    <DifficultySelector value={difficulty} onChange={setDifficulty} />
                </div>
                <ModalFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditHabitModal;
