import { ApartmentUnitRecommendation } from '@/src/types';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { FlatList, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { View } from '@/src/components/Themed';
import ApartmentItem from '@/src/components/ApartmentItem';
import dummy from '@/src/lib/skeleton/mocks/ApartmentRecommendation';

export default function SavedApartments() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [apartments, setApartments] = useState<ApartmentUnitRecommendation[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(false);

  const fetchUserPreferences = async () => {
    setIsSkeletonLoading(true);
    const newToken = await getToken();
    setToken(newToken);


    try {
      const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/get_saved_apartments`;
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



      const transformedApartments = data.map((apartment: ApartmentUnitRecommendation) => ({
        ...apartment,

      }));

      setApartments(transformedApartments);
    } catch (error) {
      console.error('There was an error fetching the user preferences:', error);
    } finally {
      setIsSkeletonLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserPreferences();
      }
    }, [user])
  );


  const listData = isSkeletonLoading ? dummy : apartments;
  console.log(listData)

  return (
    <View className="flex-1 items-center justify-center">
      <FlatList
        data={listData}
        className="flex-grow w-11/12"
        keyExtractor={( item, index ) => `${item.propertyId}-${item.key}-${index}`}
        renderItem={({ item: apartment }) => <ApartmentItem apartment={apartment} token={token} isSkeletonLoading={isSkeletonLoading} showScore={false}/>}
      />
    </View>
  );
}