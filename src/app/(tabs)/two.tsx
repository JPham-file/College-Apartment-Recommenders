import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [DBvalues, setDBValues] = useState({
    'name': 'John Doe',
    'email': 'johndoe@tamu.edu',
    'price': 'high',
    'campusProximity': 'low',
    'publicTransportation' : 'medium',
    'numRoommates': 2
  });
  const [tempValues, setTempValues] = useState({
    'name': 'John Doe',
    'email': 'johndoe@tamu.edu',
    'price': 'high',
    'campusProximity': 'low',
    'publicTransportation' : 'medium',
    'numRoommates': 2
  });

  const enableEdit = () => {
      setIsEditing(true);
  };

  const discardEdit = () => {
    setIsEditing(false);
    setTempValues(DBvalues);
  };

  const saveEdit = () => {
    setIsEditing(false);
    setDBValues(tempValues);
    console.log(tempValues)
    //commit values to database
  }




  return (
    <View className="bg-gray-800 flex-1 p-4">
      
      {!isEditing ?
        <TouchableOpacity onPress={ enableEdit } className="">
          <Text className="text-white text-lg">Edit Details</Text>
        </TouchableOpacity>
      :
      <View>
        <TouchableOpacity onPress={ discardEdit } className="">
          <Text className="text-white text-lg">Discard Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={ saveEdit} className="">
          <Text className="text-white text-lg">Save Changes</Text>
        </TouchableOpacity>
      </View>
      
      }

      <Text className="text-gray-300 text-lg font-bold mb-2">Account Details</Text>
      <View className="bg-gray-700 p-3 rounded-lg">
        <View className="flex-row justify-between bg-gray-700 mb-2">
          <Text className="text-gray-300">Name</Text>
          { !isEditing ? 
            <Text className="text-white">{DBvalues.name}</Text>  :
            <TextInput className='text-white border border-gray-400 rounded p-2' value = {tempValues.name} onChangeText={text => setTempValues({...tempValues, name: text})}></TextInput>
            }
        </View>
        <View className="flex-row justify-between bg-gray-700 mt-2">
          <Text className="text-gray-300">Email</Text>
          <Text className="text-white">johndoe@tamu.edu</Text>
        </View>
      </View>

      <Text className="text-gray-300 text-lg font-bold mt-8 mb-2">Preferences</Text>
      <View className="bg-gray-700 p-4 rounded-lg">
        <View className="flex-row justify-between bg-gray-700 mb-2">
          <Text className="text-gray-300">Price</Text>
          <Text className="text-white">High</Text>
        </View>
        <View className="flex-row justify-between bg-gray-700 my-2">
          <Text className="text-gray-300">Campus Proximity</Text>
          <Text className="text-white">Low</Text>
        </View>
        <View className="flex-row justify-between bg-gray-700 my-2">
          <Text className="text-gray-300">Public Transportation</Text>
          <Text className="text-white">Medium</Text>
        </View>
        <View className="flex-row justify-between bg-gray-700 mt-2">
          <Text className="text-gray-300">Number of Roommates</Text>
          <Text className="text-white">2</Text>
        </View>
      </View>
    </View>
  );
}

