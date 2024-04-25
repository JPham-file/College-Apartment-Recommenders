import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, ScrollView, Image } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { FontAwesome } from '@expo/vector-icons/';
import MatchPercentageBar from '@/src/components/ApartmentItem/MatchPercentageBar';
import MatchDetailTable from '@/src/components/ApartmentItem/MatchDetailTable';
import { useLocalSearchParams } from 'expo-router';
import {openURL} from "expo-linking";
import React, { useContext, useEffect, useState } from 'react';
import { ApartmentContext } from '@/src/app/apartment/ApartmentContext';
import record, { APARTMENT_DETAILS_VIEW_START, APARTMENT_DETAILS_VIEW_END } from '@/src/lib/EventStream';
import { useUser } from '@clerk/clerk-react';

export default function Modal() {
  const { user } = useUser();
  const {  showScore: visibleScore } = useLocalSearchParams();
  const [viewStartTime, setViewStartTime] = useState<Date>(new Date());

  const { apartment } = useContext(ApartmentContext);
  if (!apartment){
    return null;
  }

  const { name, modelName, address, modelImage, rent, photos, match, hasKnownAvailabilities, details, squareFeet,phoneNumber, description } = apartment;

  useEffect(() => {
    const startTime = new Date();
    setViewStartTime(startTime)
    const startPayload = {
      userId: user?.id,
      sessionId: user?.id,
      apartmentProperty: apartment,
      apartmentUnit: apartment,
    }
    record(APARTMENT_DETAILS_VIEW_START, startPayload);

    return () => {
      const endTime = new Date();
      const diff = endTime.getTime() - (new Date(viewStartTime).getTime());
      const endPayload = {
        userId: user?.id,
        sessionId: user?.id,
        apartmentProperty: apartment,
        apartmentUnit: apartment,
        totalTime: diff,
        timeUnit: 'ms'
      }
      record(APARTMENT_DETAILS_VIEW_END, endPayload);
    }
  }, [])


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