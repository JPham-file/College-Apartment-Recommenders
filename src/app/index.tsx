import { SafeAreaView, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {

    const navigation = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text>Welcome To Off Campus!</Text>
            <Button title="Sign In" onPress={() => navigation.push("/auth" as any)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }
});