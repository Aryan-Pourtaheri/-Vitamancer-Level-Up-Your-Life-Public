import React from 'react';
import Button from './PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from './Modal';
import { motion } from 'framer-motion';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  return (
    // FIX: The Modal component requires the content to be passed as children. ModalContent and its descendants are now correctly nested within the Modal component.
    <Modal open={true} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-center text-4xl font-black text-yellow-300">LEVEL UP!</ModalTitle>
        </ModalHeader>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="text-center my-6"
        >
          <p className="text-xl mb-2 text-muted-foreground">You have reached</p>
          <p className="text-6xl font-bold mb-6 text-green-400">{`Level ${level}`}</p>
          <p className="text-muted-foreground mb-8">Your stats have increased! You feel stronger.</p>
        </motion.div>
        <ModalFooter>
          <Button onClick={onClose} className="w-full">Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LevelUpModal;