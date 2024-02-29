import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useDatabaseUser } from '@/src/hooks/useDatabaseUser';
import Carousel from 'react-native-reanimated-carousel';
import { Asset, useAssets } from 'expo-asset';

export default function App() {
    const { user, isLoaded } = useDatabaseUser();
    const navigation = useRouter();
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

    useEffect(() => {
        if (!!user && user.has_verified_preferences) {
            setIsRedirecting(true);
            navigation.navigate('/(tabs)');
        }
    }, [user, setIsRedirecting]);

    const imageModules = [
      require('../../assets/images/isometric/Bathroom_1.png'),
      require('../../assets/images/isometric/Kitchen_1.png'),
      require('../../assets/images/isometric/Bedroom_1.png'),
      require('../../assets/images/isometric/Bedroom_2.png'),
      require('../../assets/images/isometric/LivingRoom_1.png'),
    ];
    const [assets, error] = useAssets(imageModules);

    const imageBorderColors = [
      'bg-purple-400',
      'bg-pink-400',
      'bg-sky-400',
      'bg-emerald-400',
      'bg-amber-400',
      'bg-red-400'
    ];

    const renderCarouselItem = ({ item, index }: { item: Asset, index: number }) => {
      const borderColor = imageBorderColors[index % imageBorderColors.length];

      return (
        <View className="flex p-5 justify-center items-center">
          <View className={`p-2 w-fit h-fit rounded-2xl ${borderColor}`}>
            <Image key={item.hash} width={256} height={256} source={{ uri: item.localUri! }} className="rounded-2xl" />
          </View>
        </View>
      );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
              options={{
                  headerShown: false,
              }}
            />

            <Text style={styles.text}>Welcome</Text>
            <Text style={styles.text}>To</Text>
            <Text style={styles.text2}>Off Campus!</Text>
            <Link href="/auth" className="text-neutral-100 text-center flex">
              <Text>Sign In</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        // alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#c9c9c9",
        marginBottom: 20,
        fontSize: 55,
        fontWeight: 'bold'
    },
    text2: {
        color: "#FFFFFF",
        marginBottom: 20,
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 65,
        fontWeight: 'bold'
    },
});