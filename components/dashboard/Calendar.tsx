
import React, { useState, useMemo } from 'react';
import { Habit } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import Button from '../PixelButton';
import { cn } from '../../lib/utils';
import DayDetailModal from './DayDetailModal';

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

interface CalendarProps {
  habits: Habit[];
}

const Calendar: React.FC<CalendarProps> = ({ habits }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const completedDates = useMemo(() => {
    const dates = new Set<string>();
    habits.forEach(habit => {
      // This is a workaround due to the data model lacking a `completed_at` field.
      // We'll use the creation date of a completed habit to mark a day on the calendar.
      if (habit.status === 'completed' && habit.created_at) {
        const completionDate = new Date(habit.created_at);
        dates.add(completionDate.toISOString().split('T')[0]);
      }
    });
    return dates;
  }, [habits]);

  const monthData = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = [];
    const startDay = startOfMonth.getDay();

    // Days from previous month
    for (let i = 0; i < startDay; i++) {
        const date = new Date(startOfMonth);
        date.setDate(date.getDate() - (startDay - i));
        daysInMonth.push({ date, isCurrentMonth: false });
    }

    // Days in current month
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        daysInMonth.push({ date, isCurrentMonth: true });
    }

    // Days from next month to fill grid
    const remainingSlots = 42 - daysInMonth.length;
    for (let i = 1; i <= remainingSlots; i++) {
        const date = new Date(endOfMonth);
        date.setDate(date.getDate() + i);
        daysInMonth.push({ date, isCurrentMonth: false });
    }
    return daysInMonth;
  }, [currentDate]);


  const changeMonth = (amount: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-mono">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8" onClick={() => setCurrentDate(new Date())}>Today</Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeMonth(-1)} aria-label="Previous month">
                  <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeMonth(1)} aria-label="Next month">
                  <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-sm text-muted-foreground">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-2">
            {monthData.map(({ date, isCurrentMonth }, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === todayStr;
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const hasCompletion = completedDates.has(dateStr);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'relative aspect-square w-full flex items-center justify-center rounded-md font-mono text-xs sm:text-sm transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                    isCurrentMonth ? 'text-foreground hover:bg-accent' : 'text-muted-foreground/30',
                    isToday && 'border-2 border-primary/50',
                    isSelected && 'bg-primary/20 border-2 border-primary'
                  )}
                >
                  {date.getDate()}
                  {hasCompletion && (
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-green-500" role="presentation" aria-label="Habits completed"></div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {selectedDate && (
        <DayDetailModal
            isOpen={!!selectedDate}
            onClose={() => setSelectedDate(null)}
            date={selectedDate}
            habits={habits}
        />
      )}
    </>
  );
};

export default Calendar;
