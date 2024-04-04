import { ApartmentUnitRecommendation } from '@/src/types';
import { useUser, useAuth } from '@clerk/clerk-expo';
import React, { useCallback, useState, useEffect, useContext} from 'react';
import { FlatList, Image, Text, Pressable, Modal } from 'react-native';
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


  const fetchUserPreferences = async () => {
    setIsSkeletonLoading(false);
    const newToken = await getToken();
    setToken(newToken);


    try {
      const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/get_recommendations`;
      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
      });

      if (!response.ok) {
        console.error(response)
        throw new Error('Network response failure: make sure to change IP to your machine IP');
      }
      const data = await response.json();

      const maxScore = data[0].score;

      let transformedApartments = data.map((apartment: ApartmentUnitRecommendation) => ({
        ...apartment,
        match: Number((apartment.score / maxScore) * 100).toFixed(0).toString(),
      }));
      // Filter based on the selected filterOption, if necessary
      if (filterOption === 'Currently Available') {
        transformedApartments = transformedApartments.filter((apartment: ApartmentUnitRecommendation) => apartment.hasKnownAvailabilities);
      }

      setApartments(transformedApartments);
    } catch (error) {
      console.error('There was an error fetching the user preferences:', error);
    } finally {
      setIsSkeletonLoading(false);
    }
  };


  const openModal = (apartment: ApartmentUnitRecommendation) => {
    router.push({
      pathname: '/modal',
      params: { apartment: JSON.stringify(apartment) },
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserPreferences();
      }
    }, [user, filterOption])
  );


  const listData = isSkeletonLoading ? dummy : apartments;
  return (
    <View className="flex-1 items-center justify-center">
      <FlatList
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
      />
    </View>
  );
}