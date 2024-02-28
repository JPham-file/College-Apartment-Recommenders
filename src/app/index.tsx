import { SafeAreaView, Text, Button, StyleSheet } from 'react-native';
import { SplashScreen, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';


export default function App() {
    const { isLoaded, userId } = useAuth();
    const navigation = useRouter();

    useEffect(() => {
        if (isLoaded || userId) {
            navigation.replace('/(tabs)');
        }
    }, [isLoaded, userId]);

    return (

      <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Welcome</Text>
          <Text style={styles.text}>To</Text>
          <Text style={styles.text2}>Off Campus!</Text>
          <Button
            title="Sign In"
            onPress={() => navigation.push("/auth")}
            color="#1E90FF"
          />
      </SafeAreaView>
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