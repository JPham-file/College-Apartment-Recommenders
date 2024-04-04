import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, ScrollView, Image } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { ApartmentUnitRecommendation } from '@/src/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MatchPercentageBar from '../components/ApartmentItem/MatchPercentageBar';

interface ModalScreenProps {
  apartment: ApartmentUnitRecommendation;
  onClose: () => void;
}

export default function ModalScreen({ apartment, onClose }: ModalScreenProps) {
  const { name, modelName, address, modelImage, rent, photos, match, hasKnownAvailabilities } = apartment;

  return (
    <View className="flex-1">
      <Pressable onPress={onClose}>
        <FontAwesome name="close" size={24} color="white" />
      </Pressable>
      <ScrollView className="mt-12">
        <View>
          <Image source={{ uri: photos[0] }} className="w-full h-56 rounded-lg" resizeMode="cover" />
        </View>
        <View className="py-2 px-3.5 rounded-lg -mt-4">
          <View className="flex flex-row justify-between">
            <View className="flex-col flex-initial">
              <Text className="text-base font-bold">{name}</Text>
              <Text className="text-base font-bold">AVAILABILITY: {hasKnownAvailabilities ? 'NOW' : 'NONE'}</Text>
              <Text className="text-sm -my-1">{address.substring(address.indexOf(','))}</Text>
              <Text className="text-2xl font-bold">${rent}<Text className="text-sm font-normal">/month</Text></Text>
            </View>
            <MatchPercentageBar percentage={Number(match)} fill="#f5f5f5" />
          </View>
        </View>
      </ScrollView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}