
import React from 'react';
import { PlayerProfile } from '../types';
import Header from './dashboard/Header';

interface LayoutProps {
  playerProfile: PlayerProfile;
  onSignOut: () => void;
  onNavigateToBoard: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToAccount: () => void;
  activeView: 'dashboard' | 'board' | 'account';
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  playerProfile, 
  onSignOut, 
  onNavigateToBoard, 
  onNavigateToDashboard, 
  onNavigateToAccount,
  activeView, 
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
        activeView={activeView}
      />
      {children}
    </div>
  );
};

export default Layout;
