
import React, { useMemo } from 'react';
import { Habit } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import Button from '../PixelButton';
import { cn } from '../../lib/utils';

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

interface CalendarProps {
  habits: Habit[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ habits, selectedDate, onDateSelect }) => {
  const [displayDate, setDisplayDate] = React.useState(selectedDate);

  const dailyStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number }> = {};
    habits.forEach(habit => {
      if (habit.type !== 'daily' || !habit.created_at) return;
      const dateStr = new Date(habit.created_at).toISOString().split('T')[0];
      if (!stats[dateStr]) {
        stats[dateStr] = { completed: 0, total: 0 };
      }
      stats[dateStr].total++;
      if (habit.status === 'completed') {
        stats[dateStr].completed++;
      }
    });
    return stats;
  }, [habits]);

  const monthData = useMemo(() => {
    const startOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const endOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
    const daysInMonth = [];
    const startDay = startOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
        const date = new Date(startOfMonth);
        date.setDate(date.getDate() - (startDay - i));
        daysInMonth.push({ date, isCurrentMonth: false });
    }
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
        const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), i);
        daysInMonth.push({ date, isCurrentMonth: true });
    }
    const remainingSlots = 42 - daysInMonth.length;
    for (let i = 1; i <= remainingSlots; i++) {
        const date = new Date(endOfMonth);
        date.setDate(date.getDate() + i);
        daysInMonth.push({ date, isCurrentMonth: false });
    }
    return daysInMonth;
  }, [displayDate]);


  const changeMonth = (amount: number) => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };
  
  const handleTodayClick = () => {
    const today = new Date();
    setDisplayDate(today);
    onDateSelect(today);
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-mono">
              {displayDate.toLocaleString('default', { month: 'long' })} {displayDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8" onClick={handleTodayClick}>Today</Button>
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
              const isSelected = selectedDate.toDateString() === date.toDateString();
              const dayStats = dailyStats[dateStr];
              let completionClass = '';

              if (dayStats && dayStats.total > 0) {
                const percentage = dayStats.completed / dayStats.total;
                if (percentage === 1) {
                    completionClass = 'bg-green-500/30';
                } else if (percentage > 0) {
                    completionClass = 'bg-yellow-500/20';
                } else {
                    completionClass = 'bg-destructive/10';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => onDateSelect(date)}
                  className={cn(
                    'relative aspect-square w-full flex items-center justify-center rounded-md font-mono text-xs sm:text-sm transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
                    isCurrentMonth ? 'text-foreground hover:bg-accent' : 'text-muted-foreground/30',
                    completionClass,
                    !completionClass && isToday && 'bg-primary/10',
                    isSelected && 'ring-2 ring-primary ring-offset-background'
                  )}
                >
                  <span className={cn('relative z-10', isToday && 'font-bold text-primary')}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center gap-2 sm:gap-4 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-destructive/10"></div> Failed</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-yellow-500/20"></div> Partial</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500/30"></div> Complete</div>
          </div>
        </CardContent>
      </Card>
  );
};

export default Calendar;