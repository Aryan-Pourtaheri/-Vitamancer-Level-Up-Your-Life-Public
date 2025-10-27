

import React from 'react';
import { PlayerProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import PlayerAvatar from '../PlayerAvatar';
import Button from '../PixelButton';

const StatRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5 text-sm border-b border-white/5 last:border-b-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold font-mono">{value}</span>
  </div>
);

const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5V3M9 6.8a1 1 0 1 1-1.4-1.4M15 6.8a1 1 0 1 0-1.4-1.4M5.5 10a1 1 0 1 0-2 0M18.5 10a1 1 0 1 1 2 0M12 10a2 2 0 1 0 4 0M8 10a2 2 0 1 1-4 0M12 18v2M9.4 15.5a1 1 0 1 0 1.4 1.4M15 17.2a1 1 0 1 1-1.4-1.4M14 12a2 2 0 1 0 0 4M10 12a2 2 0 1 1 0 4"/></svg>
);


interface StatsPanelProps {
    playerProfile: PlayerProfile;
    onNavigateToSkills: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = React.memo(({ playerProfile, onNavigateToSkills }) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm sticky top-24">
      <CardHeader className="items-center text-center">
        <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-border bg-secondary mb-4">
           <PlayerAvatar 
            options={playerProfile.avatar_options}
            characterClass={playerProfile.characterClass}
           />
        </div>
        <CardTitle className="text-2xl font-mono">{playerProfile.name}</CardTitle>
        <p className="text-primary font-mono">{playerProfile.specialization || playerProfile.characterClass}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {playerProfile.specialization && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <div>
                    <p className="font-mono font-bold text-primary">Skill Points</p>
                    <p className="text-3xl font-mono font-bold text-foreground">{playerProfile.skill_points}</p>
                </div>
            </div>
        )}
        <div className="bg-secondary/50 p-3 rounded-lg">
          <h4 className="font-semibold text-lg text-primary mb-2 font-mono">Attributes</h4>
          <StatRow label="Strength" value={playerProfile.stats.str} />
          <StatRow label="Intelligence" value={playerProfile.stats.int} />
          <StatRow label="Defense" value={playerProfile.stats.def} />
          <StatRow label="Speed" value={playerProfile.stats.spd} />
        </div>
        
        {playerProfile.specialization && (
             <Button onClick={onNavigateToSkills} className="w-full" variant="secondary">
                <BrainCircuitIcon className="w-4 h-4 mr-2" />
                View Skill Tree
            </Button>
        )}

        <div className="bg-secondary/50 p-3 rounded-lg">
          <h4 className="font-semibold text-lg text-primary mb-2 font-mono">Inventory</h4>
          {playerProfile.inventory.length > 0 ? (
              playerProfile.inventory.map(item => (
                  <div key={item.id} className="text-sm text-muted-foreground">{item.name}</div>
              ))
          ) : (
              <p className="text-sm text-muted-foreground italic">Empty</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default StatsPanel;