import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Exposing these is ok because of Row Level Security (RLS)
const supabaseUrl = "https://ihnradjuxnddmmioyeqp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobnJhZGp1eG5kZG1taW95ZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5NDkyODcsImV4cCI6MjAyMzUyNTI4N30.cebjm2GbItaRLa81OYTi3Suffy8u52hO3lSRgjrK5r8";

export const supabaseClient = async (supabaseAccessToken: string) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });
  return supabase;
};

