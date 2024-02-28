import { Button, SafeAreaView, StyleSheet, View } from 'react-native';
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import SignInWithOAuth from "../../components/SignInWithOAuth";
import FetchUser from "../../components/FetchUser";
import { useState } from 'react';
import { Stack } from 'expo-router';

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button 
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const AuthComponent = () => {
  const [isDbAuthLoading, setDbAuthLoading] = useState<boolean>(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView className="flex">
        <SignedIn>
          <FetchUser setLoading={setDbAuthLoading} />
          {!isDbAuthLoading && <SignOut />}

        </SignedIn>
        <SignedOut>
          <SignInWithOAuth />
        </SignedOut>
      </SafeAreaView>
    </>
  );
}

export default AuthComponent;
