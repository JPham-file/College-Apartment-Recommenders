import { SafeAreaView, StyleSheet } from "react-native";
import { ClerkProvider, SignedIn, SignedOut} from "@clerk/clerk-expo";
import SignInWithOAuth from "../components/SignInWithOAuth";
import UseUser from "../components/UseUser";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
 
export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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