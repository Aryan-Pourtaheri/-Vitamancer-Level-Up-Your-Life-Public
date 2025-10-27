
import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import BoardPage from './components/BoardPage';
import { PlayerProfile, Habit, AvatarOptions, Stats } from './types';
import { xpForLevel, createInitialPlayerProfile } from './constants';
import LevelUpModal from './components/LevelUpModal';
import Auth from './components/Auth';
import CharacterCreator from './components/CharacterCreator';
import { ThemeProvider } from './components/ThemeProvider';

const ThemedApp: React.FC = () => {
  const isOffline = !isSupabaseConfigured;

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'board'>('dashboard');
  
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCreatorModalOpen, setCreatorModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ oldLevel: number; newLevel: number } | null>(null);

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [isOffline]);

  const fetchUserData = useCallback(async (user) => {
    if (isOffline || !user) return;
    
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      // Add defaults for new avatar options for backward compatibility
      profileData.avatar_options = {
        hat: false,
        weapon: 'none',
        cloak: false,
        ...profileData.avatar_options,
      };
      setProfile(profileData as PlayerProfile);
    } else {
      setCreatorModalOpen(true);
    }

    if (profileError && profileError.code !== 'PGRST116') { // Ignore 'no rows found'
      console.error('Error fetching profile:', profileError);
    }

    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id);
    
    if (habitsData) {
      setHabits(habitsData);
    }
    if (habitsError) {
      console.error('Error fetching habits:', habitsError);
    }
    setLoading(false);
  }, [isOffline]);


  useEffect(() => {
    if (isOffline) return;
    if (session?.user) {
      fetchUserData(session.user);
    } else {
      setProfile(null);
      setHabits([]);
    }
  }, [session, fetchUserData, isOffline]);

  const gainXP = useCallback(async (amount: number) => {
    if (!profile) return;

    const newXp = profile.xp + amount;
    let newLevel = profile.level;
    let xpToNextLevel = xpForLevel(newLevel);
    let didLevelUp = false;
    let statGains = { maxHp: 0, maxMp: 0, str: 0, int: 0, def: 0, spd: 0 };

    while (newXp >= xpToNextLevel) {
      statGains.maxHp += 10;
      statGains.maxMp += 5;
      statGains.str += 1;
      statGains.int += 1;
      statGains.def += 1;
      statGains.spd += 1;
      newLevel++;
      xpToNextLevel = xpForLevel(newLevel);
      didLevelUp = true;
    }
    
    const updatedProfileData: PlayerProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      maxHp: profile.maxHp + statGains.maxHp,
      hp: profile.maxHp + statGains.maxHp, // Full heal on level up
      maxMp: profile.maxMp + statGains.maxMp,
      mp: profile.maxMp + statGains.maxMp, // Full mana on level up
      stats: {
        ...profile.stats,
        str: profile.stats.str + statGains.str,
        int: profile.stats.int + statGains.int,
        def: profile.stats.def + statGains.def,
        spd: profile.stats.spd + statGains.spd,
      }
    };

    if (isOffline) {
      setProfile(updatedProfileData);
      if (didLevelUp) {
        setLevelUpInfo({ oldLevel: profile.level, newLevel: newLevel });
        setIsLevelUpModalOpen(true);
      }
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updatedProfileData)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update profile XP", error);
    } else if(data) {
      setProfile(data);
       if (didLevelUp) {
        setLevelUpInfo({ oldLevel: profile.level, newLevel: newLevel });
        setIsLevelUpModalOpen(true);
      }
    }
  }, [profile, isOffline]);
  
  const handleUpdateHabit = useCallback(async (habitId: string, updates: Partial<Omit<Habit, 'id' | 'user_id'>>) => {
    const oldHabit = habits.find(h => h.id === habitId);
    if (!oldHabit) return;

    // Grant XP only when moving to 'completed' from another status
    if (updates.status === 'completed' && oldHabit.status !== 'completed') {
        let xpGained = 0;
        switch (oldHabit.difficulty) {
            case 'easy': xpGained = 10; break;
            case 'medium': xpGained = 25; break;
            case 'hard': xpGained = 50; break;
        }
        if (xpGained > 0) gainXP(xpGained);
    }
    
    if (isOffline) {
        setHabits(prev => prev.map(h => h.id === habitId ? { ...h, ...updates } as Habit : h));
        return;
    }

    const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();
    
    if (error) {
        console.error("Failed to update habit", error);
    } else if (data) {
        setHabits(prev => prev.map(h => h.id === habitId ? data : h));
    }
  }, [isOffline, habits, gainXP]);
  
  // FIX: Corrected the Omit type to exclude `created_at`, matching the type returned from the geminiService.
  // This resolves a critical type mismatch that was causing Supabase client type inference to fail.
  const handleAddNewHabits = async (newHabits: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>[]) => {
    if (isOffline) {
      const habitsToAdd = newHabits.map((h, i) => ({
        ...h,
        id: `offline-habit-${Date.now()}-${i}`,
        user_id: 'offline-user',
        status: 'not_started',
      }));
      setHabits(prev => [...prev, ...habitsToAdd]);
      return;
    }

    if (!session?.user) return;
    
    const habitsToInsert = newHabits.map(h => ({ ...h, user_id: session.user.id, status: 'not_started' as const }));

    const { data, error } = await supabase.from('habits').insert(habitsToInsert).select();

    if (error) {
      console.error("Failed to add new habits", error);
    } else if (data) {
      setHabits(prev => [...prev, ...data]);
    }
  };
  
  const handleSignOut = async () => {
    if (isOffline) {
      setProfile(null);
      setHabits([]);
      return;
    }
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setHabits([]);
  };

  const handleCreateProfile = async (name: string, characterClass: string, avatarOptions: AvatarOptions, stats: Stats) => {
    if (isOffline) {
      const newProfile = createInitialPlayerProfile('offline-user', characterClass, name, avatarOptions, stats);
      setProfile(newProfile as PlayerProfile);
      setCreatorModalOpen(false);
      return;
    }

    if (!session?.user) return;
    const newProfile = createInitialPlayerProfile(session.user.id, characterClass, name, avatarOptions, stats);
    
    const { data, error } = await supabase.from('profiles').insert(newProfile).select().single();
    
    if (error) {
      console.error("Failed to create profile", error);
    } else if (data) {
      setProfile(data);
      setCreatorModalOpen(false);
    }
  };

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground font-mono">Loading...</div>;
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      {isOffline && (
        <div className="bg-yellow-500/20 text-yellow-300 text-center p-2 text-sm border-b border-yellow-500/30 fixed top-0 w-full z-50">
          You are in offline mode. Your progress will not be saved.
        </div>
      )}
      <div className={isOffline ? 'pt-10' : ''}>
        {profile ? (
           activeView === 'dashboard' ? (
              <Dashboard
                playerProfile={profile}
                habits={habits}
                onUpdateHabit={handleUpdateHabit}
                onAddNewHabits={handleAddNewHabits}
                onSignOut={handleSignOut}
                onNavigateToBoard={() => setActiveView('board')}
                activeView={activeView}
              />
           ) : (
              <BoardPage
                playerProfile={profile}
                habits={habits}
                onUpdateHabit={handleUpdateHabit}
                onSignOut={handleSignOut}
                onNavigateToDashboard={() => setActiveView('dashboard')}
                activeView={activeView}
              />
           )
        ) : (
          <LandingPage onGetStarted={() => isOffline ? setCreatorModalOpen(true) : setAuthModalOpen(true)} />
        )}
        
        <Auth
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
        
        {isCreatorModalOpen && !profile && (
           <CharacterCreator
              isOpen={isCreatorModalOpen}
              onClose={() => {
                if (isOffline) setCreatorModalOpen(false);
              }}
              onCreateProfile={handleCreateProfile}
          />
        )}

        {isLevelUpModalOpen && levelUpInfo && (
          <LevelUpModal
            level={levelUpInfo.newLevel}
            onClose={() => setIsLevelUpModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  )
}

export default App;
