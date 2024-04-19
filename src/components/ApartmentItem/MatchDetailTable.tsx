import { ApartmentUnitRecommendation } from '@/src/types';
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons/';

export interface MatchDetailProps {
  apartment: ApartmentUnitRecommendation;
  delayOffset?: number;
}

const MatchDetailTable = (props: MatchDetailProps) => {
  const { apartment, delayOffset = 50 } = props;
  const { details, squareFeet } = apartment;


  return (
    <View className="flex flex-row my-4 p-2 shadow justify-around items-center">
      <View className="flex flex-row gap-2 items-end">
        <FontAwesome name="bed" color='white' size={20} />
        <Text className="text-white">{details[0]}</Text>
      </View>
      <View className="flex flex-row gap-2 px-2 items-end">
        <FontAwesome name="bath" color='white' size={20} />
        <Text className="text-white">{details[1]}</Text>
      </View>
      <View className="flex flex-row gap-2 items-end">
        <FontAwesome5 name="ruler-combined" color='white' size={20} />
        <Text className="text-white">{squareFeet} sqft</Text>
      </View>
    </View>
  );
};

export default MatchDetailTable;