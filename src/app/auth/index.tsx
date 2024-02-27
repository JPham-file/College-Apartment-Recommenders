import { Button, SafeAreaView, StyleSheet, View } from "react-native";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import SignInWithOAuth from "../../components/SignInWithOAuth";
import FetchUser from "../../components/FetchUser";

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
  return (
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <FetchUser />
          <SignOut />
        </SignedIn>
        <SignedOut>
          <SignInWithOAuth />
        </SignedOut>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000", 
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default AuthComponent;
