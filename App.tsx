

import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import BoardPage from './components/BoardPage';
import { PlayerProfile, Habit, AvatarOptions, Stats, Monster, Specialization, Skill, Item } from './types';
import { xpForLevel, createInitialPlayerProfile, SPECIALIZATIONS, SKILL_TREES } from './constants';
import LevelUpModal from './components/LevelUpModal';
import CharacterCreator from './components/CharacterCreator';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import AccountPage from './components/AccountPage';
import DungeonPage from './components/DungeonPage';
import { generateMonsterFromHabit } from './services/geminiService';
import SpecializationModal from './components/SpecializationModal';
import SkillTreePage from './components/SkillTreePage';
import ShopPage from './components/ShopPage';

const ThemedApp: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'dashboard' | 'board' | 'account' | 'dungeon' | 'skills' | 'shop'>('dashboard');
  
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isSpecializationModalOpen, setIsSpecializationModalOpen] = useState(false);
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
        const inventory = profileData.inventory || [];
        const skills = profileData.skills || [];
        const avatar_options = { hat: false, weapon: 'none', cloak: false, ...profileData.avatar_options };
        
        const totalPointsFromLevels = profileData.level > 0 ? profileData.level - 1 : 0;
        
        let spentPoints = 0;
        if (profileData.specialization && skills.length > 0) {
            const allSkills = Object.values(SKILL_TREES).flat();
            const unlockedSkills = skills
                .map(skillId => allSkills.find(s => s.id === skillId))
                .filter((s): s is Skill => s !== undefined);
            spentPoints = unlockedSkills.reduce((sum, skill) => sum + skill.cost, 0);
        }
        
        const fetchedProfile: PlayerProfile = {
            ...(profileData as Omit<PlayerProfile, 'skill_points'>),
            inventory,
            skills,
            avatar_options,
            skill_points: totalPointsFromLevels - spentPoints
        };
        
        setProfile(fetchedProfile);
        
        const { data: habitsData, error: habitsError } = await supabase.from('habits').select('*').eq('user_id', user.id);
        if (habitsData) {
            const processedHabits = habitsData.map(h => {
                const notes = h.notes || '';
                const typeMatch = notes.match(/^\[type:(daily|monthly|yearly)\]\s*/);
                const type = typeMatch ? typeMatch[1] : 'daily';
                const cleanNotes = typeMatch ? notes.substring(typeMatch[0].length) : notes;
                
                return { ...h, type: type as Habit['type'], notes: cleanNotes || null };
            });
            setHabits(processedHabits);
            await generateMonstersForFailedHabits(fetchedProfile, habitsData);
        }
        if (habitsError) console.error('Error fetching habits:', habitsError);

        const { data: monsterData, error: monsterError } = await supabase.from('monsters').select('*').eq('user_id', user.id);
        if (monsterData) setMonsters(monsterData);
        if (monsterError) console.error('Error fetching monsters:', monsterError);

    } else {
      setNeedsProfile(true);
    }

    if (profileError && profileError.code !== 'PGRST116') console.error('Error fetching profile:', profileError);
    setLoading(false);
  }, []);

  const generateMonstersForFailedHabits = async (playerProfile: PlayerProfile, currentHabits: Omit<Habit, 'type'>[]) => {
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
                const { data: createdMonster, error } = await supabase.from('monsters').insert([newMonster]).select().single();
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
    let didLevelUp = false;
    let levelsGained = 0;
    
    let statChanges: Stats = { str: 0, int: 0, def: 0, spd: 0 };
    let maxHpChange = 0;
    let maxMpChange = 0;

    if (amount > 0) {
      // Level Up Logic
      let xpToNextLevel = xpForLevel(newLevel);
      while (newXp >= xpToNextLevel) {
        const gains = { maxHp: 10, maxMp: 5, str: 1, int: 1, def: 1, spd: 1 };
        maxHpChange += gains.maxHp;
        maxMpChange += gains.maxMp;
        statChanges.str += gains.str;
        statChanges.int += gains.int;
        statChanges.def += gains.def;
        statChanges.spd += gains.spd;
        newLevel++;
        levelsGained++;
        xpToNextLevel = xpForLevel(newLevel);
        didLevelUp = true;
      }
    } else if (amount < 0) {
      // De-Level Logic
      let xpForCurrentLevel = xpForLevel(newLevel - 1);
      while (newLevel > 1 && newXp < xpForCurrentLevel) {
        const losses = { maxHp: 10, maxMp: 5, str: 1, int: 1, def: 1, spd: 1 };
        maxHpChange -= losses.maxHp;
        maxMpChange -= losses.maxMp;
        statChanges.str -= losses.str;
        statChanges.int -= losses.int;
        statChanges.def -= losses.def;
        statChanges.spd -= losses.spd;
        newLevel--;
        levelsGained--; // Negative levels gained
        xpForCurrentLevel = xpForLevel(newLevel - 1);
      }
    }
    
    const newMaxHp = profile.maxHp + maxHpChange;
    const newMaxMp = profile.maxMp + maxMpChange;
    
    const updatedProfilePayload = {
      xp: Math.max(0, newXp),
      level: newLevel,
      skill_points: profile.skill_points + levelsGained,
      maxHp: Math.max(1, newMaxHp),
      hp: didLevelUp ? newMaxHp : Math.min(profile.hp, newMaxHp), // Heal on level up
      maxMp: Math.max(0, newMaxMp),
      mp: didLevelUp ? newMaxMp : Math.min(profile.mp, newMaxMp), // Restore MP on level up
      stats: {
        str: Math.max(1, profile.stats.str + statChanges.str),
        int: Math.max(1, profile.stats.int + statChanges.int),
        def: Math.max(1, profile.stats.def + statChanges.def),
        spd: Math.max(1, profile.stats.spd + statChanges.spd),
      }
    };
    
    setProfile(p => p ? { ...p, ...updatedProfilePayload } : null);

    if (didLevelUp) {
      setLevelUpInfo({ oldLevel: profile.level, newLevel: newLevel });
      setIsLevelUpModalOpen(true);
      if (newLevel >= 5 && !profile.specialization) {
        setIsSpecializationModalOpen(true);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skill_points, ...dbPayload } = updatedProfilePayload;
    const { error } = await supabase.from('profiles').update(dbPayload).eq('id', profile.id);
    if (error) console.error("Failed to update profile XP", error);
  }, [profile]);
  
  const handleUpdateHabit = useCallback(async (habitId: string, updates: Partial<Omit<Habit, 'id' | 'user_id'>>) => {
    const oldHabit = habits.find(h => h.id === habitId);
    if (!oldHabit) return;

    let xpChange = 0;
    const difficultyMap = { easy: 10, medium: 25, hard: 50 };

    if (updates.status === 'completed' && oldHabit.status !== 'completed') {
        xpChange = difficultyMap[oldHabit.difficulty];
        const monsterToDefeat = monsters.find(m => m.linked_habit_id === habitId);
        if (monsterToDefeat) {
            setMonsters(prev => prev.filter(m => m.id !== monsterToDefeat.id));
            const bonusGold = 5;
            setProfile(p => p ? ({ ...p, gold: p.gold + bonusGold }) : null);
            await supabase.from('monsters').delete().eq('id', monsterToDefeat.id);
            if (profile) await supabase.from('profiles').update({ gold: profile.gold + bonusGold }).eq('id', profile.id);
            console.log(`Monster ${monsterToDefeat.name} defeated! +${bonusGold} gold.`);
        }
    }
    
    if (oldHabit.status === 'completed' && (updates.status === 'not_started' || updates.status === 'in_progress')) {
        xpChange = -difficultyMap[oldHabit.difficulty];
    }
    
    if (xpChange !== 0) {
        gainXP(xpChange);
    }

    const originalHabits = habits;
    const updatedHabits = habits.map(h => h.id === habitId ? { ...h, ...updates } : h);
    setHabits(updatedHabits);
    
    // Omit 'type' from the payload to Supabase and handle notes.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, ...dbUpdates } = updates;

    if (Object.prototype.hasOwnProperty.call(dbUpdates, 'notes')) {
        const cleanNotes = dbUpdates.notes || '';
        dbUpdates.notes = `[type:${oldHabit.type}] ${cleanNotes}`.trim();
    }
    
    const { error } = await supabase.from('habits').update(dbUpdates).eq('id', habitId);
    if (error) {
        console.error("Failed to update habit", error);
        setHabits(originalHabits); // Revert on error
    }
  }, [habits, gainXP, monsters, profile]);
  
  const handleAddNewHabits = async (newHabits: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>[]) => {
    const userId = session?.user?.id;
    if (!userId) {
      console.error("Attempted to add habits without a user session.");
      return;
    }
    
    const habitsToInsert = newHabits.map(h => {
        const { type, ...rest } = h;
        return {
            ...rest,
            user_id: userId,
            status: 'not_started' as const,
            notes: `[type:${type}]`
        };
    });
    
    const { data: insertedHabits, error } = await supabase.from('habits').insert(habitsToInsert).select();
    
    if (error) {
        console.error("Failed to add new habits", error);
    } else if (insertedHabits) {
        const processedNewHabits = insertedHabits.map(h => {
            const notes = h.notes || '';
            const typeMatch = notes.match(/^\[type:(daily|monthly|yearly)\]\s*/);
            const type = typeMatch ? typeMatch[1] : 'daily';
            const cleanNotes = typeMatch ? notes.substring(typeMatch[0].length) : notes;
            return { ...h, type: type as Habit['type'], notes: cleanNotes || null };
        });
        setHabits(prev => [...prev, ...processedNewHabits]);
    }
  };

  const handleAddNewHabit = async (habit: Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>) => {
    await handleAddNewHabits([habit]);
  };

  const handleDeleteHabit = useCallback(async (habitId: string) => {
    const originalHabits = habits;
    const monsterToDelete = monsters.find(m => m.linked_habit_id === habitId);
    
    if (monsterToDelete) {
        const { error: monsterError } = await supabase.from('monsters').delete().eq('id', monsterToDelete.id);
        if (monsterError) {
            console.error("Failed to delete linked monster:", monsterError);
            return; 
        }
        setMonsters(prev => prev.filter(m => m.id !== monsterToDelete.id));
    }

    setHabits(prev => prev.filter(h => h.id !== habitId));
    const { error } = await supabase.from('habits').delete().eq('id', habitId);
    if (error) {
        console.error("Failed to delete habit", error);
        setHabits(originalHabits);
        if (monsterToDelete) fetchUserData(session?.user);
    }
  }, [habits, monsters, session, fetchUserData]);
  
  const handleCreateProfile = async (name: string, characterClass: string, avatarOptions: AvatarOptions, stats: Stats) => {
      const user = session?.user;
      if (!user) return;
      const initialProfileData = createInitialPlayerProfile(user.id, characterClass, name, avatarOptions, stats);
      
      // FIX: The `initialProfileData` object from `createInitialPlayerProfile` does not contain `skill_points`,
      // so it cannot be destructured. The object is already correctly shaped for the database insert.
      const { data, error } = await supabase.from('profiles').insert([initialProfileData]).select().single();
      if (error) {
          console.error("Failed to create profile", error);
      } else if (data) {
          const newProfile: PlayerProfile = {
              ...data,
              inventory: data.inventory || [],
              skills: data.skills || [],
              avatar_options: { hat: false, weapon: 'none', cloak: false, ...data.avatar_options },
              skill_points: 0,
          };
          setProfile(newProfile);
          setNeedsProfile(false);
      }
  };
  
  const handleSelectSpecialization = async (spec: Specialization) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      specialization: spec.name,
      stats: {
        str: profile.stats.str + (spec.statBonus.str || 0),
        int: profile.stats.int + (spec.statBonus.int || 0),
        def: profile.stats.def + (spec.statBonus.def || 0),
        spd: profile.stats.spd + (spec.statBonus.spd || 0),
      }
    };
    
    setProfile(updatedProfile);
    setIsSpecializationModalOpen(false);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skill_points, ...dbPayload } = updatedProfile;
    const { error } = await supabase.from('profiles').update(dbPayload).eq('id', profile.id);
    if (error) {
        console.error("Failed to update specialization:", error);
        setProfile(profile);
    }
  };

  const handleUnlockSkill = async (skill: Skill) => {
    if (!profile || !profile.specialization) return;
    if (profile.skill_points < skill.cost || profile.skills.includes(skill.id)) return;

    const newSkills = [...profile.skills, skill.id];
    const newSkillPoints = profile.skill_points - skill.cost;
    
    const updatedStats: Stats = { ...profile.stats };
    if (skill.statBonus) {
      for (const [stat, bonus] of Object.entries(skill.statBonus)) {
        updatedStats[stat as keyof Stats] += bonus;
      }
    }
    
    const updatedProfile = { ...profile, skills: newSkills, skill_points: newSkillPoints, stats: updatedStats };
    setProfile(updatedProfile);

    const { error } = await supabase.from('profiles').update({ skills: newSkills, stats: updatedStats }).eq('id', profile.id);
    if (error) {
        console.error("Failed to unlock skill", error);
        setProfile(profile);
    }
  };

  const handleBuyItem = async (item: Item) => {
    if (!profile || profile.gold < item.cost || profile.inventory.some(i => i.id === item.id)) return;

    const updatedProfile = {
        ...profile,
        gold: profile.gold - item.cost,
        inventory: [...profile.inventory, item],
        avatar_options: item.weaponType ? { ...profile.avatar_options, weapon: item.weaponType } : profile.avatar_options,
        stats: {
            str: profile.stats.str + (item.statBonus.str || 0),
            int: profile.stats.int + (item.statBonus.int || 0),
            def: profile.stats.def + (item.statBonus.def || 0),
            spd: profile.stats.spd + (item.statBonus.spd || 0),
        }
    };
    setProfile(updatedProfile);
    
    const { error } = await supabase.from('profiles').update({ gold: updatedProfile.gold, inventory: updatedProfile.inventory, avatar_options: updatedProfile.avatar_options, stats: updatedProfile.stats }).eq('id', profile.id);
    if (error) {
        console.error("Failed to buy item", error);
        setProfile(profile); // Revert on failure
    }
  };

  const handleUpgrade = async () => {
    if (!profile) return;
    const updates = {
        subscription_tier: 'pro' as const,
        pro_features_unlocked_at: new Date().toISOString(),
    };
    const originalProfile = profile;
    setProfile(p => p ? ({ ...p, ...updates }) : null);
    
    const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id);
    if (error) {
        console.error("Failed to upgrade subscription", error);
        setProfile(originalProfile);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-mono text-primary animate-pulse">Loading Your Adventure...</p></div>;
  }
  
  if (!session) {
    switch (authView) {
      case 'login': return <LoginPage onNavigateToSignup={() => setAuthView('signup')} onNavigateToLanding={() => setAuthView('landing')} />;
      case 'signup': return <SignupPage onNavigateToLogin={() => setAuthView('login')} onNavigateToLanding={() => setAuthView('landing')} />;
      default: return <LandingPage onSignupClick={() => setAuthView('signup')} onLoginClick={() => setAuthView('login')} />;
    }
  }

  if (needsProfile || !profile) {
    return <CharacterCreator isOpen={true} onClose={() => {}} onCreateProfile={handleCreateProfile} initialName={session.user.email?.split('@')[0]} />;
  }

  return (
    <Layout
      playerProfile={profile}
      onSignOut={() => supabase.auth.signOut()}
      onNavigateToDashboard={() => setActiveView('dashboard')}
      onNavigateToBoard={() => setActiveView('board')}
      onNavigateToAccount={() => setActiveView('account')}
      onNavigateToDungeon={() => setActiveView('dungeon')}
      onNavigateToSkills={() => setActiveView('skills')}
      onNavigateToShop={() => setActiveView('shop')}
      activeView={activeView}
      dungeonAlert={monsters.length > 0}
    >
      {activeView === 'dashboard' && (
        <Dashboard
          playerProfile={profile}
          habits={habits}
          monsters={monsters}
          onUpdateHabit={handleUpdateHabit}
          onAddNewHabits={handleAddNewHabits}
          onAddNewHabit={handleAddNewHabit}
          onDeleteHabit={handleDeleteHabit}
          onNavigateToAccount={() => setActiveView('account')}
          onNavigateToDungeon={() => setActiveView('dungeon')}
          onNavigateToSkills={() => setActiveView('skills')}
        />
      )}
      {activeView === 'board' && <BoardPage habits={habits} onUpdateHabit={handleUpdateHabit} />}
      {activeView === 'account' && <AccountPage playerProfile={profile} onUpgrade={handleUpgrade} />}
      {activeView === 'dungeon' && <DungeonPage monsters={monsters} habits={habits} onUpdateHabit={handleUpdateHabit} />}
      {activeView === 'skills' && <SkillTreePage playerProfile={profile} onUnlockSkill={handleUnlockSkill} />}
      {activeView === 'shop' && <ShopPage playerProfile={profile} onBuyItem={handleBuyItem} />}
      
      {isLevelUpModalOpen && levelUpInfo && (
          <LevelUpModal level={levelUpInfo.newLevel} onClose={() => setIsLevelUpModalOpen(false)} />
      )}
      {isSpecializationModalOpen && profile.level >= 5 && !profile.specialization && (
          <SpecializationModal 
            choices={SPECIALIZATIONS.filter(s => s.baseClass === profile.characterClass)}
            onSelect={handleSelectSpecialization}
          />
      )}
    </Layout>
  );
};


const App: React.FC = () => (
  <ThemeProvider>
    <ThemedApp />
  </ThemeProvider>
);

export default App;