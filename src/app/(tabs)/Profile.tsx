import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import { useDatabaseUser } from '@/src/hooks/useDatabaseUser';

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
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const { user: dbUser } = useDatabaseUser();

  const [isEditing, setIsEditing] = useState(false);
  const [DBvalues, setDBValues] = useState({
    'name': user?.fullName,
    'email': user?.primaryEmailAddress?.emailAddress,
    'price': "High",
    'campusProximity': "Low",
    'publicTransportation': "Medium",
    'numRoommates': 2
  });

  const [localValues, setLocalValues] = useState({
    'name': user?.fullName,
    'email': user?.primaryEmailAddress?.emailAddress,
    'price': "High",
    'campusProximity': "Low",
    'publicTransportation': "Medium",
    'numRoommates': 2.
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
  }

  function performLogOut() {
    signOut(() => {
      router.push('/');
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <View className="flex justify-between h-full p-4">
      <View>
        <View className="flex flex-row justify-center py-4">
          <View className="rounded-full border border-neutral-200">
            <Image source={{ uri: user?.imageUrl }} width={128} height={128} className="rounded-full" />
          </View>
        </View>

        <View className="flex gap-y-4">
          <View>
            <Text className="text-white text-lg font-bold">Account Details</Text>
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
          </View>

          <View>
            <Text className="text-white text-lg font-bold">Preferences</Text>
            <View className="px-4 py-2 rounded-lg">
              <PreferenceItem
                text="Price"
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
          </View>
        </View>
      </View>

      <View className="flex flex-col justify-around">
        <View className="flex my-2">
          {/* className="flex w-full rounded-full border border-red-500 items-center justify-center py-4" */}
          <Pressable onPress={performLogOut}>
            <Text className="text-red-500">Log Out</Text>
          </Pressable>
        </View>
        <View className="flex w-full justify-end py-2">
          {!isEditing ?
          <View className="flex w-full items-end">
            <TouchableOpacity onPress={enableEdit} className="bg-gray-1000 py-2 rounded-full">
              <Image source={profileEditButton} className="w-12 h-12" />
            </TouchableOpacity>
            {/* <Text className="text-gray-300 self-center mt-2 text-base">Edit</Text> */}
          </View>

            :
            <View className="flex-row justify-around py-4 my-0.5 bg-gray-1000">
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
    </View>
  );
}
