
import { createClient } from '@supabase/supabase-js';
// FIX: Using `import type` for Row types, as Insert/Update types are now inlined.
import type { PlayerProfile, Habit } from '../types';

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
// FIX: The Supabase client's type inference was failing due to nested imported types for JSON columns (`avatar_options`, `stats`, `inventory`).
// By inlining the shapes of these JSON objects directly into the `Insert` and `Update` definitions,
// we provide a fully-resolved, concrete type that the client can correctly parse, fixing the `never` type issue across the app.
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
          subscription_tier: string;
          avatar_options: {
            skinColor: string;
            hairColor: string;
            hairStyle: 'spiky' | 'long' | 'short' | 'bun' | 'mohawk';
            outfitColor: string;
            accentColor: string;
            eyeStyle: 'normal' | 'happy' | 'angry' | 'sleepy';
            hat: boolean;
            weapon: 'sword' | 'staff' | 'bow' | 'none';
            cloak: boolean;
          };
          stats: {
            str: number;
            int: number;
            def: number;
            spd: number;
          };
          inventory: {
            id: string;
            name: string;
            description: string;
          }[];
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
          subscription_tier?: string;
          pro_features_unlocked_at?: string | null;
          avatar_options?: {
            skinColor: string;
            hairColor: string;
            hairStyle: 'spiky' | 'long' | 'short' | 'bun' | 'mohawk';
            outfitColor: string;
            accentColor: string;
            eyeStyle: 'normal' | 'happy' | 'angry' | 'sleepy';
            hat: boolean;
            weapon: 'sword' | 'staff' | 'bow' | 'none';
            cloak: boolean;
          };
          stats?: {
            str: number;
            int: number;
            def: number;
            spd: number;
          };
          inventory?: {
            id: string;
            name: string;
            description: string;
          }[];
          created_at?: string;
        };
      };
      habits: {
        Row: Habit;
        Insert: {
          user_id: string;
          text: string;
          difficulty: 'easy' | 'medium' | 'hard';
          status: 'not_started' | 'in_progress' | 'completed';
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          status?: 'not_started' | 'in_progress' | 'completed';
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
