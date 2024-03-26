import { ApartmentUnitRecommendation } from '@/src/types';
import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export interface MatchDetailProps {
  apartment: ApartmentUnitRecommendation;
  delayOffset?: number;
}

const MatchDetailTable = (props: MatchDetailProps) => {
  const { apartment, delayOffset = 50 } = props;
  const { details, squareFeet } = apartment;

  const renderFeatures = () => {

  }

  return (
    <View className="flex flex-row my-4 p-2 shadow justify-around items-center">
      <View className="flex flex-row gap-2 items-end">
        <FontAwesome name="bed" size={20} />
        <Text className="">{details[0]}</Text>
      </View>
      <View className="flex flex-row gap-2 px-2 items-end">
        <FontAwesome name="bath" size={20} />
        <Text className="">{details[1]}</Text>
      </View>
      <View className="flex flex-row gap-2 items-end">
        <FontAwesome name="bath" size={20} />
        <Text className="">{squareFeet} sqft</Text>
      </View>
    </View>
  );
};

export default MatchDetailTable;