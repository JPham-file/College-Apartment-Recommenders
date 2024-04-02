import { ApartmentUnitRecommendation } from '@/src/types';
import React, { useState, memo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import classNames from 'classnames';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MatchPercentageBar from './MatchPercentageBar';
import MatchDetailTable from './MatchDetailTable';
import { addSkeleton, skeleton, SkeletonAnimated } from '@/src/lib/skeleton';

export interface ApartmentItemProps {
  apartment: ApartmentUnitRecommendation;
  token: string | null;
  isSkeletonLoading: boolean;
  showScore: boolean
}

const ApartmentItem = (props: ApartmentItemProps) => {
  const { apartment, token, isSkeletonLoading, showScore} = props;
  const { name, modelName, address, modelImage, rent, photos, match, key, propertyId, isSaved: originallySavedByUser } = apartment;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(!!originallySavedByUser);

  const rotation = useSharedValue(0);

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

  const unsaveApartment = async () => {
    setIsSaved(false);
    const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/apartments/remove`;
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
    console.log(data)
    const { error, results } = data;
    if (error) {
      setIsSaved(true);
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

    const saveHandler = isSaved ? () => unsaveApartment() : () => saveApartment();

    return (
      <Pressable onPress={saveHandler} className="absolute right-0 p-3">
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

  const textContainerClass = addSkeleton('rounded-full my-1', isSkeletonLoading, false);
  const nameClass = addSkeleton('text-base font-bold', isSkeletonLoading);
  const addressClass = addSkeleton('text-sm -my-1', isSkeletonLoading);
  const rentClass = addSkeleton('text-2xl font-bold ', isSkeletonLoading);
  const imageClass = addSkeleton('w-full h-56 rounded-lg', isSkeletonLoading, false);

  return (
    <View className="flex my-3">
      <View className="py-0 z-10">
        <SkeletonAnimated isLoading={isSkeletonLoading}>
          <Image
            source={{ uri: photos[0] }}
            className={imageClass} // Image takes full width
            resizeMode="cover" // Ensures the image covers the area without stretching
          />
        </SkeletonAnimated>
        {!isSkeletonLoading && renderSaveApartmentButton()}
      </View>
      <View className="py-2 px-3.5 bg-neutral-100 rounded-lg z-20 -mt-4">
        <SkeletonAnimated isLoading={isSkeletonLoading}>
          <View className="flex flex-row justify-between">
            <View className="flex-col flex-initial">
              <View className={textContainerClass}>
                <Text className={nameClass}>{name}</Text>
              </View>
              <View className={textContainerClass}>
                <Text className={addressClass}>{address.substring(address.indexOf(','))}</Text>
              </View>
              <View className={textContainerClass}>
                <Text className={rentClass}>${rent}<Text className="text-sm font-normal">/month</Text></Text>
              </View>
            </View>
            {showScore ?
            <MatchPercentageBar percentage={Number(match)} fill="#f5f5f5" isSkeletonLoading={isSkeletonLoading} />
            :
            null
            }
          </View>
          {!isSkeletonLoading && isExpanded && <MatchDetailTable apartment={apartment} />}
          <View className="flex flex-row justify-center items-center">
            {!isSkeletonLoading && renderExpandableButton()}
          </View>
        </SkeletonAnimated>
      </View>
    </View>
  );
};

export default memo(ApartmentItem);