import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from "../lib/supabase";;
import { v4 as uuidv4 } from "uuid";


export default function FetchUser() {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const updateUserInDatabase = async (supabase: SupabaseClient, email: string) => {
    if (!supabase) {
      console.log('Supabase client is not initialized');
      return;
    }
  
    console.log(`Preparing to upsert user data for email: ${email}`);
    const userId = uuidv4();
    console.log(`Generated UUID for upsert operation: ${userId}`);
  
    const { data, error } = await supabase
      .from("User")
      .upsert({
        id: userId,
        email: email,
      });
  
    if (data) {
      console.log(`Upsert operation successful, data:`, data);
    }
    if (error) {
      console.error("Error updating user in Supabase:", error.message);
    }
  };
  

  useEffect(() => {
    const initSupabaseAndFetchUser = async () => {
      console.log('Init Supabase and Fetch User effect triggered');
      if (isLoaded && isSignedIn && user) {
        console.log('User is loaded and signed in, attempting to get token...');
        const token = await getToken({ template: "supabase-jwt-token" });
        console.log(`Token received: ${token ? 'Yes' : 'No'}`);
        const initializedSupabase = await supabaseClient(token!);
        console.log('Supabase client initialized:', !!initializedSupabase);
        setSupabase(initializedSupabase);
        if (user.primaryEmailAddress?.emailAddress) {
          console.log('Attempting to update user in database...');
          console.log('Supabase client before updateUserInDatabase:', !!supabase);
          updateUserInDatabase(initializedSupabase, user.primaryEmailAddress.emailAddress);
        }
      }
    };
  
    initSupabaseAndFetchUser();
  }, [isLoaded, isSignedIn, user, getToken]);
  
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Text>
      Hello {user.primaryEmailAddress?.emailAddress}, welcome to Clerk
    </Text>
  );
}
