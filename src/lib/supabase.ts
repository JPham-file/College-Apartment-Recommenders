import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Exposing these is ok because of Row Level Security (RLS)
const supabaseUrl = process.env.EXPO_PUBLIC_DATABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_DATABASE_KEY!;

export const db = async (supabaseAccessToken: string) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });
  return supabase;
};

