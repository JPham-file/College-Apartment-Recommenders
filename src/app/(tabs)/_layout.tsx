import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useUser, useAuth } from "@clerk/clerk-expo";
import {SupabaseClient} from '@supabase/supabase-js';
import {db} from "../../lib/supabase";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



interface IPref {
  preferences: {
    roommates : number
  }
}
export default function TabLayout() {
  const colorScheme = useColorScheme();

  const {getToken} = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [userPref, setUserPref] = useState<IPref>()
 

  useEffect(() => {
    const initSupabaseAndFetchUser = async () => {
      console.log("Init Supabase and Fetch User effect triggered");
      if (isLoaded && isSignedIn && user) {
        console.log("User is loaded and signed in, attempting to get token...");
        const token = await getToken({template: "supabase-jwt-token"});
        console.log(`Token received: ${token ? "Yes" : "No"}`);
        const initializedSupabase = await db(token!);
        console.log("Supabase client initialized:", !!initializedSupabase);
     
        setSupabase(initializedSupabase)
        if (initializedSupabase){
          const {data, error} = await initializedSupabase
          .from("User")
          .select('preferences')
          .eq("id", user!.id );
    
          if (error) {
            console.error("Error updating user in Supabase:", error.message);
            return;
          }
      
          setUserPref({
            "preferences": data[0].preferences
          })
        }
        else{
          console.log("error loading user preferences from Supabase, (supabase null)")
        }
      }
    };
    initSupabaseAndFetchUser();
    }, []);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        
        options={{
          href : `/two?numRoommates=${userPref?.preferences.roommates}`,
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}