

import React from 'react';
import { PlayerProfile } from '../../types';
import { xpForLevel } from '../../constants';
import XPBar from './XPBar';
import Button from '../PixelButton';
import { ThemeToggleButton } from '../ThemeToggleButton';

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-4 h-4 text-red-500 pixelated">
        <path d="M6 3h3v1h1v1h1v1h2V5h1V4h1V3h3v1h1v1h1v3h-1v1h-1v1h-1v1h-2v-1H9v-1H8V9H7V8H6V5h1V4h-1V3z" />
    </svg>
);

const ManaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-4 h-4 text-blue-400 pixelated">
        <path d="M12 4h1v1h1v1h1v2h-1v1h-1v1h-1v1h-1v-1H9v-1H8V8H7V6h1V5h1V4h2z m-1 8h3v1h1v1h-1v1h-1v1h-1v-1H9v-1h1v-1h1v-1z" />
    </svg>
);

const GoldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-4 h-4 text-yellow-400 pixelated">
        <path d="M9 4h6v1h1v1h1v10h-1v1h-1v1H9v-1H8v-1H7V6h1V5h1V4z m1 2v10h4V6h-4z m1 2h2v1h-2V8z m0 3h2v1h-2v-1z" />
    </svg>
);

const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const LayoutGridIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const SwordsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 21-5-5-6 6"/><path d="m21 15-5-5-6 6"/><path d="M3.5 14.5 10 8"/><path d="M9.5 3.5 16 10"/></svg>
);

const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5V3M9 6.8a1 1 0 1 1-1.4-1.4M15 6.8a1 1 0 1 0-1.4-1.4M5.5 10a1 1 0 1 0-2 0M18.5 10a1 1 0 1 1 2 0M12 10a2 2 0 1 0 4 0M8 10a2 2 0 1 1-4 0M12 18v2M9.4 15.5a1 1 0 1 0 1.4 1.4M15 17.2a1 1 0 1 1-1.4-1.4M14 12a2 2 0 1 0 0 4M10 12a2 2 0 1 1 0 4"/></svg>
);

const StorefrontIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 7 5 5-5 5"/><path d="M12 12H3"/><path d="M18 4h1a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-1"/><path d="M5 21V3a1 1 0 0 1 1-1h1"/></svg>
);


const StatDisplay: React.FC<{ icon: React.ReactNode; value: number | string; }> = ({ icon, value }) => (
    <div className="flex items-center space-x-1.5 text-sm bg-secondary/50 px-2 py-1 rounded-md">
        {icon}
        <span className="font-mono font-bold text-base text-foreground">{value}</span>
    </div>
);

// FIX: Define HeaderProps interface
interface HeaderProps {
  playerProfile: PlayerProfile;
  onSignOut: () => void;
  onNavigateToBoard: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToAccount: () => void;
  onNavigateToDungeon: () => void;
  onNavigateToSkills: () => void;
  onNavigateToShop: () => void;
  activeView: 'dashboard' | 'board' | 'account' | 'dungeon' | 'skills' | 'shop';
  dungeonAlert: boolean;
}

const Header: React.FC<HeaderProps> = React.memo(({ playerProfile, onSignOut, onNavigateToBoard, onNavigateToDashboard, onNavigateToAccount, onNavigateToDungeon, onNavigateToSkills, onNavigateToShop, activeView, dungeonAlert }) => {
  const xpToNext = xpForLevel(playerProfile.level);
  const xpCurrentLevel = xpForLevel(playerProfile.level - 1) || 0;
  const currentLevelProgress = playerProfile.xp - xpCurrentLevel;
  const xpNeededForLevel = xpToNext - xpCurrentLevel;
  
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b-4 border-border p-3 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 grid place-content-center w-14 h-14 bg-secondary rounded-md border-2 border-border">
            <span className="font-mono text-xl font-bold text-primary">Lvl {playerProfile.level}</span>
          </div>
          <div className="w-48">
            <h2 className="text-xl font-bold truncate font-mono flex items-center gap-2">
                {playerProfile.name}
                {playerProfile.subscription_tier === 'pro' && (
                    <span className="text-xs font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-sm tracking-wider">PRO</span>
                )}
            </h2>
            <p className="text-sm text-muted-foreground">{playerProfile.specialization || playerProfile.characterClass}</p>
          </div>
        </div>
        <div className="flex-grow max-w-xs w-full">
            <XPBar currentValue={currentLevelProgress} maxValue={xpNeededForLevel} />
            <p className="text-xs text-center text-muted-foreground mt-1 font-mono">{currentLevelProgress.toFixed(0)} / {xpNeededForLevel.toFixed(0)} XP</p>
        </div>
        <div className="flex items-center gap-x-2">
            <StatDisplay icon={<HeartIcon />} value={`${playerProfile.hp}/${playerProfile.maxHp}`} />
            <StatDisplay icon={<ManaIcon />} value={`${playerProfile.mp}/${playerProfile.maxMp}`} />
            <StatDisplay icon={<GoldIcon />} value={playerProfile.gold} />
             
            <nav className="hidden sm:flex items-center gap-1">
                <Button variant={activeView === 'dashboard' ? 'secondary' : 'outline'} size="sm" onClick={onNavigateToDashboard} className="items-center gap-1.5"><LayoutGridIcon className="h-4 w-4" /> List</Button>
                <Button variant={activeView === 'board' ? 'secondary' : 'outline'} size="sm" onClick={onNavigateToBoard} className="items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> Board</Button>
                <Button variant={activeView === 'shop' ? 'secondary' : 'outline'} size="sm" onClick={onNavigateToShop} className="items-center gap-1.5"><StorefrontIcon className="h-4 w-4" /> Shop</Button>
                {playerProfile.specialization && (
                    <Button variant={activeView === 'skills' ? 'secondary' : 'outline'} size="sm" onClick={onNavigateToSkills} className="items-center gap-1.5">
                        <BrainCircuitIcon className="h-4 w-4" /> Skills
                    </Button>
                )}
                <Button variant={activeView === 'dungeon' ? 'secondary' : 'outline'} size="sm" onClick={onNavigateToDungeon} className="relative items-center gap-1.5">
                    <SwordsIcon className="h-4 w-4" /> Dungeon
                    {dungeonAlert && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-destructive/80"></span></span>}
                </Button>
            </nav>
            
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={onNavigateToAccount}>
                    <UserIcon className="h-4 w-4" />
                </Button>
                
                <div className="hidden sm:block">
                  <ThemeToggleButton />
                </div>
                <Button variant="outline" size="sm" onClick={onSignOut}>Quit</Button>
            </div>
        </div>
      </div>
    </header>
  );
});

export default Header;