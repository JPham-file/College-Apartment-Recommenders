import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
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
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: 'For You',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 20 },
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          href : `/Profile`,
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 20 },
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}