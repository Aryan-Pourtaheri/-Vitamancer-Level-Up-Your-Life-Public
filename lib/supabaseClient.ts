

import { createClient, Session, User } from '@supabase/supabase-js';
// FIX: Using `import type` for Row types, as Insert/Update types are now inlined.
import type { PlayerProfile, Habit, Monster } from '../types';

// IMPORTANT: These values are now sourced from your Supabase project.
const supabaseUrl = process.env.SUPABASE_URL || 'https://pjvtduedgcanrslcetzh.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdnRkdWVkZ2NhbnJzbGNldHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzM3NzUsImV4cCI6MjA3NzE0OTc3NX0.XYgfiy1qjKKWs4Qe5wSBEWYusKqLDZ1mBlRyKHD80m8';

// --- DATABASE CONNECTION ---
// The application is now configured to connect to a real Supabase backend.
export const isSupabaseConfigured = true;


// --- REAL SUPABASE CLIENT ---
// This client is only used if `isSupabaseConfigured` is set to `true`.
const realSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


// --- MOCK SUPABASE CLIENT FOR DEMO MODE ---
let authStateChangeListener: ((event: string, session: Session | null) => void) | null = null;
const FAKE_SESSION_KEY = 'vitamancer.demo.session';

const getMockSession = (): Session | null => {
  try {
    const sessionStr = localStorage.getItem(FAKE_SESSION_KEY);
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    if (session.expires_at < Date.now() / 1000) {
      localStorage.removeItem(FAKE_SESSION_KEY);
      return null;
    }
    return session;
  } catch (e) { return null; }
};

const createFakeUser = (email: string): User => ({
  id: 'mock-user-' + email.split('@')[0],
  email: email,
  app_metadata: { provider: 'email' },
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  identities: [],
});

const mockSupabaseClient = {
  auth: {
    getSession: async () => Promise.resolve({ data: { session: getMockSession() }, error: null }),
    signInWithPassword: async ({ email, password }: any) => {
      if (!email || !password) return Promise.resolve({ data: { session: null }, error: { message: 'Email and password are required.' } });
      const user = createFakeUser(email);
      const session: Session = {
        access_token: 'fake-access-token',
        token_type: 'bearer',
        user: user,
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
      };
      localStorage.setItem(FAKE_SESSION_KEY, JSON.stringify(session));
      if (authStateChangeListener) authStateChangeListener('SIGNED_IN', session);
      return Promise.resolve({ data: { session, user }, error: null });
    },
    signUp: async ({ email, password }: any) => {
      if (!email || !password) return Promise.resolve({ data: { session: null }, error: { message: 'Email and password are required.' } });
      if (localStorage.getItem(`vitamancer.demo.db.profiles`)?.includes(`"id":"mock-user-${email.split('@')[0]}"`)) {
        return Promise.resolve({ data: { user: null, session: null }, error: { message: 'User already registered' } });
      }
      const user = createFakeUser(email);
      return Promise.resolve({ data: { user, session: null }, error: null });
    },
    signOut: async () => {
      localStorage.removeItem(FAKE_SESSION_KEY);
      if (authStateChangeListener) authStateChangeListener('SIGNED_OUT', null);
      return Promise.resolve({ error: null });
    },
    onAuthStateChange: (event: string, callback: (event: string, session: Session | null) => void) => {
      authStateChangeListener = callback;
      return { data: { subscription: { unsubscribe: () => { authStateChangeListener = null; } } } };
    },
    signInWithOAuth: async ({ provider }: any) => mockSupabaseClient.auth.signInWithPassword({ email: `${provider}-user@example.com`, password: 'mockpassword' }),
  },
  from: (table: string) => {
    const tableKey = `vitamancer.demo.db.${table}`;
    const getTableData = (): any[] => JSON.parse(localStorage.getItem(tableKey) || '[]');
    const setTableData = (data: any[]) => localStorage.setItem(tableKey, JSON.stringify(data));

    return {
      select: () => ({
        eq: (col: string, val: any) => {
            const allData = getTableData();
            const filteredData = allData.filter(item => item[col] === val);
            return {
                single: () => Promise.resolve({ data: filteredData[0] || null, error: null, code: filteredData.length > 0 ? undefined : 'PGRST116' }),
                then: (resolve: any) => resolve({ data: filteredData, error: null })
            }
        },
        then: (resolve: any) => resolve({ data: getTableData(), error: null })
      }),
      insert: (newData: any) => {
          const data = getTableData();
          const toInsert = Array.isArray(newData) ? newData : [newData];
          const newItems = toInsert.map(item => ({ ...item, id: item.id || `mock-${Date.now()}-${Math.random()}`, created_at: new Date().toISOString() }));
          setTableData([...data, ...newItems]);
          return {
              select: () => ({
                single: () => Promise.resolve({data: newItems[0], error: null }),
                then: (resolve: any) => resolve({ data: newItems, error: null })
              }),
          }
      },
      update: (updates: any) => ({
        eq: (col: string, val: any) => {
            let data = getTableData();
            let updatedItem: any = null;
            const newData = data.map(item => {
                if(item[col] === val) {
                    updatedItem = {...item, ...updates};
                    return updatedItem;
                }
                return item;
            });
            setTableData(newData);
            return { select: () => ({ single: () => Promise.resolve({ data: updatedItem, error: null }) }) }
        }
      }),
      delete: () => ({
        eq: (col: string, val: any) => {
            const data = getTableData();
            const newData = data.filter(item => item[col] !== val);
            setTableData(newData);
            return Promise.resolve({ data: null, error: null });
        }
      })
    };
  }
};


export const supabase = isSupabaseConfigured ? realSupabase : (mockSupabaseClient as any);


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
          specialization: string | null;
          skill_points: number;
          skills: string[];
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
          last_monster_generation_at?: string | null;
          specialization?: string | null;
          skill_points?: number;
          skills?: string[];
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
      monsters: {
        Row: Monster;
        Insert: {
            user_id: string;
            name: string;
            description: string;
            hp: number;
            maxHp: number;
            linked_habit_id: string;
        };
        Update: {
            id?: string;
            hp?: number;
        }
      }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}