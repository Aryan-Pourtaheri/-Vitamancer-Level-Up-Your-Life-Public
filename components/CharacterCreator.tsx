import React, { useState, useMemo } from 'react';
import Button from './PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './Modal';
import { Input } from './Input';
import { CHARACTER_CLASSES, AVATAR_OPTIONS } from '../constants';
import { cn } from '../lib/utils';
import { AvatarOptions, CharacterClass } from '../types';
import { motion } from 'framer-motion';

interface CharacterCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string, characterClass: string, avatarOptions: AvatarOptions) => void;
}

// FIX: Corrected malformed SVG JSX.
const DiceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h14v1h1v1h1v1h1v1h1v1h-1v1h-1v1h-1v1h-1v1H5V5h1V4h1V3z m1 2v10h10V5H6z m1 1h2v2H7V6z m6 0h2v2h-2V6z m-6 6h2v2H7v-2z m6 0h2v2h-2v-2z"/>
    </svg>
);

const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
);
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
);


const AppearanceControl: React.FC<{
    label: string;
    onCycle: (direction: -1 | 1) => void;
    children: React.ReactNode;
}> = ({ label, onCycle, children }) => (
    <div>
        <h4 className="text-sm font-bold text-muted-foreground mb-2 font-mono uppercase tracking-widest">{label}</h4>
        <div className="flex items-center justify-between bg-secondary/50 p-1 rounded-md">
            <Button variant="ghost" size="icon" onClick={() => onCycle(-1)} className="h-10 w-10"><ChevronLeft className="w-5 h-5" /></Button>
            <div className="w-12 h-12 flex items-center justify-center">{children}</div>
            <Button variant="ghost" size="icon" onClick={() => onCycle(1)} className="h-10 w-10"><ChevronRight className="w-5 h-5" /></Button>
        </div>
    </div>
);


const CharacterCreator: React.FC<CharacterCreatorProps> = ({ isOpen, onClose, onCreateProfile }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(CHARACTER_CLASSES[0]);
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>({
    seed: Math.random().toString(36).substring(7),
    eyes: 'variant01',
    mouth: 'variant01',
    hair: 'long01',
    backgroundColor: 'b6e3f4'
  });
  const [loading, setLoading] = useState(false);

  const handleAppearanceCycle = (option: keyof typeof AVATAR_OPTIONS, direction: -1 | 1) => {
    const optionsArray = AVATAR_OPTIONS[option];
    const currentValue = avatarOptions[option as keyof AvatarOptions];
    const currentIndex = optionsArray.indexOf(currentValue as string);
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = optionsArray.length - 1;
    if (nextIndex >= optionsArray.length) nextIndex = 0;
    
    setAvatarOptions(prev => ({ ...prev, [option]: optionsArray[nextIndex] }));
  };

  const randomizeAvatar = () => {
    setAvatarOptions({
      seed: Math.random().toString(36).substring(7),
      eyes: AVATAR_OPTIONS.eyes[Math.floor(Math.random() * AVATAR_OPTIONS.eyes.length)],
      mouth: AVATAR_OPTIONS.mouth[Math.floor(Math.random() * AVATAR_OPTIONS.mouth.length)],
      hair: AVATAR_OPTIONS.hair[Math.floor(Math.random() * AVATAR_OPTIONS.hair.length)],
      backgroundColor: AVATAR_OPTIONS.backgroundColors[Math.floor(Math.random() * AVATAR_OPTIONS.backgroundColors.length)],
    });
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    // Use the character name as the final seed for consistency
    const finalAvatarOptions = { ...avatarOptions, seed: name.trim() };
    await onCreateProfile(name, selectedClass.name, finalAvatarOptions);
    setLoading(false);
  }

  const avatarUrl = useMemo(() => {
    const params = new URLSearchParams({
      seed: avatarOptions.seed,
      eyes: avatarOptions.eyes,
      mouth: avatarOptions.mouth,
      hair: avatarOptions.hair,
      backgroundColor: avatarOptions.backgroundColor,
    });
    return `https://api.dicebear.com/8.x/adventurer/svg?${params.toString()}`;
  }, [avatarOptions]);

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-6xl">
        <ModalHeader>
          <ModalTitle className="text-3xl font-mono font-bold">Forge Your Hero</ModalTitle>
        </ModalHeader>
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 py-4">
          
          {/* Left Panel: Class Selection */}
          <div className="md:col-span-2 space-y-2 h-[450px] overflow-y-auto pr-2 bg-secondary/30 p-2 rounded-lg border-2 border-border">
              <h3 className="font-mono text-lg font-bold text-center sticky top-0 bg-secondary/80 backdrop-blur-sm py-1">CLASSES</h3>
              {CHARACTER_CLASSES.map(c => (
                  <button key={c.name} onClick={() => setSelectedClass(c)} className={cn('w-full p-2 text-left border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3', selectedClass.name === c.name ? 'border-primary bg-primary/10' : 'border-transparent hover:border-primary/50 hover:bg-secondary')}>
                      <img src={c.spriteUrl} alt={c.name} className="w-10 h-12 bg-background/50 rounded-md object-contain scale-125 origin-top flex-shrink-0" />
                      <span className="text-sm font-semibold font-mono">{c.name}</span>
                  </button>
              ))}
          </div>

          {/* Center Panel: Preview & Info */}
          <div className="md:col-span-4 flex flex-col items-center justify-between">
              <div className="w-full space-y-4">
                 <div className="relative w-48 h-64 mx-auto">
                    <div className="w-full h-full rounded-lg overflow-hidden border-4 border-border bg-secondary shadow-lg">
                        <motion.img 
                            src={avatarUrl} 
                            alt="Avatar Preview" 
                            className="w-full h-full object-contain scale-125 origin-top"
                            key={avatarUrl}
                            animate={{ y: [-1, 1, -1] }}
                            transition={{
                              duration: 3,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={randomizeAvatar} className="absolute -bottom-3 -right-3 bg-card rounded-full h-10 w-10 shadow-md" aria-label="Randomize Look">
                        <DiceIcon className="h-6 w-6 text-muted-foreground pixelated" />
                    </Button>
                 </div>
                 <Input
                    id="char-name"
                    placeholder="Enter your hero's name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center text-lg h-12 font-mono"
                 />
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg text-sm w-full border-2 border-border mt-4">
                <p className="font-bold text-lg font-mono text-primary">{selectedClass.name}</p>
                <p className="text-muted-foreground mb-3">{selectedClass.description}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-base">
                    <div className="flex justify-between"><span>STR:</span> <span>{selectedClass.stats.str}</span></div>
                    <div className="flex justify-between"><span>INT:</span> <span>{selectedClass.stats.int}</span></div>
                    <div className="flex justify-between"><span>DEF:</span> <span>{selectedClass.stats.def}</span></div>
                    <div className="flex justify-between"><span>SPD:</span> <span>{selectedClass.stats.spd}</span></div>
                </div>
              </div>
          </div>

          {/* Right Panel: Appearance */}
          <div className="md:col-span-4 space-y-4 bg-secondary/30 p-4 rounded-lg border-2 border-border">
              <h3 className="font-mono text-lg font-bold text-center">APPEARANCE</h3>
              <AppearanceControl label="Hair" onCycle={(d) => handleAppearanceCycle('hair', d)}>
                 <img src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?hair=${avatarOptions.hair}&hairColor=8c6f60`} alt={avatarOptions.hair} />
              </AppearanceControl>

              <AppearanceControl label="Eyes" onCycle={(d) => handleAppearanceCycle('eyes', d)}>
                 <img src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?eyes=${avatarOptions.eyes}&eyesColor=000000`} alt={avatarOptions.eyes} className="scale-150" />
              </AppearanceControl>
              
              <AppearanceControl label="Mouth" onCycle={(d) => handleAppearanceCycle('mouth', d)}>
                 <img src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?mouth=${avatarOptions.mouth}&mouthColor=000000`} alt={avatarOptions.mouth} className="scale-150" />
              </AppearanceControl>

              <div>
                  <h4 className="text-sm font-bold text-muted-foreground mb-2 font-mono uppercase tracking-widest">Background</h4>
                  <div className="flex flex-wrap gap-2 justify-center bg-secondary/50 p-2 rounded-md">
                      {AVATAR_OPTIONS.backgroundColors.map(color => (
                          <button key={color} onClick={() => setAvatarOptions(p => ({...p, backgroundColor: color}))} className={cn('h-9 w-9 rounded-full border-2 transition-all', avatarOptions.backgroundColor === color ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-secondary' : 'border-border')} style={{backgroundColor: color === 'transparent' ? 'hsl(var(--card))' : `#${color}`}}></button>
                      ))}
                  </div>
              </div>
          </div>
        </div>
        <div className="pt-6 border-t-2 border-border mt-4">
          <Button onClick={handleSubmit} disabled={!name.trim() || loading} className="w-full" size="lg">
            {loading ? "Creating Hero..." : "Begin Your Journey"}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CharacterCreator;