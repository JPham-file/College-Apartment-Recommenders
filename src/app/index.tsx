import { SafeAreaView, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut} from "@clerk/clerk-expo";
import SignInWithOAuth from "../components/SignInWithOAuth";
import UseUser from "../components/UseUser";

const expo_key = "pk_test_Z3JhbmQtc2t1bmstMzUuY2xlcmsuYWNjb3VudHMuZGV2JA"
 
export default function App() {
  return (
    <ClerkProvider publishableKey={expo_key}>
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <UseUser />
        </SignedIn>
        <SignedOut>
          <SignInWithOAuth />
        </SignedOut>
      </SafeAreaView>
    </ClerkProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});