import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, ScrollView, Image } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { ApartmentUnitRecommendation } from '@/src/types';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons/';
import MatchPercentageBar from '../components/ApartmentItem/MatchPercentageBar';
import MatchDetailTable from '../components/ApartmentItem/MatchDetailTable';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {openURL} from "expo-linking";

export default function Modal() {
  const router = useRouter();
  const { apartment: apartmentString, showScore: visibleScore } = useLocalSearchParams();


  if (!apartmentString) {
    return null;
  }

  const apartment: ApartmentUnitRecommendation = JSON.parse(apartmentString as string);

  const { name, modelName, address, modelImage, rent, photos, match, hasKnownAvailabilities, details, squareFeet,phoneNumber, description } = apartment;


  return (
    <View className="flex-1">
      <ScrollView className="mt-12">
        <View>
          <Image source={{ uri: photos[0] }} className="w-full h-56 rounded-lg" resizeMode="cover" />
        </View>
        <View className="py-2 px-3.5 rounded-lg -mt-4">
          <View className="flex flex-row justify-between">
            <View className="flex-col flex-initial">
              <Text className="text-xl font-bold">{name}</Text>
              <Text className="text-md my-3">{address.substring(address.indexOf(','))}</Text>

              <Text className="text-3xl font-bold">${rent}<Text className="text-sm font-normal">/month</Text></Text>
            </View>
            { visibleScore === "1" && <MatchPercentageBar percentage={Number(match)} fill="#f5f5f5" /> }
          </View>


          <MatchDetailTable apartment={apartment}/>

          <View className = "flex flex-row">
            {hasKnownAvailabilities ?  (<FontAwesome color='green' size={22}  name="check-circle-o" /> ) :  (<FontAwesome color="red" size={22} name="times-circle-o" />)} 
            <Text className="pl-2 text-lg"> {hasKnownAvailabilities ? 'Units available' : 'No availabile units'} </Text>
          </View>

          <View className="py-4 pl-1">
            <Pressable className="flex flex-row align-center" onPress = { () =>openURL(`tel:${phoneNumber}`) }>
              <FontAwesome name="phone" color="white" size={22}/>
              <Text className="pl-2 text-lg"> {phoneNumber?.substring(3)} </Text>
            </Pressable>
          </View>

          <View className="py-12">

            <Text className="text-base"> {description} </Text>

          </View>
      

         
        </View>
      </ScrollView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}