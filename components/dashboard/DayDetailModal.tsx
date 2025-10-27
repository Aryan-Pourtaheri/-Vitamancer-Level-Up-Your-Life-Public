
import React from 'react';
import { Habit } from '../../types';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../Modal';
import { cn } from '../../lib/utils';

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const CircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
);

interface DayDetailModalProps {
  date: Date;
  habits: Habit[];
  isOpen: boolean;
  onClose: () => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ date, habits, isOpen, onClose }) => {
  const habitsForDay = habits.filter(h =>
    h.created_at && new Date(h.created_at).toDateString() === date.toDateString()
  );

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="font-mono text-2xl">{formattedDate}</ModalTitle>
        </ModalHeader>
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar p-1">
          {habitsForDay.length > 0 ? (
            habitsForDay.map(habit => (
              <div
                key={habit.id}
                className={cn(
                  "flex items-center p-3 rounded-lg border-l-4",
                  habit.status === 'completed' ? 'bg-green-500/10 border-green-500' : 'bg-secondary border-border'
                )}
              >
                {habit.status === 'completed' ? (
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" />
                ) : (
                  <CircleIcon className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />
                )}
                <span className={cn(habit.status === 'completed' && 'line-through text-muted-foreground')}>
                  {habit.text}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No quests were assigned on this day.</p>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DayDetailModal;
