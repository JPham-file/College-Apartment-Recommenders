import {createClient} from "@supabase/supabase-js";

const supabaseURL = process.env.EXPO_PUBLIC_DATABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_DATABASE_KEY;

export const supabase = createClient(supabaseURL, supabaseAnonKey);
