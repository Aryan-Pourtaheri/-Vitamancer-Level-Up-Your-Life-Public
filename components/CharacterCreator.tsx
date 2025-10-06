import React, { useState } from 'react';
import Button from './PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './Modal';
import { Input } from './Input';
import { CHARACTER_CLASSES } from '../constants';
import { cn } from '../lib/utils';

interface CharacterCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string, characterClass: string, avatarSeed: string) => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ isOpen, onClose, onCreateProfile }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(CHARACTER_CLASSES[0]);
  const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toString(36).substring(7));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onCreateProfile(name, selectedClass.name, avatarSeed);
    setLoading(false);
  }

  const avatarUrl = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${avatarSeed}`;

  return (
    // FIX: The Modal component requires the content to be passed as children. ModalContent and its descendants are now correctly nested within the Modal component.
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle className="text-2xl">Create Your Hero</ModalTitle>
        </ModalHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Panel: Avatar and Name */}
          <div className="space-y-4">
            <div className="w-40 h-40 mx-auto rounded-lg overflow-hidden border-2 border-border bg-secondary">
              <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Avatar Seed"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
              />
              <Button variant="secondary" onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}>
                Random
              </Button>
            </div>
             <Input
                placeholder="Character Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
          </div>

          {/* Right Panel: Class Selection */}
          <div className="space-y-4">
             <h3 className="font-semibold">Choose Your Class</h3>
             <div className="grid grid-cols-3 gap-2">
               {CHARACTER_CLASSES.map(c => (
                 <div
                   key={c.name}
                   onClick={() => setSelectedClass(c)}
                   className={cn(
                     'p-2 text-center border-2 rounded-lg cursor-pointer transition-all',
                     selectedClass.name === c.name ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                   )}
                 >
                   <img src={c.spriteUrl} alt={c.name} className="w-12 h-12 mx-auto bg-secondary rounded" />
                   <p className="text-xs font-semibold mt-1">{c.name}</p>
                 </div>
               ))}
             </div>
             <div className="p-3 bg-secondary rounded-lg text-sm min-h-[60px]">
               <p className="font-bold">{selectedClass.name}</p>
               <p className="text-muted-foreground text-xs">{selectedClass.description}</p>
             </div>
          </div>
        </div>
        <div className="pt-4">
          <Button onClick={handleSubmit} disabled={!name.trim() || loading} className="w-full" size="lg">
            {loading ? "Creating Hero..." : "Begin Your Journey"}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CharacterCreator;