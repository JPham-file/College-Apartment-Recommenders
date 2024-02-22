import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { ScrollView, Image } from 'react-native';

export default function TabOneScreen() {


  const getMatchColorClass = (matchPercentage : number) => { 
    //returns native wind color styling based on % match for each apartment
    if (matchPercentage >= 90) return 'text-green-500'; 
    if (matchPercentage >= 70) return 'text-yellow-300'; 
    if (matchPercentage >= 50) return 'text-orange-500'; 
    return 'text-red-600'; 
  };

  const apartments = [
    {
      id: 1,
      name: 'The Woodlands - Unit 6',
      address: '1725 Harvey Mitchell Pkwy S, College Station, TX 77840',
      price: '$650.00',
      match: 95,
    },
    {
      id: 2,
      name: 'The London - Unit 831',
      address: '601 Luther St W, College Station, TX 77840',
      price: '$599.00',
      match: 76,
    },
    {
      id: 3,
      name: 'Park West - Unit 512',
      address: '1725 Harvey Mitchell Pkwy S, College Station, TX 77840',
      price: '$650.00',
      match: 55,
    },
    {
      id: 4,
      name: 'The Woodlands - Unit 6',
      address: '1725 Harvey Mitchell Pkwy S, College Station, TX 77840',
      price: '$650.00',
      match: 47,
    },
    // ... add more apartments as needed
  ];
 
  return (
    <View className="flex-1 items-center justify-center">
     <ScrollView className="flex-grow w-11/12">
        {apartments.map((apartment) => (
          <View key={apartment.id} className="mb-4 px-4 py-2 border-b border-gray-300">
            <Image
              source={require( '../../../assets/images/exampleapartmentpic.jpeg')} 
              className="w-full h-40 rounded-lg" // Image takes full width
              resizeMode="cover" // Ensures the image covers the area without stretching
            />
            <View className="py-2">
              <Text className="text-lg font-semibold">{apartment.name}</Text>
              <Text className="text-gray-500">{apartment.address.substring(0, apartment.address.indexOf(','))},</Text> 
              <Text className="text-gray-500">{apartment.address.substring( apartment.address.indexOf(',') + 2)}</Text>
              <View className="flex-row justify-between items-center pt-2">
                <Text className="text-base font-semibold ">{apartment.price} / month</Text>
                <Text className={`font-bold text-lg ${getMatchColorClass(apartment.match)}`}>{apartment.match}%</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
    
    </View>
  );
}
