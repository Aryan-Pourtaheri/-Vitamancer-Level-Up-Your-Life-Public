import { createClient } from '@supabase/supabase-js';
// FIX: Using `import type` and importing all nested types to ensure the Database interface can be fully resolved.
import type { PlayerProfile, Habit, AvatarOptions, Stats, Item } from '../types';

// IMPORTANT: These values must be provided via environment variables.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if the provided values are valid and not the placeholders.
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder.supabase.co') && 
  !supabaseAnonKey.includes('placeholder-anon-key')
);

if (!isSupabaseConfigured) {
  console.warn("Supabase is not configured. Please provide SUPABASE_URL and SUPABASE_ANON_KEY environment variables. The application will not connect to a database.");
}

// We pass placeholders if not configured to prevent `createClient` from throwing an error.
// The application logic in App.tsx will gate functionality based on `isSupabaseConfigured`.
// FIX: Replaced Omit/Partial with explicit types to resolve a Supabase client type inference issue.
// The TypeScript compiler was failing to resolve the nested generic types, causing all supabase calls to be typed as `never`.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: PlayerProfile;
        Insert: {
          id: string;
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
        };
        Update: {
          id?: string;
          name?: string;
          level?: number;
          xp?: number;
          hp?: number;
          maxHp?: number;
          mp?: number;
          maxMp?: number;
          gold?: number;
          characterClass?: string;
          avatar_options?: AvatarOptions;
          stats?: Stats;
          inventory?: Item[];
          created_at?: string;
        };
      };
      habits: {
        Row: Habit;
        Insert: {
          user_id: string;
          text: string;
          difficulty: 'easy' | 'medium' | 'hard';
          completed: boolean;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          completed?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);
