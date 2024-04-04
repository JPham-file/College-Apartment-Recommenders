import { ApartmentUnitRecommendation } from '@/src/types';
import React, { useState, memo } from 'react';
import { View, Text, Image, Pressable, Modal } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import classNames from 'classnames';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MatchPercentageBar from './MatchPercentageBar';
import MatchDetailTable from './MatchDetailTable';
import { addSkeleton, skeleton, SkeletonAnimated } from '@/src/lib/skeleton';
import ModalScreen from '@/src/app/modal';

export interface ApartmentItemProps {
  apartment: ApartmentUnitRecommendation;
  token: string | null;
  isSkeletonLoading: boolean;
  showScore: boolean
}

const ApartmentItem = (props: ApartmentItemProps) => {
  
  const { apartment, token, isSkeletonLoading, showScore } = props;
  const { name, modelName, address, modelImage, rent, photos, match, key, propertyId, hasKnownAvailabilities , isSaved: originallySavedByUser } = apartment;

  const [modalVisible, setModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(!!originallySavedByUser);

  const rotation = useSharedValue(0);

  const closeModal = () => {
    setModalVisible(false);
  };
  
  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <Pressable onPress={closeModal} className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-4">
          <ModalScreen apartment={apartment} onClose={closeModal} />
        </View>
      </Pressable>
    </Modal>
  );

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
    const { error, results } = data;
    if (error) {
      setIsSaved(true);
    }
  }

  const renderExpandableButton = () => {
    if (modalVisible) {
      return (
        <Pressable onPress={() => setModalVisible(false)}>
          {/* color is neutral-400 in tailwind - unable to use className for FontAwesome icons */}
          <FontAwesome name="angle-up" size={24} color="#a1a1aa" />
        </Pressable>
      );
    }

    return (
      <Pressable onPress={() => setModalVisible(true)}>
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
  const availableClass = addSkeleton('text-base font-bold', isSkeletonLoading);
  const addressClass = addSkeleton('text-sm -my-1', isSkeletonLoading);
  const rentClass = addSkeleton('text-2xl font-bold ', isSkeletonLoading);
  const imageClass = addSkeleton('w-full h-56 rounded-lg', isSkeletonLoading, false);

  // console.log('hasKnownAvailabilities', hasKnownAvailabilities)
  const [availability, setAvailability] = useState<boolean>(false)

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
                <Text className={availableClass}>AVAILABILITY: {hasKnownAvailabilities ? 'NOW' : 'NONE'} </Text>
              </View>

              <View className={textContainerClass}>
                <Text className={addressClass}>{address.substring(address.indexOf(','))}</Text>
              </View>
              <View className={textContainerClass}>
                <Text className={rentClass}>${rent}<Text className="text-sm font-normal">/month</Text></Text>
              </View>
            </View>
            {showScore && <MatchPercentageBar percentage={Number(match)} fill="#f5f5f5" isSkeletonLoading={isSkeletonLoading} /> }
          </View>
          {!isSkeletonLoading && modalVisible &&           
            <Pressable onPress={() => setModalVisible(true)}>
              <Text>View Details</Text>
            </Pressable>
          }
          <View className="flex flex-row justify-center items-center">
            {!isSkeletonLoading && renderExpandableButton()}
          </View>
        </SkeletonAnimated>
      </View>
      {renderModal()}
    </View>
  );
};

export default memo(ApartmentItem);