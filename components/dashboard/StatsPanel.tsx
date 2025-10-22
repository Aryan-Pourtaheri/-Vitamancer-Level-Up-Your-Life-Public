
import React from 'react';
import { PlayerProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import PlayerAvatar from '../PlayerAvatar';

const StatRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5 text-sm border-b border-white/5 last:border-b-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold font-mono">{value}</span>
  </div>
);

const StatsPanel: React.FC<{ playerProfile: PlayerProfile }> = React.memo(({ playerProfile }) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm sticky top-24">
      <CardHeader className="items-center text-center">
        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-border bg-secondary mb-4">
           <PlayerAvatar 
            options={playerProfile.avatar_options}
            className="animate-breathing"
           />
        </div>
        <CardTitle className="text-2xl font-mono">{playerProfile.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-secondary/50 p-3 rounded-lg">
          <h4 className="font-semibold text-lg text-primary mb-2 font-mono">Attributes</h4>
          <StatRow label="Strength" value={playerProfile.stats.str} />
          <StatRow label="Intelligence" value={playerProfile.stats.int} />
          <StatRow label="Defense" value={playerProfile.stats.def} />
          <StatRow label="Speed" value={playerProfile.stats.spd} />
        </div>

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