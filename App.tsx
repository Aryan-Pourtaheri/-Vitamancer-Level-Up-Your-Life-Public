

import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import BoardPage from './components/BoardPage';
import { PlayerProfile, Habit, AvatarOptions, Stats, Monster } from './types';
import { xpForLevel, createInitialPlayerProfile } from './constants';
import LevelUpModal from './components/LevelUpModal';
import CharacterCreator from './components/CharacterCreator';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import AccountPage from './components/AccountPage';
import DungeonPage from './components/DungeonPage';
import { generateMonsterFromHabit } from './services/geminiService';

const ThemedApp: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'board' | 'account' | 'dungeon'>('dashboard');
  
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ oldLevel: number; newLevel: number } | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setAuthView('landing');
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  const fetchUserData = useCallback(async (user) => {
    if (!user) {
      setLoading(false);
      return;
    };
    
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
        profileData.avatar_options = { hat: false, weapon: 'none', cloak: false, ...profileData.avatar_options };
        const fetchedProfile = profileData as PlayerProfile;
        setProfile(fetchedProfile);
        
        const { data: habitsData, error: habitsError } = await supabase.from('habits').select('*').eq('user_id', user.id);
        if (habitsData) setHabits(habitsData);
        if (habitsError) console.error('Error fetching habits:', habitsError);

        const { data: monsterData, error: monsterError } = await supabase.from('monsters').select('*').eq('user_id', user.id);
        if (monsterData) setMonsters(monsterData);
        if (monsterError) console.error('Error fetching monsters:', monsterError);
        
        // This is where monster generation logic is triggered
        await generateMonstersForFailedHabits(fetchedProfile, habitsData || []);

    } else {
      setNeedsProfile(true);
    }

    if (profileError && profileError.code !== 'PGRST116') console.error('Error fetching profile:', profileError);
    setLoading(false);
  }, []);

  const generateMonstersForFailedHabits = async (playerProfile: PlayerProfile, currentHabits: Habit[]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastGenerationDate = playerProfile.last_monster_generation_at ? new Date(playerProfile.last_monster_generation_at) : null;

      if (!lastGenerationDate || lastGenerationDate < today) {
        console.log("Generating monsters for the new day...");
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const failedHabits = currentHabits.filter(h => {
            const habitDate = new Date(h.created_at!);
            return habitDate.toDateString() === yesterday.toDateString() && h.status !== 'completed';
        });

        if (failedHabits.length > 0) {
            for (const habit of failedHabits) {
                const monsterDetails = await generateMonsterFromHabit(habit.text, habit.difficulty);
                const newMonster: Omit<Monster, 'id' | 'created_at'> = {
                    user_id: playerProfile.id,
                    name: monsterDetails.name,
                    description: monsterDetails.description,
                    hp: monsterDetails.hp,
                    maxHp: monsterDetails.hp,
                    linked_habit_id: habit.id,
                };
                const { data: createdMonster, error } = await supabase.from('monsters').insert(newMonster).select().single();
                if (error) {
                    console.error("Failed to save monster:", error);
                } else if (createdMonster) {
                    setMonsters(prev => [...prev, createdMonster]);
                }
            }
        }

        const { error: profileUpdateError } = await supabase.from('profiles')
            .update({ last_monster_generation_at: today.toISOString() })
            .eq('id', playerProfile.id);
        
        if (profileUpdateError) console.error("Failed to update last monster generation date:", profileUpdateError);
      }
  };

  useEffect(() => {
    if (session?.user) {
      setProfile(null);
      setNeedsProfile(false);
      fetchUserData(session.user);
    } else {
      setProfile(null);
      setHabits([]);
      setMonsters([]);
      setLoading(false);
    }
  }, [session, fetchUserData]);

  const gainXP = useCallback(async (amount: number) => {
    if (!profile) return;

    const newXp = profile.xp + amount;
    let newLevel = profile.level;
    let xpToNextLevel = xpForLevel(newLevel);
    let didLevelUp = false;
    let statGains = { maxHp: 0, maxMp: 0, str: 0, int: 0, def: 0, spd: 0 };

    while (newXp >= xpToNextLevel) {
      statGains = { maxHp: 10, maxMp: 5, str: 1, int: 1, def: 1, spd: 1 };
      newLevel++;
      xpToNextLevel = xpForLevel(newLevel);
      didLevelUp = true;
    }
    
    const updatedProfileData = {
      ...profile,
      xp: newXp,
      level: newLevel,
      maxHp: profile.maxHp + statGains.maxHp,
      hp: profile.maxHp + statGains.maxHp,
      maxMp: profile.maxMp + statGains.maxMp,
      mp: profile.maxMp + statGains.maxMp,
      stats: {
        str: profile.stats.str + statGains.str,
        int: profile.stats.int + statGains.int,
        def: profile.stats.def + statGains.def,
        spd: profile.stats.spd + statGains.spd,
      }
    };
    
    setProfile(updatedProfileData);
    if (didLevelUp) {
      setLevelUpInfo({ oldLevel: profile.level, newLevel: newLevel });
      setIsLevelUpModalOpen(true);
    }

    const { error } = await supabase.from('profiles').update(updatedProfileData).eq('id', profile.id);
    if (error) console.error("Failed to update profile XP", error);
  }, [profile]);
  
  const handleUpdateHabit = useCallback(async (habitId: string, updates: Partial<Omit<Habit, 'id' | 'user_id'>>) => {
    const oldHabit = habits.find(h => h.id === habitId);
    if (!oldHabit) return;

    if (updates.status === 'completed' && oldHabit.status !== 'completed') {
        let xpGained = 0;
        switch (oldHabit.difficulty) {
            case 'easy': xpGained = 10; break;
            case 'medium': xpGained = 25; break;
            case 'hard': xpGained = 50; break;
        }
        if (xpGained > 0) gainXP(xpGained);

        // Monster defeat logic
        const monsterToDefeat = monsters.find(m => m.linked_habit_id === habitId);
        if (monsterToDefeat) {
            setMonsters(prev => prev.filter(m => m.id !== monsterToDefeat.id));
            const bonusGold = 5;
            setProfile(p => p ? ({ ...p, gold: p.gold + bonusGold }) : null);

            // Update DB
            await supabase.from('monsters').delete().eq('id', monsterToDefeat.id);
            if (profile) await supabase.from('profiles').update({ gold: profile.gold + bonusGold }).eq('id', profile.id);

            // TODO: Add a nice toast/notification for monster defeat!
            console.log(`Monster ${monsterToDefeat.name} defeated! +${bonusGold} gold.`);
        }
    }

    const updatedHabits = habits.map(h => h.id === habitId ? { ...h, ...updates } : h);
    setHabits(updatedHabits);
    
    const { error } = await supabase.from('habits').update(updates).eq('id', habitId);
    if (error) console.error("Failed to update habit", error);
  }, [habits, gainXP, monsters, profile]);
  
  const handleAddNewHabits = async (newHabits: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>[]) => {
    const userId = session?.user?.id;
    if (!userId) {
      console.error("Attempted to add habits without a user session.");
      return;
    }
    
    const habitsToInsert = newHabits.map(h => ({ ...h, user_id: userId, status: 'not_started' as const }));
    
    const { data: insertedHabits, error } = await supabase
      .from('habits')
      .insert(habitsToInsert)
      .select();

    if (error) {
      console.error("Failed to add new habits", error);
    } else if (insertedHabits) {
      setHabits(prev => [...prev, ...insertedHabits]);
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setHabits([]);
    setMonsters([]);
  };

  const handleCreateProfile = async (name: string, characterClass: string, avatarOptions: AvatarOptions, stats: Stats) => {
    if (!session?.user) return;
    const newProfile = createInitialPlayerProfile(session.user.id, characterClass, name, avatarOptions, stats);
    const { data, error } = await supabase.from('profiles').insert(newProfile).select().single();
    if (error) {
      console.error("Failed to create profile", error);
    } else if (data) {
      setProfile(data as PlayerProfile);
      setNeedsProfile(false);
    }
  };

  const handleUpgrade = async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ subscription_tier: 'pro', pro_features_unlocked_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select().single();
    if (error) {
      console.error("Failed to upgrade subscription", error);
    } else if (data) {
      setProfile(data as PlayerProfile);
      setActiveView('dashboard');
    }
  };

  const renderUnauthenticatedOnline = () => {
    switch (authView) {
      case 'login': return <LoginPage onNavigateToSignup={() => setAuthView('signup')} onNavigateToLanding={() => setAuthView('landing')} />;
      case 'signup': return <SignupPage onNavigateToLogin={() => setAuthView('login')} onNavigateToLanding={() => setAuthView('landing')} />;
      case 'landing': default: return (
        <LandingPage onSignupClick={() => setAuthView('signup')} onLoginClick={() => setAuthView('login')} />
      );
    }
  };

  const renderContent = () => {
    if (loading) {
        return <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground font-mono">Loading your adventure...</div>;
    }
    
    if (profile) {
      return (
        <>
          <Layout
            playerProfile={profile}
            onSignOut={handleSignOut}
            onNavigateToBoard={() => setActiveView('board')}
            onNavigateToDashboard={() => setActiveView('dashboard')}
            onNavigateToAccount={() => setActiveView('account')}
            onNavigateToDungeon={() => setActiveView('dungeon')}
            activeView={activeView}
            dungeonAlert={monsters.length > 0}
          >
            {activeView === 'dashboard' && <Dashboard playerProfile={profile} habits={habits} onUpdateHabit={handleUpdateHabit} onAddNewHabits={handleAddNewHabits} onNavigateToAccount={() => setActiveView('account')} onNavigateToDungeon={() => setActiveView('dungeon')} monsters={monsters} />}
            {activeView === 'board' && <BoardPage habits={habits} onUpdateHabit={handleUpdateHabit} />}
            {activeView === 'account' && <AccountPage playerProfile={profile} onUpgrade={handleUpgrade} />}
            {activeView === 'dungeon' && <DungeonPage monsters={monsters} habits={habits} onUpdateHabit={handleUpdateHabit} />}
          </Layout>
          {isLevelUpModalOpen && levelUpInfo && <LevelUpModal level={levelUpInfo.newLevel} onClose={() => setIsLevelUpModalOpen(false)} />}
        </>
      );
    }

    if (needsProfile) {
      return <CharacterCreator isOpen={true} onClose={() => setNeedsProfile(false)} onCreateProfile={handleCreateProfile} />;
    }
    
    return renderUnauthenticatedOnline();
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      {renderContent()}
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
