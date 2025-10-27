
import React from 'react';
import { PlayerProfile, Skill } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { SKILL_TREES } from '../constants';
import SkillNode from './skills/SkillNode';

interface SkillTreePageProps {
  playerProfile: PlayerProfile;
  onUnlockSkill: (skill: Skill) => void;
}

const SkillTreePage: React.FC<SkillTreePageProps> = ({ playerProfile, onUnlockSkill }) => {
  if (!playerProfile.specialization) {
    return (
      <main className="container mx-auto p-4 max-w-4xl text-center">
        <p className="text-muted-foreground">You must choose a specialization at Level 5 to unlock your skill tree.</p>
      </main>
    );
  }

  const skillTree = SKILL_TREES[playerProfile.specialization] || [];

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-mono">{playerProfile.specialization} Skill Tree</CardTitle>
              <p className="text-muted-foreground">Spend your skill points to unlock new abilities.</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary border-2 border-border">
                <p className="font-mono text-muted-foreground">Skill Points</p>
                <p className="text-4xl font-mono font-bold text-primary">{playerProfile.skill_points}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillTree.length > 0 ? (
              skillTree.map(skill => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  playerProfile={playerProfile}
                  onUnlock={onUnlockSkill}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">The skill tree for your specialization is not yet available.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SkillTreePage;
