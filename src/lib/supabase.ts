
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";

// exposing these is ok becuase of RLS
const supabaseUrl = "https://ihnradjuxnddmmioyeqp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobnJhZGp1eG5kZG1taW95ZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5NDkyODcsImV4cCI6MjAyMzUyNTI4N30.cebjm2GbItaRLa81OYTi3Suffy8u52hO3lSRgjrK5r8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

