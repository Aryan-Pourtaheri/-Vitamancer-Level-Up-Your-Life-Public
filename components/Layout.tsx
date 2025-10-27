
import React from 'react';
import { PlayerProfile } from '../types';
import Header from './dashboard/Header';

interface LayoutProps {
  playerProfile: PlayerProfile;
  onSignOut: () => void;
  onNavigateToBoard: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToAccount: () => void;
  onNavigateToDungeon: () => void;
  activeView: 'dashboard' | 'board' | 'account' | 'dungeon';
  dungeonAlert: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  playerProfile, 
  onSignOut, 
  onNavigateToBoard, 
  onNavigateToDashboard, 
  onNavigateToAccount,
  onNavigateToDungeon,
  activeView, 
  dungeonAlert,
  children 
}) => {
  return (
    <div className="w-full min-h-screen bg-secondary/20 flex flex-col">
      <Header 
        playerProfile={playerProfile} 
        onSignOut={onSignOut} 
        onNavigateToBoard={onNavigateToBoard}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToAccount={onNavigateToAccount}
        onNavigateToDungeon={onNavigateToDungeon}
        activeView={activeView}
        dungeonAlert={dungeonAlert}
      />
      {children}
    </div>
  );
};

export default Layout;
