import "react-native-get-random-values";
import React, {useEffect, useState} from "react";
import {Text, View, ActivityIndicator } from "react-native";
import {useAuth, useUser} from "@clerk/clerk-expo";
import {SupabaseClient} from '@supabase/supabase-js';
import {db} from "../lib/supabase";

import {UserPrompt} from './UserPrompt';
import { useRouter } from 'expo-router';
import { DatabaseUser } from '@/src/types/user';

interface FetchUserProps {
  setLoading: (value: boolean) => void;
}

export default function FetchUser({ setLoading }: FetchUserProps) {
  const {getToken} = useAuth();
  const {isLoaded, isSignedIn, user} = useUser();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const router = useRouter();
  const [dbUser, setDbUser] = useState<DatabaseUser | null | undefined>(null);

  const updateUserInDatabase = async (supabase: SupabaseClient) => {
    if (!supabase) {
      console.log('Supabase client is not initialized');
      return;
    }

    const insertUser = {
      first_name: user!.firstName,
      last_name: user!.lastName,
      email: user!.primaryEmailAddress?.emailAddress,
      profile_icon: user!.imageUrl
    };

    console.log(`Preparing to upsert user data for email: ${insertUser.email}`);

    const { data, error} = await supabase
      .from("User")
      .upsert({
        id: user!.id,
        oauth: insertUser,
      })
      .select();

    if (data) {
      setDbUser(data[0]);
    }

    if (error) {
      console.error("Error updating user in Supabase:", error.message);
    }
  };


  useEffect(() => {
    setLoading(true);
    const initSupabaseAndFetchUser = async () => {
      console.log("Init Supabase and Fetch User effect triggered");
      if (isLoaded && isSignedIn && user) {
        console.log("User is loaded and signed in, attempting to get token...");
        const token = await getToken({template: "supabase-jwt-token"});
        console.log(`Token received: ${token ? "Yes" : "No"}`);
        const initializedSupabase = await db(token!);
        console.log("Supabase client initialized:", !!initializedSupabase);
        setSupabase(initializedSupabase);
        if (user.primaryEmailAddress?.emailAddress) {
          updateUserInDatabase(initializedSupabase);
        } else {
          console.log("Error: user does not have a primary email address");
        }
      }
    };

    initSupabaseAndFetchUser();
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    if (dbUser?.has_verified_preferences) {
      setLoading(false);
      //router.replace('/(tabs)');
    }
  }, [dbUser]);


  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <View>
      {!dbUser
        ? (
          <>
            <ActivityIndicator className="flex flex-row justify-center" size="large" color="#5eead4" />
            <Text>Getting Your Profile Ready</Text>
          </>
        ) : (
          <>
            <UserPrompt/>
            <Text>Hello {user.primaryEmailAddress?.emailAddress}, welcome to Off Campus!</Text>
          </>
        )
      }

    </View>
  );
}
