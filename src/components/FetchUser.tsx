import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SupabaseClient } from '@supabase/supabase-js';
import { db } from "../lib/supabase";


export default function FetchUser() {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const updateUserInDatabase = async (supabase: SupabaseClient) => {
    
    if (!supabase) {
      console.log("Supabase client is not initialized");
      return;
    }

    const insertUser = {
      first_name: user!.firstName,
      last_name: user!.lastName,
      email: user!.primaryEmailAddress?.emailAddress,
      profile_icon: user!.imageUrl
    };
  
    console.log(`Preparing to upsert user data for email: ${insertUser.email}`);
  
    const { data, error } = await supabase
      .from("User")
      .upsert({
        id: user!.id,
        oauth: insertUser,
      });
  
    if (error) {
      console.error("Error updating user in Supabase:", error.message);
    }
  };
  

  useEffect(() => {
    const initSupabaseAndFetchUser = async () => {
      console.log("Init Supabase and Fetch User effect triggered");
      if (isLoaded && isSignedIn && user) {
        console.log("User is loaded and signed in, attempting to get token...");
        const token = await getToken({ template: "supabase-jwt-token" });
        console.log(`Token received: ${token ? "Yes" : "No"}`);
        const initializedSupabase = await db(token!);
        console.log("Supabase client initialized:", !!initializedSupabase);
        setSupabase(initializedSupabase);
        if (user.primaryEmailAddress?.emailAddress) {
          updateUserInDatabase(initializedSupabase);
        } else {
          console.log("Error calling update: user has no primary email address");
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
