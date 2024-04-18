import { ApartmentUnitRecommendation } from '@/src/types';
import { useUser, useAuth } from '@clerk/clerk-expo';
import React, { useCallback, useState, useEffect, useContext, useRef} from 'react';
import { FlatList, Image, Text, Pressable, Modal, NativeScrollEvent } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { View } from '@/src/components/Themed';
import ApartmentItem from '@/src/components/ApartmentItem';
import dummy from '@/src/lib/skeleton/mocks/ApartmentRecommendation';
import {useFilter} from "@/src/components/FilterContext";
import ModalScreen from '@/src/app/modal';

export default function TabOneScreen()  {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const {filterOption} = useFilter();
  const [selectedApartment, setSelectedApartment] = useState<ApartmentUnitRecommendation | null>(null);
  const [apartments, setApartments] = useState<ApartmentUnitRecommendation[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(false);

  const flatListRef = useRef<FlatList>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const maxScore  = useRef<number>(1);

  const fetchUserPreferences = async (page: number, limit: number) => {
    setIsSkeletonLoading(false);
    const newToken = await getToken();
    setToken(newToken);
    try {
      const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/get_recommendations?page=${page}&limit=${limit}`;
      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
      });
      if (!response.ok) {
        console.error(response);
        throw new Error('Network response failure: make sure to change IP to your machine IP');
      }
      const data = await response.json();
      if (page === 1){
        maxScore.current =data[0].score
      }

      let transformedApartments = data.map((apartment: ApartmentUnitRecommendation) => ({
        ...apartment,
        match: Number((apartment.score / maxScore.current) * 100).toFixed(0).toString(),
      }));
      if (filterOption === 'Currently Available') {
        transformedApartments = transformedApartments.filter((apartment: ApartmentUnitRecommendation) => apartment.hasKnownAvailabilities);
      }
      return transformedApartments; // Return the transformed apartments
    } catch (error) {
      console.error('There was an error fetching the user preferences:', error);
      return []; // Return an empty array in case of an error
    } finally {
      setIsSkeletonLoading(false);
    }
  };
 

  const openModal = (apartment: ApartmentUnitRecommendation) => {
    router.push({
      pathname: '/modal',
      params: { apartment: JSON.stringify(apartment), showScore: 1},
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserPreferences(1, 10).then((initialApartments) => {
          setApartments(initialApartments);
        });
      }
    }, [user, filterOption])
  );

  const fetchMoreApartments = async () => {
    const currentTime = Date.now();
    const throttleDelay = 1000; // Adjust the delay as needed (in milliseconds)
  
    if (currentTime - lastRequestTime < throttleDelay) {
      return;
    }
  
    setLastRequestTime(currentTime);
  
    const nextPage = Math.floor(apartments.length / 10) + 1;
    const newApartments = await fetchUserPreferences(nextPage, 10);
    setApartments((prevApartments) => [...prevApartments, ...newApartments]);
  };
  const listData = isSkeletonLoading ? dummy : apartments;
  return (
    <View className="flex-1 items-center justify-center">
    <FlatList
      ref={flatListRef}
      data={listData}
      className="flex-grow w-11/12"
      keyExtractor={(item, index) => `${item.propertyId}-${item.key}-${index}`}
      renderItem={({ item: apartment }) => (
        <ApartmentItem
          apartment={apartment}
          token={token}
          isSkeletonLoading={isSkeletonLoading}
          showScore={true}
          onPress={() => openModal(apartment)}
        />
      )}
      onEndReached={fetchMoreApartments}
      onEndReachedThreshold={0.5}

    />
    </View>
  );
}