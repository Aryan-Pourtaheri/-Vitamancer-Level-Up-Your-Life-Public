import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Button from './PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './Modal';
import { Input } from './Input';
import { CHARACTER_CLASSES } from '../constants';
import { cn } from '../lib/utils';
import { AvatarOptions, Stats, CharacterClass } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { motion, AnimatePresence } from 'framer-motion';

const DiceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M16 8h.01"></path><path d="M12 12h.01"></path><path d="M8 16h.01"></path>
    </svg>
);

const ResetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
    </svg>
);

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


interface CharacterCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string, characterClass: string, avatarOptions: AvatarOptions, stats: Stats) => void;
  initialName?: string;
}

const MAX_STAT_POINTS = 30;
const MIN_STAT_VALUE = 1;
const STAT_NAMES: (keyof Stats)[] = ['str', 'int', 'def', 'spd'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ isOpen, onClose, onCreateProfile, initialName }) => {
    const [name, setName] = useState(initialName || '');
    const [selectedClass, setSelectedClass] = useState<CharacterClass>(CHARACTER_CLASSES[0]);
    const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(CHARACTER_CLASSES[0].avatar);
    const [stats, setStats] = useState<Stats>(CHARACTER_CLASSES[0].baseStats);
    
    const [loading, setLoading] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollButtons = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const hasOverflow = el.scrollWidth > el.clientWidth;
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
        }
    }, []);

    useEffect(() => {
        const scrollEl = scrollContainerRef.current;
        if (scrollEl) {
            checkScrollButtons();
            scrollEl.addEventListener('scroll', checkScrollButtons, { passive: true });
            window.addEventListener('resize', checkScrollButtons);

            const timer = setTimeout(checkScrollButtons, 100);

            return () => {
                scrollEl.removeEventListener('scroll', checkScrollButtons);
                window.removeEventListener('resize', checkScrollButtons);
                clearTimeout(timer);
            };
        }
    }, [checkScrollButtons, isOpen]);

    useEffect(() => {
        setAvatarOptions(selectedClass.avatar);
        setStats(selectedClass.baseStats);
    }, [selectedClass]);

    const pointsUsed = useMemo(() => STAT_NAMES.reduce((sum, key) => sum + stats[key], 0), [stats]);
    const pointsRemaining = MAX_STAT_POINTS - pointsUsed;

    const handleStatUpdate = (stat: keyof Stats, value: number) => {
        setStats(prev => {
            const currentTotal = pointsUsed - prev[stat];
            const newValue = clamp(value, MIN_STAT_VALUE, 15);
            const newTotal = currentTotal + newValue;
            if (newTotal > MAX_STAT_POINTS) return prev; 
            return { ...prev, [stat]: newValue };
        });
    };

    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = direction === 'left' ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const randomize = useCallback(() => {
        const randomClass = CHARACTER_CLASSES[Math.floor(Math.random() * CHARACTER_CLASSES.length)];
        setSelectedClass(randomClass);
        
        const hairStyles: AvatarOptions['hairStyle'][] = ["spiky", "long", "short", "bun", "mohawk"];
        const eyeStyles: AvatarOptions['eyeStyle'][] = ["normal", "happy", "sleepy", "angry"];
        const weaponStyles: AvatarOptions['weapon'][] = ["sword", "staff", "bow", "none"];
        const skinTones = ['#f2d3b1', '#e8b3a5', '#d5a38a', '#c09f8e', '#a07662'];

        const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

        setAvatarOptions({
            skinColor: skinTones[Math.floor(Math.random() * skinTones.length)],
            hairColor: randomColor(),
            hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
            outfitColor: randomColor(),
            accentColor: randomColor(),
            eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
            hat: Math.random() > 0.7,
            cloak: Math.random() > 0.6,
            weapon: weaponStyles[Math.floor(Math.random() * weaponStyles.length)],
        });

        let remainingPoints = MAX_STAT_POINTS - (STAT_NAMES.length * MIN_STAT_VALUE);
        const newStats: Stats = { str: 1, int: 1, def: 1, spd: 1 };
        STAT_NAMES.forEach(stat => {
            const points = Math.round(Math.random() * remainingPoints);
            newStats[stat] += points;
            remainingPoints -= points;
        });
        let i = 0;
        while(remainingPoints > 0) {
            const stat = STAT_NAMES[i % STAT_NAMES.length];
            if (newStats[stat] < 15) {
                newStats[stat]++;
                remainingPoints--;
            }
            i++;
        }
        setStats(newStats);

    }, []);
    
    const reset = useCallback(() => {
        setName(initialName || '');
        setSelectedClass(CHARACTER_CLASSES[0]);
    }, [initialName]);

    const handleSubmit = async () => {
        if (!name.trim() || pointsRemaining < 0) return;
        setLoading(true);
        await onCreateProfile(name, selectedClass.name, avatarOptions, stats);
        setLoading(false);
    }
    
    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="w-11/12 max-w-screen-2xl">
                <ModalHeader>
                    <ModalTitle className="text-3xl font-mono font-bold text-center w-full">Forge Your Hero</ModalTitle>
                </ModalHeader>
                <div className="grid grid-cols-1 lg:grid-cols-7 lg:items-start gap-8 py-4 overflow-hidden">
                    
                    {/* --- Left Panel: Preview & Finalize --- */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-between gap-4 p-4 bg-secondary/30 rounded-lg border-2 border-border">
                        <div className="w-full flex-grow flex flex-col items-center gap-4">
                            <div className="w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border-4 border-border bg-background shadow-lg relative">
                                <div className="absolute inset-0 bg-grid-pattern opacity-100 dark:opacity-40"></div>
                                <PlayerAvatar options={avatarOptions} characterClass={selectedClass.name} />
                            </div>
                             <Input
                                id="char-name"
                                placeholder="Enter your hero's name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-center text-lg h-12 font-mono"
                             />
                            <div className="flex gap-4 w-full">
                                <Button variant="secondary" onClick={randomize} className="flex-1"><DiceIcon className="w-4 h-4 mr-2" /> Random</Button>
                                <Button variant="secondary" onClick={reset} className="flex-1"><ResetIcon className="w-4 h-4 mr-2" /> Reset</Button>
                            </div>
                        </div>

                        <div className="w-full mt-auto pt-4">
                            <Button onClick={handleSubmit} disabled={!name.trim() || loading || pointsRemaining < 0} className="w-full" size="lg">
                                {loading ? "Creating Hero..." : "Begin Your Journey"}
                            </Button>
                            {pointsRemaining < 0 && <p className="text-destructive text-center mt-2 text-sm">You have used too many stat points!</p>}
                        </div>
                    </div>

                    {/* --- Right Panel: Customization --- */}
                    <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[70vh] p-4 -mr-2 pr-6">
                       {/* Class Selector */}
                        <div>
                            <h3 className="text-xl font-mono font-bold mb-3 text-primary">1. Choose Class</h3>
                            <div className="relative group">
                                <div
                                    ref={scrollContainerRef}
                                    className="flex gap-3 pb-3 -mx-2 px-2 overflow-x-auto no-scrollbar"
                                >
                                    {CHARACTER_CLASSES.map(c => (
                                    <ClassCard key={c.name} characterClass={c} isSelected={selectedClass.name === c.name} onSelect={setSelectedClass} />
                                    ))}
                                </div>
                                <AnimatePresence>
                                {canScrollLeft && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm opacity-50 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleScroll('left')}
                                            aria-label="Scroll left"
                                        >
                                            <ChevronLeftIcon className="w-5 h-5" />
                                        </Button>
                                    </motion.div>
                                )}
                                {canScrollRight && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm opacity-50 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleScroll('right')}
                                            aria-label="Scroll right"
                                        >
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </Button>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                        
                        {/* Appearance Controls */}
                        <div>
                            <h3 className="text-xl font-mono font-bold mb-4 text-primary">2. Customize Appearance</h3>
                            <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border-2 border-border">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <AppearanceControl label="Skin" type="color" value={avatarOptions.skinColor} onUpdate={v => setAvatarOptions(p => ({...p, skinColor: v as string}))} />
                                    <AppearanceControl label="Hair" type="color" value={avatarOptions.hairColor} onUpdate={v => setAvatarOptions(p => ({...p, hairColor: v as string}))} />
                                </div>
                                <AppearanceControl label="Hair Style" type="select" value={avatarOptions.hairStyle} onUpdate={v => setAvatarOptions(p => ({...p, hairStyle: v as any}))} options={['spiky', 'long', 'short', 'bun', 'mohawk']} />
                                <AppearanceControl label="Eye Style" type="select" value={avatarOptions.eyeStyle} onUpdate={v => setAvatarOptions(p => ({...p, eyeStyle: v as any}))} options={['normal', 'happy', 'angry', 'sleepy']} />
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <AppearanceControl label="Outfit" type="color" value={avatarOptions.outfitColor} onUpdate={v => setAvatarOptions(p => ({...p, outfitColor: v as string}))} />
                                    <AppearanceControl label="Accent" type="color" value={avatarOptions.accentColor} onUpdate={v => setAvatarOptions(p => ({...p, accentColor: v as string}))} />
                                </div>
                                <AppearanceControl label="Weapon" type="select" value={avatarOptions.weapon} onUpdate={v => setAvatarOptions(p => ({...p, weapon: v as any}))} options={['none', 'sword', 'staff', 'bow']} />
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <AppearanceControl label="Hat" type="checkbox" value={avatarOptions.hat} onUpdate={v => setAvatarOptions(p => ({...p, hat: v as boolean}))} />
                                    <AppearanceControl label="Cloak" type="checkbox" value={avatarOptions.cloak} onUpdate={v => setAvatarOptions(p => ({...p, cloak: v as boolean}))} />
                                </div>
                           </div>
                        </div>

                        {/* Stats Controls */}
                        <div>
                            <h3 className="text-xl font-mono font-bold mb-4 text-primary">3. Allocate Stats</h3>
                            <div className="p-4 bg-secondary/30 rounded-lg border-2 border-border space-y-4">
                                <div className="text-center p-3 rounded-lg bg-background border-2 border-border">
                                    <p className="font-mono text-muted-foreground">Points Remaining</p>
                                    <p className={cn("text-4xl font-mono font-bold transition-colors", pointsRemaining < 0 ? 'text-destructive' : 'text-primary')}>{pointsRemaining}</p>
                                </div>
                                <div className="space-y-2">
                                    {STAT_NAMES.map(stat => (
                                        <StatControl key={stat} label={stat} value={stats[stat]} onUpdate={v => handleStatUpdate(stat, v)} canIncrement={pointsRemaining > 0}/>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </ModalContent>
        </Modal>
    );
};

const ClassCard: React.FC<{ characterClass: CharacterClass; isSelected: boolean; onSelect: (c: CharacterClass) => void; }> = ({ characterClass, isSelected, onSelect }) => (
    <button
      onClick={() => onSelect(characterClass)}
      className={cn(
        "flex-shrink-0 w-40 p-3 rounded-lg border-2 text-left cursor-pointer transition-all transform hover:-translate-y-1",
        isSelected ? "bg-primary/20 border-primary shadow-lg" : "bg-background border-border hover:border-primary/50"
      )}
    >
      <div className="w-24 h-24 mx-auto bg-secondary rounded-md border-2 border-border mb-2 overflow-hidden">
        <PlayerAvatar options={characterClass.avatar} characterClass={characterClass.name} playing={false} />
      </div>
      <h4 className="font-mono font-bold text-center text-card-foreground">{characterClass.name}</h4>
      <p className="text-xs text-muted-foreground text-center mt-1 h-12 overflow-hidden">{characterClass.description}</p>
    </button>
);


const OptionButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; }> = ({ onClick, isActive, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            'px-2 py-1 text-sm rounded-md border-2 capitalize transition-all font-mono',
            isActive ? 'bg-primary text-primary-foreground border-primary-foreground/20' : 'bg-secondary border-border hover:border-primary/50'
        )}
    >
        {children}
    </button>
);

const AppearanceControl: React.FC<{
    label: string,
    type: 'color' | 'select' | 'checkbox',
    value: string | boolean,
    onUpdate: (value: string | boolean) => void,
    options?: string[]
}> = ({ label, type, value, onUpdate, options = [] }) => {
    if (type === 'select') {
        return (
            <div className="flex items-center justify-between">
                <label className="font-semibold text-muted-foreground">{label}</label>
                <div className="flex gap-1 flex-wrap justify-end">
                    {options.map(o => <OptionButton key={o} onClick={() => onUpdate(o)} isActive={value === o}>{o}</OptionButton>)}
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between">
            <label className="font-semibold text-muted-foreground">{label}</label>
            {type === 'color' ? (
                <input type="color" value={value as string} onChange={e => onUpdate(e.target.value)} className="w-24 h-10 p-1 bg-background border-2 border-input rounded-md" />
            ) : (
                <input type="checkbox" checked={value as boolean} onChange={e => onUpdate(e.target.checked)} className="w-6 h-6 rounded-md accent-primary" />
            )}
        </div>
    );
};

const StatControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className="w-8 h-8 rounded-md bg-secondary border-2 border-border text-lg font-bold disabled:opacity-50 active:bg-primary/20 transition-colors">
      {children}
  </button>
)

const StatControl: React.FC<{ label: string; value: number; onUpdate: (value: number) => void; canIncrement: boolean }> = ({ label, value, onUpdate, canIncrement }) => (
    <div className="grid grid-cols-12 items-center gap-2">
        <label className="col-span-2 text-sm font-semibold uppercase text-muted-foreground">{label}</label>
        <div className="col-span-1 flex justify-center">
            <StatControlButton onClick={() => onUpdate(value - 1)} disabled={value <= MIN_STAT_VALUE}>-</StatControlButton>
        </div>
        <div className="col-span-6">
            <input
                type="range"
                min={MIN_STAT_VALUE}
                max={15}
                value={value}
                onChange={(e) => onUpdate(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
        <div className="col-span-2 text-center text-lg font-mono font-bold">{value}</div>
        <div className="col-span-1 flex justify-center">
            <StatControlButton onClick={() => onUpdate(value + 1)} disabled={value >= 15 || !canIncrement}>+</StatControlButton>
        </div>
    </div>
);


export default CharacterCreator;