
import React from 'react';
import { Specialization, Stats } from '../types';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './Modal';
import { motion } from 'framer-motion';
import Button from './PixelButton';
import { Card } from './Card';
import { cn } from '../lib/utils';

const StatBonus: React.FC<{ label: string; value: number; }> = ({ label, value }) => (
    <div className="flex items-center justify-center gap-1 text-sm bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
        <span>{label.toUpperCase()}</span>
        <span className="font-bold">+{value}</span>
    </div>
);

const ChoiceCard: React.FC<{ spec: Specialization; onSelect: () => void; }> = ({ spec, onSelect }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="w-full"
    >
        <Card className="p-6 text-center h-full flex flex-col justify-between bg-secondary/50 border-border hover:border-primary/50 transition-colors">
            <div>
                <h3 className="text-2xl font-mono font-bold text-primary">{spec.name}</h3>
                <p className="text-muted-foreground mt-2 mb-4 min-h-[40px]">{spec.description}</p>
                <div className="flex justify-center flex-wrap gap-2 mb-6">
                    {Object.entries(spec.statBonus).map(([stat, bonus]) => (
                        <StatBonus key={stat} label={stat} value={bonus} />
                    ))}
                </div>
            </div>
            <Button onClick={onSelect} className="w-full">Choose this Path</Button>
        </Card>
    </motion.div>
);

interface SpecializationModalProps {
  choices: Specialization[];
  onSelect: (spec: Specialization) => void;
}

const SpecializationModal: React.FC<SpecializationModalProps> = ({ choices, onSelect }) => {
  return (
    <Modal open={true} onOpenChange={() => {}}>
      <ModalContent className="max-w-3xl">
        <ModalHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <ModalTitle className="text-3xl font-display text-yellow-300 tracking-wider">Choose Your Path</ModalTitle>
            <p className="text-muted-foreground mt-2">You have reached Level 5! It is time to specialize your class.</p>
            <p className="text-muted-foreground font-bold">This choice is permanent.</p>
          </motion.div>
        </ModalHeader>
        <motion.div 
            className="mt-6 flex flex-col sm:flex-row gap-6"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { },
                visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } }
            }}
        >
          {choices.map(spec => (
              <motion.div key={spec.name} className="flex-1" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <ChoiceCard spec={spec} onSelect={() => onSelect(spec)} />
              </motion.div>
          ))}
        </motion.div>
      </ModalContent>
    </Modal>
  );
};

export default SpecializationModal;
