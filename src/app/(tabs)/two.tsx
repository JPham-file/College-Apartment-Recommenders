import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View className="bg-gray-800 flex-1 p-4">

      <Text className="text-gray-300 text-lg font-bold mb-2">Account Details</Text>
      <View className="bg-gray-700 p-3 rounded-lg">
        <View className="flex-row justify-between bg-gray-700 mb-2">
          <Text className="text-gray-300">Name</Text>
          <Text className="text-white">John Doe</Text>
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
