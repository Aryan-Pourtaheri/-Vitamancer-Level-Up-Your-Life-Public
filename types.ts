export interface Stats {
  str: number;
  int: number;
  def: number;
  spd: number;
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
  avatar_seed: string;
  stats: Stats;
  inventory: Item[];
  created_at?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface Habit {
  id: string;
  user_id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  created_at?: string;
}

export interface CharacterClass {
  name: string;
  description: string;
  spriteUrl: string;
}
