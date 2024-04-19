import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs} from 'expo-router';
import {useUser, useAuth} from '@clerk/clerk-expo';
import {useState, useEffect, useContext} from 'react';
import Colors from '@/src/constants/Colors';
import {useColorScheme} from '@/src/components/useColorScheme';
import {useClientOnlyValue} from '@/src/components/useClientOnlyValue';
import {SupabaseClient} from '@supabase/supabase-js';
import {db} from "../../lib/supabase";
import {useFilter, FilterProvider} from "@/src/components/FilterContext";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import {TouchableOpacity, Text, View, Modal, Button} from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}
// the lease option button
interface OptionsModalProps {
  visible: boolean;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
}
function OptionsButton({onPress}: {
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
        marginRight: 10,
        backgroundColor: 'rgb(95,169,234)',
        borderRadius: 10}}
    >
      <Text>Availability Filter</Text>
    </TouchableOpacity>
  );
}

// the dropdown lease options
function OptionsModal({
                        visible,
                        options,
                        onSelect,
                        onClose
                      }: OptionsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect(option)
              }}
              style={{padding: 10}}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={{padding: 10, marginTop: 10}}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

interface IPref {
  preferences: {
    roommates: number
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();


  const {getToken} = useAuth();
  const {isLoaded, isSignedIn, user} = useUser();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [userPref, setUserPref] = useState<IPref>()
  const {setFilterOption} = useFilter()

  const onSelectOption = (option: string) => {
    setFilterOption(option);
    setShowOptions(false);
  }

  useEffect(() => {
    const initSupabaseAndFetchUser = async () => {

      if (isLoaded && isSignedIn && user) {

        const token = await getToken({template: "supabase-jwt-token"});

        const initializedSupabase = await db(token!);


        setSupabase(initializedSupabase)
        if (initializedSupabase) {
          const {data, error} = await initializedSupabase
            .from("User")
            .select('preferences')
            .eq("id", user!.id);

          if (error) {
            console.error("Error updating user in Supabase:", error.message);
            return;
          }

          setUserPref({
            "preferences": data[0].preferences
          })
        } else {
          console.log("error loading user preferences from Supabase, (supabase null)")
        }
      }
    };
    initSupabaseAndFetchUser();
  }, []);

  const [showOptions, setShowOptions] = useState(false);
  const options: string[] = [
    'Show All',
    'Currently Available',
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          headerStyle: {
            // backgroundColor: 'transparent', // Make header background transparent
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({color}) => <TabBarIcon name="home" color={color}/>,
            headerTitle: 'For You',
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 20},
            tabBarShowLabel: false,
            headerRight: () => (
              <OptionsButton onPress={() => setShowOptions(true)}/>
            ),
          }}
        />
          <Tabs.Screen
            name="SavedApartments"
            options={{
              tabBarIcon: ({color}) => <TabBarIcon name="bookmark" color={color}/>,
              tabBarShowLabel: false,
              headerTitle: 'Saved Apartments',
              headerTitleStyle: {fontSize: 20}
            }}
          />
        <Tabs.Screen
          name="Map"
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => <TabBarIcon name="map-marker" color={color}/>,
            tabBarShowLabel: false,
            headerRight: () => (
              <OptionsButton onPress={() => setShowOptions(true)}/>
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"

          options={{
            href: `/Profile?numRoommates=${userPref?.preferences.roommates}`,
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 20},
            tabBarIcon: ({color}) => <TabBarIcon name="user-circle" color={color}/>,
            tabBarShowLabel: false,
          }}
        />
      </Tabs>

      <OptionsModal
        visible={showOptions}
        options={options}
        onSelect={(option) => {
          // setShowOptions(false); // Close the modal
          onSelectOption(option);
        }}
        onClose={() => setShowOptions(false)}
      />
    </>
  );
}
