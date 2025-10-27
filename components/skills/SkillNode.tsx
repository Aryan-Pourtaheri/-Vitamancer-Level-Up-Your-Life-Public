
import React from 'react';
import { PlayerProfile, Skill } from '../../types';
import { cn } from '../../lib/utils';
import Button from '../PixelButton';
import { motion } from 'framer-motion';

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

interface SkillNodeProps {
  skill: Skill;
  playerProfile: PlayerProfile;
  onUnlock: (skill: Skill) => void;
}

const SkillNode: React.FC<SkillNodeProps> = ({ skill, playerProfile, onUnlock }) => {
  const isUnlocked = playerProfile.skills.includes(skill.id);
  const canAfford = playerProfile.skill_points >= skill.cost;
  const hasDependencies = skill.dependencies?.every(depId => playerProfile.skills.includes(depId)) ?? true;
  const isUnlockable = !isUnlocked && canAfford && hasDependencies;

  const stateClasses = {
    unlocked: 'border-green-500/50 bg-green-500/10',
    unlockable: 'border-primary/50 bg-primary/10 hover:border-primary',
    locked: 'border-border bg-secondary/50 opacity-60',
  };

  const currentState = isUnlocked ? 'unlocked' : (isUnlockable ? 'unlockable' : 'locked');
  
  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("p-4 rounded-lg border-2 flex items-center gap-4 transition-colors", stateClasses[currentState])}
    >
        <div className="flex-grow">
            <h3 className="text-xl font-mono font-bold flex items-center gap-2">
                {isUnlocked && <CheckIcon className="w-5 h-5 text-green-400" />}
                {currentState === 'locked' && !hasDependencies && <LockIcon className="w-4 h-4 text-muted-foreground" />}
                {skill.name}
            </h3>
            <p className="text-muted-foreground text-sm my-1">{skill.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
                <div className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    Cost: {skill.cost} SP
                </div>
                {skill.statBonus && Object.entries(skill.statBonus).map(([stat, val]) => (
                    <div key={stat} className="font-mono text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                        +{val} {stat.toUpperCase()}
                    </div>
                ))}
            </div>
        </div>
        <div className="w-32 flex-shrink-0">
            {isUnlocked ? (
                <Button variant="outline" disabled className="w-full">Learned</Button>
            ) : (
                <Button 
                    onClick={() => onUnlock(skill)}
                    disabled={!isUnlockable}
                    className="w-full"
                >
                    Unlock
                </Button>
            )}
        </div>
    </motion.div>
  );
};

export default SkillNode;
