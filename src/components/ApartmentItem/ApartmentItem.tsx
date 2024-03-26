import { ApartmentUnitRecommendation } from '@/src/types';
import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import classNames from 'classnames';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MatchPercentageBar from './MatchPercentageBar';
import MatchDetailTable from './MatchDetailTable';
import { addSkeleton, SkeletonAnimated } from '@/src/lib/skeleton';
import { useAssets } from 'expo-asset';

export interface ApartmentItemProps {
  apartment: ApartmentUnitRecommendation;
  token: string | null;
  isSkeletonLoading: boolean;
}

const ApartmentItem = (props: ApartmentItemProps) => {
  const { apartment, token, isSkeletonLoading } = props;
  const { name, modelName, address, modelImage, rent, photos, match, key, propertyId, isSaved: originallySavedByUser } = apartment;

  const [asset] = useAssets([require('../../../assets/images/isometric/Bathroom_1.png')])
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(!!originallySavedByUser);

  const rotation = useSharedValue(0);

  const containerClass = classNames('flex my-2', {
    'animate-pulse': isSkeletonLoading,
  });

  const saveApartment = async () => {
    setIsSaved(true);
    const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/apartments/save`;
    const body = {
      rental_key: key,
      property_id: propertyId,
    };

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(apiURL, request);
    const data = await response.json();
    const { error, results } = data;
    if (error) {
      setIsSaved(false);
    }
  }

  const renderExpandableButton = () => {
    if (isExpanded) {
      return (
        <Pressable onPress={() => setIsExpanded(false)}>
          {/* color is neutral-400 in tailwind - unable to use className for FontAwesome icons */}
          <FontAwesome name="angle-up" size={24} color="#a1a1aa" />
        </Pressable>
      );
    }

    return (
      <Pressable onPress={() => setIsExpanded(true)}>
        {/* color is neutral-400 in tailwind - unable to use className for FontAwesome icons */}
        <FontAwesome name="angle-down" size={24} color="#a1a1aa" />
      </Pressable>
    );
  }

  const renderSaveApartmentButton = () => {
    const fillColor = isSaved ? '#dc2626' : '#000';
    const heartClass = classNames('absolute', { 'opacity-60': !isSaved });

    return (
      <Pressable onPress={() => saveApartment()} className="absolute right-0 p-3">
        <View className="flex justify-center items-center p-3">
          <View className="absolute">
            <FontAwesome name="heart-o" size={24} color="#f5f5f5" />
          </View>
          <View className={heartClass}>
            <FontAwesome name="heart" size={20} color={fillColor} className="opacity-50 absolute top-0" />
          </View>
        </View>
      </Pressable>
    );
  }

  const nameClass = addSkeleton('text-base font-bold', isSkeletonLoading);
  const addressClass = addSkeleton('text-sm mt-1', isSkeletonLoading);
  const rentClass = addSkeleton('text-2xl font-bold mt-2', isSkeletonLoading);

  return (
    <View className={containerClass}>
      <View className="py-0 z-10">
        {<Image
          source={{ uri: isSkeletonLoading && asset ? asset[0].localUri! : photos[0]! }}
          className="w-full h-40 rounded-lg" // Image takes full width
          resizeMode={isSkeletonLoading ? 'center' : 'cover'} // Ensures the image covers the area without stretching
        />}
        {!isSkeletonLoading && renderSaveApartmentButton()}
      </View>
        <View className="py-2 px-3.5 bg-neutral-100 rounded-lg z-20 -mt-4">
          <SkeletonAnimated isLoading={isSkeletonLoading}>
            <View className="flex flex-row justify-between">
              <View className="flex-col flex-initial">
                <Text className={nameClass}>{name} - {modelName}</Text>
                <Text className={addressClass}>{address.substring(address.indexOf(','))}</Text>
                <Text className={rentClass}>${rent}<Text className="text-sm font-normal">/month</Text></Text>
              </View>
              <MatchPercentageBar percentage={Number(match)} fill="#f5f5f5" isSkeletonLoading={isSkeletonLoading} />
            </View>
            {isExpanded && <MatchDetailTable apartment={apartment} />}
            <View className="flex flex-row justify-center items-center">
              {!isSkeletonLoading && renderExpandableButton()}
            </View>
          </SkeletonAnimated>
        </View>
    </View>
  );
};

export default ApartmentItem;