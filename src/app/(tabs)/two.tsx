import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useUser, useAuth } from "@clerk/clerk-expo";
import {SupabaseClient} from '@supabase/supabase-js';
import {db} from "../../lib/supabase";
import { useLocalSearchParams } from "expo-router";




interface Preference {
  text: string;
  defaultValue: string;
  onValueChange: (val: string) => void;
  isEditing: boolean;
  data: { value: string; label: string; }[]
}

const priorityOptions = [
  { value: "Low", label: 'Low' },
  { value: "Medium", label: 'Medium' },
  { value: "High", label: 'High' },
];

const profileEditButton = require('../../../assets/images/profile-edit-button.png');

const roommateOptions = [
  { value: "0", label: '0' },
  { value: "1", label: '1' },
  { value: "2", label: '2' },
  { value: "3", label: '3' },
  { value: "4", label: '4' },
  { value: "5", label: '5' },
];




const PreferenceItem: React.FC<Preference> = ({ text, defaultValue, onValueChange, isEditing, data }) => (
  <View className="flex-row justify-between my-2">
    <Text className="text-white">{text}</Text>
    <RNPickerSelect
      onValueChange={(val: string) => onValueChange(val)}
      items={data}
      value={defaultValue}
      disabled={!isEditing}
      darkTheme={true}
      placeholder={{}} // LEAVE THIS;  disables the default "select item" option
      style={{ inputIOS: { color: "gray" } }}
    />
  </View>
);

export default function TabTwoScreen() {
  const props = useLocalSearchParams();
  const {getToken} = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const [isEditing, setIsEditing] = useState(false);
 
  console.log(props)
 
  const [DBvalues, setDBValues] = useState({
    'name': user?.fullName,
    'email': user?.primaryEmailAddress?.emailAddress,
    'price': "High",
    'campusProximity': "Low",
    'publicTransportation': "Medium",
    'numRoommates': parseInt(props.numRoommates[0])
  });


  const [localValues, setLocalValues] = useState({
    'name': user?.fullName,
    'email': user?.primaryEmailAddress?.emailAddress,
    'price': "High",
    'campusProximity': "Low",
    'publicTransportation': "Medium",
    'numRoommates': parseInt(props.numRoommates[0])
  });

  const enableEdit = () => {
    setIsEditing(true);
  };

  const discardEdit = () => {
    setIsEditing(false);
    setLocalValues(DBvalues);
  };

  const saveEdit = () => {
    setIsEditing(false);
    setDBValues(localValues);
    //commit values to database
    if (supabase != null){
      updateUserInDatabase(supabase);
    }

  }
 
   
  
    const updateUserInDatabase = async (supabase: SupabaseClient) => {
      if (!supabase) {
        console.log('Supabase client is not initialized');
        return;
      }
      const updatePreferences = {
        budget: localValues.price,
        roommates: localValues.numRoommates
      };
      console.log(`Preparing to update user data for email: `);
  
      const {error} = await supabase
        .from("User")
        .update({
          id: user!.id,
          preferences: updatePreferences,
        })
        .eq("id", user!.id);
  
      if (error) {
        console.error("Error updating user in Supabase:", error.message);
      }
    };

  

  return (
    <View className="flex-1 p-4">

      <Text className="text-white text-lg font-bold mb-2">Account Details</Text>
      <View className="p-3 rounded-lg">
        <View className="flex-row justify-between mb-2">
          <Text className="text-white">Name</Text>
          <Text className="text-gray-500">{DBvalues.name}</Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-white">Email</Text>
          <Text className="text-gray-500">{DBvalues.email}</Text>
        </View>
      </View>

      <Text className="text-white text-lg font-bold mt-8 mb-2">Preferences</Text>
      <View className="px-4 py-2 rounded-lg">
        <PreferenceItem
          text="Budget"
          defaultValue={localValues.price}
          onValueChange={(val) => setLocalValues({ ...localValues, "price": val })}
          isEditing={isEditing}
          data = {priorityOptions}
        />
        <PreferenceItem
          text="Campus Proximity"
          defaultValue={localValues.campusProximity}
          onValueChange={(val) => setLocalValues({ ...localValues, "campusProximity": val })}
          isEditing={isEditing}
          data = {priorityOptions}
        />
        <PreferenceItem
          text="Public Transportation"
          defaultValue={localValues.publicTransportation}
          onValueChange={(val) => setLocalValues({ ...localValues, "publicTransportation": val })}
          isEditing={isEditing}
          data = {priorityOptions}
        />
        <PreferenceItem
          text="Number of Roommates"
          defaultValue={localValues.numRoommates.toString()}
          onValueChange={(val) => setLocalValues({ ...localValues, "numRoommates": parseInt(val) })}
          isEditing={isEditing}
          data={roommateOptions}
        />
      </View>

      <View className="flex-1 justify-end">
        {!isEditing ? 
        <View className="absolute bottom-0 right-0 ">
          <TouchableOpacity onPress={enableEdit} className="p-4 bg-gray-1000 rounded-full">
            <Image source={profileEditButton} className="w-10 h-10" />
          </TouchableOpacity>
          {/* <Text className="text-gray-300 self-center mt-2 text-base">Edit</Text> */}
        </View>
        
          :
          <View className="flex-row justify-around bg-gray-1000">
            <TouchableOpacity onPress={discardEdit} className="">
              <Text className="text-white text-lg">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={saveEdit} className="">
              <Text className="text-white text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        }
      </View>

    </View>
  );
}
