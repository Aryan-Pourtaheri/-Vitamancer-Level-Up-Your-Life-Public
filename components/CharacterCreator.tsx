
import React, { useState, useMemo, useCallback } from 'react';
import Button from './PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './Modal';
import { Input } from './Input';
import { CHARACTER_CLASSES } from '../constants';
import { cn } from '../lib/utils';
import { AvatarOptions, Stats, CharacterClass } from '../types';
import PlayerAvatar from './PlayerAvatar';

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


interface CharacterCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string, characterClass: string, avatarOptions: AvatarOptions, stats: Stats) => void;
}

const MAX_STAT_POINTS = 30;
const MIN_STAT_VALUE = 1;
const STAT_NAMES: (keyof Stats)[] = ['str', 'int', 'def', 'spd'];

const DEFAULT_CHARACTER = {
    name: "",
    class: CHARACTER_CLASSES[0],
    avatar: CHARACTER_CLASSES[0].avatar,
    stats: { str: 7, int: 7, def: 7, spd: 9 }
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={cn('flex-1 p-2 font-mono font-bold text-center border-b-4 transition-colors', active ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground')}>
        {children}
    </button>
);

const StatControl: React.FC<{
    label: string;
    value: number;
    onUpdate: (value: number) => void;
}> = ({ label, value, onUpdate }) => (
    <div className="grid grid-cols-6 items-center gap-3">
        <label className="col-span-2 text-sm font-semibold uppercase text-muted-foreground">{label}</label>
        <div className="col-span-3">
            <input
                type="range"
                min={MIN_STAT_VALUE}
                max={15} // Set a reasonable max for one stat
                value={value}
                onChange={(e) => onUpdate(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
        <div className="col-span-1 text-right text-lg font-mono font-bold">{value}</div>
    </div>
);


const CharacterCreator: React.FC<CharacterCreatorProps> = ({ isOpen, onClose, onCreateProfile }) => {
    const [name, setName] = useState(DEFAULT_CHARACTER.name);
    const [selectedClass, setSelectedClass] = useState<CharacterClass>(DEFAULT_CHARACTER.class);
    const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(DEFAULT_CHARACTER.avatar);
    const [stats, setStats] = useState<Stats>(DEFAULT_CHARACTER.stats);
    
    const [activeTab, setActiveTab] = useState<'appearance' | 'stats'>('appearance');
    const [loading, setLoading] = useState(false);

    const pointsUsed = useMemo(() => STAT_NAMES.reduce((sum, key) => sum + stats[key], 0), [stats]);
    const pointsRemaining = MAX_STAT_POINTS - pointsUsed;

    const handleStatUpdate = (stat: keyof Stats, value: number) => {
        setStats(prev => {
            const currentTotal = pointsUsed - prev[stat];
            const newValue = clamp(value, MIN_STAT_VALUE, 15);
            const newTotal = currentTotal + newValue;
            if (newTotal > MAX_STAT_POINTS) return prev; // Don't allow update if it exceeds total points
            return { ...prev, [stat]: newValue };
        });
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

        // Distribute stat points
        let remainingPoints = MAX_STAT_POINTS - (STAT_NAMES.length * MIN_STAT_VALUE);
        const newStats: Stats = { str: 1, int: 1, def: 1, spd: 1 };
        STAT_NAMES.forEach(stat => {
            const points = Math.round(Math.random() * remainingPoints);
            newStats[stat] += points;
            remainingPoints -= points;
        });
        // Distribute any leftover points
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
        setName(DEFAULT_CHARACTER.name);
        setSelectedClass(DEFAULT_CHARACTER.class);
        setAvatarOptions(DEFAULT_CHARACTER.avatar);
        setStats(DEFAULT_CHARACTER.stats);
    }, []);

    const handleSubmit = async () => {
        if (!name.trim() || pointsRemaining < 0) return;
        setLoading(true);
        await onCreateProfile(name, selectedClass.name, avatarOptions, stats);
        setLoading(false);
    }
    
    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="max-w-5xl">
                <ModalHeader>
                    <ModalTitle className="text-3xl font-mono font-bold">Forge Your Hero</ModalTitle>
                </ModalHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    {/* Left Panel: Preview & Core Info */}
                    <div className="flex flex-col items-center justify-between gap-4">
                        <div className="w-64 h-64 rounded-lg overflow-hidden border-4 border-border bg-secondary shadow-lg">
                           <PlayerAvatar options={avatarOptions} />
                        </div>
                        <div className="w-full max-w-sm space-y-3">
                             <Input
                                id="char-name"
                                placeholder="Enter your hero's name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-center text-lg h-12 font-mono"
                             />
                             <select value={selectedClass.name} onChange={(e) => setSelectedClass(CHARACTER_CLASSES.find(c => c.name === e.target.value) || CHARACTER_CLASSES[0])} className="w-full h-12 rounded-md border-2 border-input bg-background px-3 font-mono text-lg text-center appearance-none">
                                {CHARACTER_CLASSES.map(c => <option key={c.name}>{c.name}</option>)}
                             </select>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={randomize}><DiceIcon className="w-4 h-4 mr-2" /> Randomize</Button>
                            <Button variant="ghost" onClick={reset}><ResetIcon className="w-4 h-4 mr-2" /> Reset</Button>
                        </div>
                    </div>

                    {/* Right Panel: Customization */}
                    <div className="bg-secondary/30 p-4 rounded-lg border-2 border-border">
                        <div className="flex mb-4">
                            <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')}>Appearance</TabButton>
                            <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>Stats</TabButton>
                        </div>
                        {activeTab === 'appearance' && (
                           <div className="space-y-4">
                                <AppearanceControl label="Skin" type="color" value={avatarOptions.skinColor} onUpdate={v => setAvatarOptions(p => ({...p, skinColor: v as string}))} />
                                <AppearanceControl label="Hair Color" type="color" value={avatarOptions.hairColor} onUpdate={v => setAvatarOptions(p => ({...p, hairColor: v as string}))} />
                                <AppearanceControl label="Hair Style" type="select" value={avatarOptions.hairStyle} onUpdate={v => setAvatarOptions(p => ({...p, hairStyle: v as any}))} options={['spiky', 'long', 'short', 'bun', 'mohawk']} />
                                <AppearanceControl label="Eye Style" type="select" value={avatarOptions.eyeStyle} onUpdate={v => setAvatarOptions(p => ({...p, eyeStyle: v as any}))} options={['normal', 'happy', 'angry', 'sleepy']} />
                                <AppearanceControl label="Outfit" type="color" value={avatarOptions.outfitColor} onUpdate={v => setAvatarOptions(p => ({...p, outfitColor: v as string}))} />
                                <AppearanceControl label="Accent" type="color" value={avatarOptions.accentColor} onUpdate={v => setAvatarOptions(p => ({...p, accentColor: v as string}))} />
                                <AppearanceControl label="Weapon" type="select" value={avatarOptions.weapon} onUpdate={v => setAvatarOptions(p => ({...p, weapon: v as any}))} options={['none', 'sword', 'staff', 'bow']} />
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <AppearanceControl label="Hat" type="checkbox" value={avatarOptions.hat} onUpdate={v => setAvatarOptions(p => ({...p, hat: v as boolean}))} />
                                    <AppearanceControl label="Cloak" type="checkbox" value={avatarOptions.cloak} onUpdate={v => setAvatarOptions(p => ({...p, cloak: v as boolean}))} />
                                </div>
                           </div>
                        )}
                        {activeTab === 'stats' && (
                           <div className="space-y-4">
                                <div className="text-center p-2 rounded-lg bg-background border-2 border-border">
                                    <p className="font-mono text-muted-foreground">Points Remaining</p>
                                    <p className={cn("text-4xl font-mono font-bold", pointsRemaining < 0 ? 'text-destructive' : 'text-primary')}>{pointsRemaining}</p>
                                </div>
                                <div className="space-y-3 pt-2">
                                    {STAT_NAMES.map(stat => (
                                        <StatControl key={stat} label={stat} value={stats[stat]} onUpdate={v => handleStatUpdate(stat, v)} />
                                    ))}
                                </div>
                           </div>
                        )}
                    </div>
                </div>
                <div className="pt-6 border-t-2 border-border mt-4">
                    <Button onClick={handleSubmit} disabled={!name.trim() || loading || pointsRemaining < 0} className="w-full" size="lg">
                        {loading ? "Creating Hero..." : "Begin Your Journey"}
                    </Button>
                    {pointsRemaining < 0 && <p className="text-destructive text-center mt-2 text-sm">You have allocated too many stat points!</p>}
                </div>
            </ModalContent>
        </Modal>
    );
};

const AppearanceControl: React.FC<{
    label: string,
    type: 'color' | 'select' | 'checkbox',
    value: string | boolean,
    onUpdate: (value: string | boolean) => void,
    options?: string[]
}> = ({ label, type, value, onUpdate, options = [] }) => (
    <div className="flex items-center justify-between">
        <label className="font-semibold text-muted-foreground">{label}</label>
        {type === 'color' ? (
            <input type="color" value={value as string} onChange={e => onUpdate(e.target.value)} className="w-24 h-10 p-1 bg-background border-2 border-input rounded-md" />
        ) : type === 'select' ? (
             <select value={value as string} onChange={e => onUpdate(e.target.value)} className="w-40 h-10 rounded-md border-2 border-input bg-background px-3 font-mono text-sm">
                {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
        ) : (
            <input type="checkbox" checked={value as boolean} onChange={e => onUpdate(e.target.checked)} className="w-6 h-6 rounded-md accent-primary" />
        )}
    </div>
);


export default CharacterCreator;