import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';

export default function TabTwoScreen() {
  return (
    <View className = "flex-1 items-center justify-center">
      <Text className = "font-bold">Profile</Text>
      
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

