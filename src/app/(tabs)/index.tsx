import { ApartmentUnitRecommendation } from '@/src/types';
import { useUser, useAuth } from '@clerk/clerk-expo';
import React, { useState, useRef, useContext } from 'react';
import { FlatList, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { View } from '@/src/components/Themed';
import ApartmentItem from '@/src/components/ApartmentItem';
import { useFilter } from "@/src/components/FilterContext";
import { useInfiniteQuery } from 'react-query';
import dummy from '@/src/lib/skeleton/mocks/ApartmentRecommendation';
import { ApartmentContext } from '@/src/app/apartment/ApartmentContext';

export default function TabOneScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { filterOption } = useFilter();
  const [token, setToken] = useState<string | null>(null);
  const maxScore = useRef<number>(1);
  const { setApartment } = useContext(ApartmentContext);

  const fetchUserPreferences = async ({ pageParam = 1 }): Promise<ApartmentUnitRecommendation[]> => {
    const newToken = await getToken();
    setToken(newToken);
    const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/get_recommendations?page=${pageParam}&limit=10`;
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${newToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response failure: make sure to change IP to your machine IP');
    }
    const data: ApartmentUnitRecommendation[] = await response.json();
    if (pageParam === 1) {
      maxScore.current = data[0].score;
    }
    let transformedApartments = data.map((apartment: ApartmentUnitRecommendation) => ({
      ...apartment,
      match: Number((apartment.score / maxScore.current) * 100).toFixed(0).toString(),
    }));
    if (filterOption === 'Currently Available') {
      transformedApartments = transformedApartments.filter((apartment: ApartmentUnitRecommendation) => apartment.hasKnownAvailabilities);
    }
    return transformedApartments;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<ApartmentUnitRecommendation[], Error>(
    ['userPreferences', filterOption],
    fetchUserPreferences,
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.length > 0 ? nextPage : undefined;
      },
    }
  );




  const apartments = data?.pages.flatMap((page) => page) || [];

  const openModal = (apartment: ApartmentUnitRecommendation) => {
    setApartment(apartment);
    router.push({
      pathname: '/modal',
      params: {  showScore: 1 },
    });
    
  };

  const renderApartmentItem = ({ item }: { item: ApartmentUnitRecommendation }) => (
    <ApartmentItem
      apartment={item}
      token={token}
      isSkeletonLoading={isLoading}
      showScore={false}
      onPress={() => openModal(item)}
    />
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <FlatList
        data={apartments}
        className="flex-grow w-11/12"
        keyExtractor={(item, index) => `${item.propertyId}-${item.key}-${index}`}
        renderItem={renderApartmentItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}