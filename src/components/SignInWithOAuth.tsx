import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useOAuth } from "@clerk/clerk-expo";
import { Asset, useAssets } from 'expo-asset';
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import Carousel from 'react-native-reanimated-carousel';

const SignInWithOAuth = () => {
  const imageModules = [
    require('../../assets/images/isometric/Bathroom_1.png'),
    require('../../assets/images/isometric/Kitchen_1.png'),
    require('../../assets/images/isometric/Bedroom_1.png'),
    require('../../assets/images/isometric/Bedroom_2.png'),
    require('../../assets/images/isometric/LivingRoom_1.png'),
  ];
  const [assets, error] = useAssets(imageModules);

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        console.log("Err: unable to create session ID");
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

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
      <View className="flex p-5 justify-center items-center -mr-5">
        <View className={`p-2 w-fit h-fit rounded-2xl ${borderColor}`}>
          <Image key={item.hash} width={256} height={256} source={{ uri: item.localUri! }} className="rounded-2xl" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-col justify-around items-center h-full bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,rgba(0,0,0,0.40)_0%,rgba(255,255,255,0.00)_100%)]">
      <View className="flex flex-row justify-center p-4 shadow rounded-full blur-sm">
        <Carousel
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height / 3,
            display: 'flex',
          }}
          data={assets || []}
          width={Dimensions.get('window').width}
          renderItem={renderCarouselItem}
          autoPlay
          loop
          scrollAnimationDuration={1000}
          mode="horizontal-stack"
          modeConfig={{
            snapDirection: 'left',
            stackInterval: 50,
            scaleInterval: 0.1
          }}
        />
      </View>

      <View className="gap-y-2">
        <Text className="text-neutral-200 text-2xl text-center">Create an Account</Text>
      </View>

      <View className="flex gap-y-4">
        <View className="bg-neutral-100 w-fit rounded-full">
          <TouchableOpacity onPress={onPress} className="flex flex-row items-center justify-start py-4 px-8 gap-4">
            <FontAwesome name="google" size={24} className="" />
            <Text className="text-neutral-900">Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-neutral-400 w-fit rounded-full">
          <TouchableOpacity disabled onPress={() => null} className="flex flex-row items-center justify-start py-4 px-8 gap-4">
            <FontAwesome name="apple" size={24} className="" />
            <Text className="text-neutral-900">Continue with Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

  );
};

export default SignInWithOAuth;
