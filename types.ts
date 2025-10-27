
export interface Stats {
  str: number;
  int: number;
  def: number;
  spd: number;
}

export interface AvatarOptions {
  skinColor: string;
  hairColor: string;
  hairStyle: 'spiky' | 'long' | 'short' | 'bun' | 'mohawk';
  outfitColor: string;
  accentColor: string;
  eyeStyle: 'normal' | 'happy' | 'angry' | 'sleepy';
  hat: boolean;
  weapon: 'sword' | 'staff' | 'bow' | 'none';
  cloak: boolean;
}

export interface PlayerProfile {
  id: string; // Corresponds to Supabase auth user ID
  name: string;
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  gold: number;
  characterClass: string;
  avatar_options: AvatarOptions;
  stats: Stats;
  inventory: Item[];
  created_at?: string;
  subscription_tier: 'free' | 'pro';
  pro_features_unlocked_at?: string | null;
  last_monster_generation_at?: string | null;
}

export interface Item {
  id: string;
  name:string;
  description: string;
}

export interface Habit {
  id: string;
  user_id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'not_started' | 'in_progress' | 'completed';
  notes?: string | null;
  created_at?: string;
}

export interface Monster {
    id: string;
    user_id: string;
    name: string;
    description: string;
    hp: number;
    maxHp: number;
    linked_habit_id: string;
    created_at?: string;
}

export interface CharacterClass {
  name: string;
  description: string;
  avatar: AvatarOptions;
  baseStats: Stats;
}
