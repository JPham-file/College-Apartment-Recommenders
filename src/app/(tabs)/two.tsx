import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';




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
  <View className="flex-row justify-between bg-gray-700 my-2">
    <Text className="text-gray-300">{text}</Text>
    <RNPickerSelect
      onValueChange={(val: string) => onValueChange(val)}
      items={data}
      value={defaultValue}
      disabled={!isEditing}
      darkTheme={true}
      placeholder={{}} // LEAVE THIS;  disables the default "select item" option
      style={{ inputIOS: { color: "white" } }}
    />
  </View>
);

export default function TabTwoScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [DBvalues, setDBValues] = useState({
    'name': 'John Doe',
    'email': 'johndoe@tamu.edu',
    'price': "High",
    'campusProximity': "Low",
    'publicTransportation': "Medium",
    'numRoommates': 2
  });

  const [localValues, setLocalValues] = useState({
    'name': 'John Doe',
    'email': 'johndoe@tamu.edu',
    'price': "High",
    'campusProximity': "Low",
    'publicTransportation': "Medium",
    'numRoommates': 2
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

  return (
    <View className="bg-gray-800 flex-1 p-4">

      <Text className="text-gray-300 text-lg font-bold mb-2">Account Details</Text>
      <View className="bg-gray-700 p-3 rounded-lg">
        <View className="flex-row justify-between bg-gray-700 mb-2">
          <Text className="text-gray-300">Name</Text>
          <Text className="text-white">{DBvalues.name}</Text>
        </View>
        <View className="flex-row justify-between bg-gray-700 mt-2">
          <Text className="text-gray-300">Email</Text>
          <Text className="text-white">{DBvalues.email}</Text>
        </View>
      </View>

      <Text className="text-gray-300 text-lg font-bold mt-8 mb-2">Preferences</Text>
      <View className="bg-gray-700 px-4 py-2 rounded-lg">
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

      <View className="flex-1 justify-end bg-gray-800">
        {!isEditing ?
        <View className="absolute bottom-0 right-0 bg-gray-800">
          <TouchableOpacity onPress={enableEdit} className="p-4 bg-gray-700 rounded-full">
            <Image source={profileEditButton} className="w-10 h-10" />
          </TouchableOpacity>
          {/* <Text className="text-gray-300 self-center mt-2 text-base">Edit</Text> */}
        </View>
          
          :
          <View className="flex-row justify-around bg-gray-800">
            <TouchableOpacity onPress={discardEdit} className="">
              <Text className="text-white text-lg">Discard</Text>
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
