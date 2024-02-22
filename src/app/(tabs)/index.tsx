import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-bold">Home</Text>
      
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
