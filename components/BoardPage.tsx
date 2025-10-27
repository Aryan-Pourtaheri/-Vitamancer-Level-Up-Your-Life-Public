
import React, { useState } from 'react';
import { Habit } from '../types';
import KanbanColumn from './board/KanbanColumn';
import BoardCalendar from './board/BoardCalendar';
import { Card, CardTitle, CardHeader, CardContent } from './Card';

type Status = 'not_started' | 'in_progress' | 'completed';

interface BoardPageProps {
  habits: Habit[];
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
}

const BoardPage: React.FC<BoardPageProps> = ({ habits, onUpdateHabit }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const habitsForDay = habits.filter(h =>
        h.created_at && new Date(h.created_at).toDateString() === selectedDate.toDateString()
    );

    const columns: Record<Status, Habit[]> = {
        not_started: habitsForDay.filter(h => h.status === 'not_started'),
        in_progress: habitsForDay.filter(h => h.status === 'in_progress'),
        completed: habitsForDay.filter(h => h.status === 'completed'),
    };

    const handleDragEnd = (habitId: string, newStatus: Status) => {
        const habit = habits.find(h => h.id === habitId);
        if (habit && habit.status !== newStatus) {
            onUpdateHabit(habitId, { status: newStatus });
        }
    };
    
    return (
        <main className="container mx-auto p-4 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-3 sticky top-24">
                <BoardCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} habits={habits} />
            </aside>
            <div className="lg:col-span-9">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-mono text-2xl">
                            Quests for: {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {habitsForDay.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
                                <KanbanColumn title="To Do" status="not_started" habits={columns.not_started} onDrop={handleDragEnd} />
                                <KanbanColumn title="In Progress" status="in_progress" habits={columns.in_progress} onDrop={handleDragEnd} />
                                <KanbanColumn title="Completed" status="completed" habits={columns.completed} onDrop={handleDragEnd} />
                            </div>
                            ) : (
                            <div className="min-h-[60vh] flex items-center justify-center text-center text-muted-foreground">
                                <p>No quests assigned for this day.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default BoardPage;