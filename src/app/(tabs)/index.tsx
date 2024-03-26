import {Text, View} from '@/src/components/Themed';
import {useUser} from '@clerk/clerk-expo';
import {useCallback, useState} from 'react';
import {FlatList, Image} from 'react-native';
import {useFocusEffect} from 'expo-router';

interface Apartment {
	id: string;
	name: string;
	address: string;
	match: string; // Assuming match is a percentage stored as a number
	photos: string[];
	modelName: string;
	modelImage: string;
	rent: string;
	score: number;
	leaseOption: string;
}

export default function TabOneScreen() {
	const [apartments, setApartments] = useState<Apartment[]>([]);
	const {user} = useUser();
	const maxScore = 600000;

	const getMatchColorClass = (matchPercentage: number) => {
		//returns native wind color styling based on % match for each apartment
		if (matchPercentage >= 90) return 'text-green-500';
		if (matchPercentage >= 70) return 'text-yellow-300';
		if (matchPercentage >= 50) return 'text-orange-500';
		return 'text-red-600';
	};

	const fetchUserPreferences = async () => {
		try {
			const response = await fetch('http://10.229.16.121:5000/get_recommendations', { //change this line to your ip
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'ID': user!.id,
				},
			});

			if (!response.ok) {
				console.error(response)
				throw new Error('Network response failure: make sure to change IP to your machine IP');
			}
			const data = await response.json();

			const maxScore = data[0].score;

			const transformedApartments = data.map((
        apartment: {
          id: any;
          name: any;
          address: any;
          price: any;
          score: any,
          photos: string[],
          modelImage: string,
          modelName: string,
          rent: string,
          leaseOption: string
        }) => ({
				...apartment,
				match: Number((apartment.score / maxScore) * 100).toFixed(0).toString(),
			}));

			setApartments(transformedApartments);
		} catch (error) {
			console.error('There was an error fetching the user preferences:', error);
		}
	};

	useFocusEffect(
		useCallback(() => {
			if (user) {
				fetchUserPreferences();
			}
		}, [user])
	);


	return (
		<View className="flex-1 items-center justify-center">
			<FlatList
				data={apartments}
				className="flex-grow w-11/12"
				keyExtractor={(item, index) => `${item.id}-${index}`}
				renderItem={({item: apartment, index}) => (
					<View className="mb-4 px-4 py-2 border-b border-gray-300">
						<Image
							source={{uri: (apartment.modelImage && apartment.modelImage?.length !== 0) ? apartment.modelImage : apartment.photos[0]}}
							className="w-full h-40 rounded-lg" // Image takes full width
							resizeMode="cover" // Ensures the image covers the area without stretching
						/>
						<View className="py-2">
							<Text className="text-lg font-semibold">{apartment.name} - {apartment.modelName}</Text>
							<Text className="text-gray-500">{apartment.address.substring(apartment.address.indexOf(','))}</Text>
							<View className="flex-row justify-between items-center pt-2">
								<Text className="text-base font-semibold ">${apartment.rent} / month</Text>
								<Text
									className={`font-bold text-lg ${getMatchColorClass(Number(apartment.match))}`}>{apartment.match}%</Text>
							</View>
						</View>
					</View>
				)}
			>

			</FlatList>


		</View>
	);
}