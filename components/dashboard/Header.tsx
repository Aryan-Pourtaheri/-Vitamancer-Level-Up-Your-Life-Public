import React from 'react';
import { PlayerProfile } from '../../types';
import { xpForLevel } from '../../constants';
import XPBar from './XPBar';
import Button from '../PixelButton';
import { ThemeToggleButton } from '../ThemeToggleButton';

interface HeaderProps {
  playerProfile: PlayerProfile;
  onSignOut: () => void;
}

const StatDisplay: React.FC<{ label: string; value: number | string; className?: string }> = ({ label, value, className }) => (
    <div className="flex items-baseline space-x-2 text-sm">
        <span className="font-semibold text-muted-foreground">{label}:</span>
        <span className={`font-bold text-lg ${className}`}>{value}</span>
    </div>
);

const Header: React.FC<HeaderProps> = ({ playerProfile, onSignOut }) => {
  const xpToNext = xpForLevel(playerProfile.level);
  const xpCurrentLevel = xpForLevel(playerProfile.level - 1) || 0;
  const currentLevelProgress = playerProfile.xp - xpCurrentLevel;
  const xpNeededForLevel = xpToNext - xpCurrentLevel;
  
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border p-3 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 grid place-content-center w-14 h-14 bg-secondary rounded-md border border-border">
            <span className="text-xl font-bold text-primary">Lvl {playerProfile.level}</span>
          </div>
          <div className="w-48">
            <h2 className="text-xl font-bold truncate">{playerProfile.name}</h2>
            <p className="text-sm text-muted-foreground">{playerProfile.characterClass}</p>
          </div>
        </div>
        <div className="flex-grow max-w-xs w-full">
            <XPBar currentValue={currentLevelProgress} maxValue={xpNeededForLevel} />
            <p className="text-xs text-center text-muted-foreground mt-1">{currentLevelProgress.toFixed(0)} / {xpNeededForLevel.toFixed(0)} XP</p>
        </div>
        <div className="flex items-center gap-x-2">
            <StatDisplay label="HP" value={`${playerProfile.hp}/${playerProfile.maxHp}`} className="text-red-400" />
            <StatDisplay label="MP" value={`${playerProfile.mp}/${playerProfile.maxMp}`} className="text-blue-400" />
            <StatDisplay label="Gold" value={playerProfile.gold} className="text-yellow-400" />
            <div className="hidden sm:block">
              <ThemeToggleButton />
            </div>
            <Button variant="outline" size="sm" onClick={onSignOut}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;