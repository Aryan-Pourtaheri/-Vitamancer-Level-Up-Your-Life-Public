import React from 'react';
import { PlayerProfile } from '../../types';
import { xpForLevel } from '../../constants';
import XPBar from './XPBar';
import Button from '../PixelButton';
import { ThemeToggleButton } from '../ThemeToggleButton';

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-4 h-4 text-red-500 pixelated">
        <path d="M6 3h3v1h1v1h1v1h2V5h1V4h1V3h3v1h1v1h1v3h-1v1h-1v1h-1v1h-1v1h-2v-1H9v-1H8V9H7V8H6V5h1V4h-1V3z" />
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
}

const Header: React.FC<HeaderProps> = React.memo(({ playerProfile, onSignOut }) => {
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
            <h2 className="text-xl font-bold truncate font-mono">{playerProfile.name}</h2>
            <p className="text-sm text-muted-foreground">{playerProfile.characterClass}</p>
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
            <div className="hidden sm:block">
              <ThemeToggleButton />
            </div>
            <Button variant="outline" size="sm" onClick={onSignOut}>Quit</Button>
        </div>
      </div>
    </header>
  );
});

export default Header;