import { createClient } from '@supabase/supabase-js';
import { PlayerProfile, Habit } from '../types';

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
// FIX: Moved Database interface before createClient to ensure Supabase client is typed correctly.
interface Database {
  public: {
    Tables: {
      profiles: {
        Row: PlayerProfile;
        Insert: Omit<PlayerProfile, 'created_at'>;
        Update: Partial<PlayerProfile>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at'>;
        Update: Partial<Habit>;
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
